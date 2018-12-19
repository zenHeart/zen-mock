/**
 * 测试运行器
 */
const { EventEmitter } = require('events');
const request = require('supertest');
const MockServer = require('zen-mock');
const minimatch = require("minimatch")
const debug = require('debug')('zm:zm-test/runner');
const fs = require('fs');



const { apiEqual } = require('./api-assert');
const { readConfig } = require('../../utils');

const defaultConfig = {
    timeout: 5000,//请求默认等待时间,最长为 5 s
    totalTests: 0,//测试用例数量,默认为
}
const TEST_STATUS = {
    INITIAL: 'initial',//初始化
    START: 'start',//开始测试用例
    FAIL: 'fail',//测试用例失败
    SUCCESS: 'success',//测试用例成功
    FINISH: 'finish' //完成所有测试用例
}

exports = module.exports = class TestRunner extends EventEmitter {
    constructor(config = defaultConfig) {
        super();
        //目前是一维配置无需 deepMerge
        this.config = { ...defaultConfig, ...config };//简单合并配置
        this.setup();

    }
    setup() {
        //读取命令行运行配置
        let config = readConfig();
        if (!config.testUrl) { //若未配置待测试地址则抛出错误
            throw new Error('请配置待测试地址,例如  testUrl:"http://localhost/test"');
        }

        //实例化 zen-mock
        this.mockServer = new MockServer(config);
        this.apisConfig = this.mockServer.apisConfig;//快捷获取 api 的配置项
        debug("parser config finish ,all configs:%o",this.apisConfig);
        this.testUnits = {};//存储所有测试用例,默认为空
        //配置待测服务器地址
        this.requestTester = request(config.testUrl);
        this.status = TEST_STATUS.INITIAL;


        //绑定测试用例失败处理,注意 bind 是防止异步 this 丢失
        this._onTestUnitFail = this._onTestUnitFail.bind(this);
        this.on(TEST_STATUS.FAIL, this._onTestUnitFail);

        //绑定测试用例成功处理
        this._onTestUnitSuccess = this._onTestUnitSuccess.bind(this);
        this.on(TEST_STATUS.SUCCESS, this._onTestUnitSuccess);
    }

    /**
     * 
     * @param {object} options 支持如下选项
     */
    run(options) {//运行测试用例

        let apisKey = Object.keys(this.apisConfig);

        this.emit(TEST_STATUS.START);//开启测测试用例运行


        apisKey.forEach(key => {
            if (options.file) { //如果设置了测试文件
                debug(options);
                if (!minimatch(key, options.file)) { //如果文件不匹配设定模式
                    return;
                }
            }

            this.testUnits[key] = TEST_STATUS.START;

            apiTestRunner(this.mockServer, this.requestTester, this.apisConfig[key])
                .then(() => {
                    this.emit(TEST_STATUS.SUCCESS, key); //测试用例运行成功返回结果
                })
                .catch((err) => this.emit(TEST_STATUS.FAIL, err, key)); //运行失败返回错误
        });
    }



    _onTestUnitSuccess(key) {
        this.testUnits[key] = TEST_STATUS.SUCCESS
        this._checkFinishTest();
    }
    _onTestUnitFail(err, key) {
        this.testUnits[key] = TEST_STATUS.FAIL
        this._checkFinishTest();
    }

    _checkFinishTest() { //判断是否完成所有测试
        let isAllTestFinish = true;//默认全部执行成功

        for (let key in this.testUnits) {
            let isUnitFinish = (this.testUnits[key] !== TEST_STATUS.START);//若单个用例状态不为 start 说明执行完成
            isAllTestFinish &= isUnitFinish;//与逻辑,表示所有用例执行完成才返回 true
        }

        //TODO:注意 emit 为同步,此处采用 nexttick 确保 finsh 在所有测试用例完成后执行
        if (isAllTestFinish) {
            this.status = TEST_STATUS.FINISH;//说明完成所有测试用例
            process.nextTick(() => {
                this.emit(this.status, Object.keys(this.testUnits).length)
            });//发送完成事件)

        }
    }
}
exports.TEST_STATUS = TEST_STATUS;

/**
 * api 测试运行器
 * @param {Object} httpAgent http 代理,用来执行请求
 * @param {Object} apiConfig api 接口配置文件 
 */
async function apiTestRunner(mockServer, httpAgent, apiConfig) {
    let { req } = apiConfig;

    let mockRespond = await makeRequest(request(mockServer.app), req);
    let remoteRespond = await makeRequest(httpAgent, req);

    apiEqual(mockRespond.body, remoteRespond.body)
}

/**
 * 创建请求对象
 * @param {object} httpAgent http 代理
 * @param {object} reqConfig 请求配置
 */
function makeRequest(httpAgent, reqConfig) {
    let { method, url, header, body } = reqConfig;
    if (header['Content-Type'] === 'multipart/form-data') {
        httpAgent = httpAgent[method](url).set(header);
        Object.keys(body).forEach((key) => {
            let value = body[key];
            if (fs.existsSync(value)) {
                httpAgent = httpAgent.attach(key, value)
            } else {
                httpAgent = httpAgent.field(key, value)
            }
        })
        return httpAgent;

    } else {
        return httpAgent[method](url)
            .set(header).send(body);
    }

}