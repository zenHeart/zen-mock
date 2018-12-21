'use strict'

const debug = require('debug')('zen-mock:MockServer');
const path = require('path');
//express server
const express = require('express');

//解析 api 配置文件
const apiConfigParser = require('zen-api-parser');

const { DEFAULT_CONFIG } = require('./constants');
const deepmerge = require('deepmerge');

//独立的工具包
const { flattenPathFile, getRelativeName } = require('./utils');

//express 日志中间件
const morgan = require('morgan')
//express body 解析中间件
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');


/**
 * 创建 MockServer 扩展 express() 实例
 * 详见 {@link http://expressjs.com/en/4x/api.html#app}.
 * @module MockServer
 */
module.exports = class MockServer {
    /**
     * MockServer 对象
     *
     * @param {object} config 配置项
     * @param {string} config.root 可选,默认为相对执行路径的 mock 目录.
     * @param {string} config.staticDir 可选静态资源目录,相对 root 而言,默认为 'static',
     * @param {string} config.extPattern 可选,加载符合格式的文件,支持 minimatch 默认为 "*.js?(on)",
     * @param {bool} config.hotReload 可选,是否开启热加载.默认开启
     * @param {array} config.ignoreDir 可选,默认为空,填入相对 root 目录的路径,例如 ['ignore']
     */
    constructor(config = {}) {

        //创建  app 实例
        this.config = deepmerge(DEFAULT_CONFIG,config)

        //添加快捷索引
        this.root = this.config.root;
        this.staticDir = path.join(this.root, this.config.staticDir);
        this.configFiles = this._getConfigFiles();


        this.apisConfig = {}; //保存所有 api 配置文件
        this.app = express();
        //初始化 mockserver
        this.setup();
    }


    /**
     * 额外的启动设定
     */
    setup() {
        //获取所有配置文件路径
        this.loadMiddleWare();
        if (this.config.hotReload) {
            this.app.use('/', this.hotReload());
        }

        //导入并解析所有 api 配置文件到 app 实例
        this.configFiles.forEach((apiConfigFile) => {
            let apiConfig = this.loadApi(apiConfigFile);
            let relativeName = getRelativeName(this.root, apiConfigFile);
            this.apisConfig[relativeName] = apiConfig;
        })
    }
    /**
     * 在 app 中预加载中间件
     */
    loadMiddleWare() {
        //在内部挂载中间件,避免外部处理
        debug(this.config.staticDir);
        // this.app.use(morgan('dev'));//日志系统
        this.app.use(path.join('/', this.config.staticDir), express.static(this.staticDir));//设定静态资源目录
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
        let {namespace} = this.config;
        let apiConfig = apiConfigParser(apiConfigFile, this.root,{
            namespace
        });
        let { req, resp } = apiConfig;

        this.app[req.method](req.path, resp);

        debug('create api success,config:%o', apiConfig);
        return apiConfig;
    }

    /**
     * hotReload 中间件实现热加载.
     * @param {string} root 配置文件路径
     */
    hotReload() {
        let self = this;
        let reload = function (req, res, next) {
            //响应结束后,丢弃 router
            res.on('finish', function () {
                //重新加载文件
                self.configFiles = self._getConfigFiles();
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
            debug('hotReload success!');
            next();
        }
        return reload;
    }

    //拉取并返回所有配置文件
    _getConfigFiles() {
        //合并 static 和 ignore 作为函数传入项
        let ignoreDir = [this.config.staticDir, ...this.config.ignoreDir]
        return flattenPathFile(this.root, { //提取所有符合要求的目录
            ignoreDir,
            extPattern: this.config.extPattern
        });

    }
}