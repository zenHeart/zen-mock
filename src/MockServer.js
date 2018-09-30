`use strict`;

const debug = require('debug')('zen-mock:MockServer');
const path = require('path');
//express server
const express = require('express');

//解析 api 配置文件
const apiConfigParser = require('./apiConfigParser');
//独立的工具包
const { loopParserPath } = require('./utils');


/**
 * 默认配置
 */
const defaultConfig = {
    mockDir: path.resolve(process.cwd(), 'mock'),
    hotLoad: true
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
     * @param {String} config.mockDir mock 的配置文件夹.
     * @param {bool} config.hotload 是否开启热加载.默认开启
     */
    constructor(config) {
        //创建  app 实例
        this.config = { ...config, ...defaultConfig };
        //添加快捷索引
        this.mockDir = this.config.mockDir;
        this.configFiles = loopParserPath(this.mockDir);

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
        if (this.config.hotLoad) {
            this.app.use('/', this.hotLoad());
        }

        //导入并解析所有 api 配置文件到 app 实例
        this.configFiles.forEach((apiConfigFile) => {
            this.loadApi(apiConfigFile);
        })
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
        const apiMergeConfig = this.megergeConfig(apiOriginConfig);

        //提取请求和响应配置项
        const reqConfig = apiMergeConfig.req;
        const respConfig = apiMergeConfig.resp;

        //判断响应类型,若非函数则利用配置函数解析
        if (typeof respConfig != 'function') {
            this.app[reqConfig.method](reqConfig.path, this.generateResp(respConfig));
        } else { //是函数则直接加载响应
            this.app[reqConfig.method](reqConfig.path, respConfig);
        }
    }

    /**
     * hotLoad 中间件实现热加载.
     * @param {string} mockDir 配置文件路径
     */
    hotLoad() {
        let self = this;
        let reload = function (req, res, next) {
            //响应结束后,丢弃 router
            res.on('finish', function () {
                //重新加载文件
                self.configFiles = loopParserPath(self.mockDir);
                //清除路由
                delete self.app._router;
                self.app.use('/',reload);
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








