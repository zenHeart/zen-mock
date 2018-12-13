'use strict';
const {isObjectHasKeys} = require('./utils');
const respondParser = require('./respond');
const requestParser =  require('./request');


/**
 * api 配置文件解析器,读取配置文件返回解析后 http 对象
 * TODO:目前采用 require 进行解析,后续考虑是否支持其他格式
 * @param {string} configFile 配置文件路径,绝对路径
 * @param {string} root 配置文件根目录
 * @param {object} options 额外配置项 
 */
module.exports = function zenApiParser(configFile, root, options={}) {
    //TODO:此处是否需要捕获解析失败
    let apiOriginConfig = require(configFile);
    let request,respond;

    //如果包含请求和响应配置
    if(isObjectHasKeys(['req','resp'],apiOriginConfig)) {
        request = requestParser(configFile,root,apiOriginConfig.req);
        respond = respondParser(apiOriginConfig.resp);
    } else {//若没有请求配置,则整个解析结果作为响应配置传入
        request = requestParser(configFile,root,apiOriginConfig);
        respond = respondParser(apiOriginConfig);
    }
 
    return {
        req:request,//返回请求配置
        resp:respond //返回响应函数
    }
}
