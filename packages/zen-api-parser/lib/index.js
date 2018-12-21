'use strict';
const deepmerge = require('deepmerge')
const {DEFAUL_CONFIG} = require('./constants');
const { isObjectHasKeys } = require('./utils');
const respondParser = require('./respond');
const requestParser = require('./request');



/**
 * api 配置文件解析器,读取配置文件返回解析后 http 对象
 * TODO:目前采用 require 进行解析,后续考虑是否支持其他格式
 * @param {string} configFile 配置文件路径,绝对路径
 * @param {string} root 配置文件根目录
 * @param {object} options 额外配置项 
 */
module.exports = function zenApiParser(configFile, root, options = DEFAUL_CONFIG) {
    //TODO:此处是否需要捕获解析失败
    let config = deepmerge(DEFAUL_CONFIG,options);
    let apiOriginConfig = require(configFile);
    let request, requestConfig, respond, respondConfig;
 
    if (typeof apiOriginConfig === 'function') { //输入为函数直接作为响应配置
        respondConfig =apiOriginConfig;
    } else if (isObjectHasKeys(['req', 'resp'], apiOriginConfig)) { //判断是否包含请求和响应配置
        requestConfig = deepmerge(config,apiOriginConfig.req);
        respondConfig = apiOriginConfig.resp;
    } else {//若没有请求配置,则整个解析结果作为响应配置传入
        respondConfig = apiOriginConfig;
    }


    request = requestParser(configFile, root, requestConfig);
    respond = respondParser(respondConfig);
    return {
        req: request,//返回请求配置
        resp: respond //返回响应函数
    }
}
