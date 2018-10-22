'use strict'

const debug = require('debug')('zen-mock:MockServer');
const path = require('path');
//express server
const express = require('express');

//解析 api 配置文件
const apiConfigParser = require('./parserApiConfig');
//独立的工具包
const { loopParserPath,getRelativeName } = require('./parserServerConfig');

//express body 解析中间件
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');



/**
 * 默认配置
 */
const defaultConfig = {
    root: path.resolve(process.cwd(), 'mock'),
    hotLoad: true,
    staticDir:'static',//配置静态资源目录,相对 root 目录而言
    ignoreDir: [] //配置忽略目录,相对 root 而言,也可采用绝对路径
}


/**
 * 创建 MockServer 扩展 express() 实例
 * 详见 {@link http://expressjs.com/en/4x/api.html#app}.
 * @module MockServer
 */
module.exports = class MockServer {
    /**
     * MockServer 对象
     *
     * @param {Object} config 配置项
     * @param {String} config.root mock 的配置文件夹.
     * @param {bool} config.hotload 是否开启热加载.默认开启
     */
    constructor(config) {

        //创建  app 实例
        this.config = { ...defaultConfig, ...config };

        //添加快捷索引
        this.root = this.config.root;
        this.staticDir = path.join(this.root,this.config.staticDir);

        this.configFiles = loopParserPath(this.config);
        this.apisConfig = {}; //保存所有 api 配置文件


        this.app = express();
        Object.assign(this, apiConfigParser);//混入 api 配置解析器
        //初始化 mockserver
        this.setup();
    }


    /**
     * 额外的启动设定
     */
    setup() {
        //获取所有配置文件路径
        this.loadMiddleWare();
        if (this.config.hotLoad) {
            this.app.use('/', this.hotLoad());
        }

        //导入并解析所有 api 配置文件到 app 实例
        this.configFiles.forEach((apiConfigFile) => {
            let apiConfig = this.loadApi(apiConfigFile);
            let relativeName = getRelativeName(this.root,apiConfigFile);
            this.apisConfig[relativeName] = apiConfig;
        })
    }
    /**
     * 在 app 中预加载中间件
     */
    loadMiddleWare() {
        //在内部挂载 body 处理避免需要在外部去重新处理
        //TODO:由于是 mock ,内部 require 可以接受
        debug(this.config.staticDir);
        this.app.use(path.join('/',this.config.staticDir),express.static(this.staticDir));//设定静态资源目录
        this.app.use(bodyParser.json()); // 解析 application/json
        this.app.use(bodyParser.urlencoded({ extended: true })); //解析 application/x-www-form-
        this.app.use(fileUpload());//解析 mutltipart/formdata
    }


    /**
     * 加载 api 的配置到 server 实例.
     * @param {string} apiConfigFile api 的配置文件
     */
    loadApi(apiConfigFile) {
        //载入 api 原始配置
        //TODO: 此处思考能否静态加载配置文件
        const apiOriginConfig = require(apiConfigFile);
        //获取合并后的 api 配置
        const apiMergeConfig = this.mergeConfig(apiOriginConfig, {
            root: this.root,
            filePath: apiConfigFile
        });

        //提取请求和响应配置项
        const reqConfig = apiMergeConfig.req; //处理请求内容
        const respConfig = apiMergeConfig.resp;


        //判断响应类型,若非函数则利用配置函数解析
        if (typeof respConfig != 'function') {
            this.app[reqConfig.method](reqConfig.path, this.createResp(respConfig));
        } else { //是函数则直接加载响应
            this.app[reqConfig.method](reqConfig.path, respConfig);
        }
        return apiMergeConfig;
        debug('create api success,method:%s,path:%s ', reqConfig.method, reqConfig.path);
    }

    /**
     * hotLoad 中间件实现热加载.
     * @param {string} root 配置文件路径
     */
    hotLoad() {
        let self = this;
        let reload = function (req, res, next) {
            //响应结束后,丢弃 router
            res.on('finish', function () {
                //重新加载文件
                self.configFiles = loopParserPath(self.config);
                //清除路由
                delete self.app._router;
                self.loadMiddleWare();//重载全局中间件
                self.app.use('/', reload);
                self.configFiles.forEach((file) => {
                    const result = delete require.cache[require.resolve(file)];
                    //重载路由
                    self.loadApi(file);
                });
            })
            debug('hotload success!');
            next();
        }
        return reload;
    }
}