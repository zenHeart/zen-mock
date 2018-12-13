'use strict'
/**
 * 处理请求路径
 * 
 */
const Mockjs = require('mockjs');


/**
 * 结合 path, params 和 query 创建 url
 * @param {string} reqPath 请求路径
 * @param {object} reqParams 请求路径携带参数
 * @param {object} reqQuery 请求携带的查询参数
 */ 
exports.createUrl = function createUrl(reqPath,reqParams = {},reqQuery = {}) {
    let mockReqParams = Mockjs.mock(reqParams)
    let mockReqQuery = Mockjs.mock(reqQuery)
    let reqUrl = reqPath;
    //替换路径中携带的键名
    for(let key in mockReqParams) {
        reqUrl =reqUrl.replace(`:${key}`,mockReqParams[key])
    }

    //拼接查询字段
    Object.keys(mockReqQuery).forEach((key, index) => {
        if (index === 0) { //第一个 query 添加 ? 号
            //TODO:不支持 query 为对象模式,只是基础值
            reqUrl += `?${key}=${mockReqQuery[key]}`;
        } else {
            reqUrl += `&${key}=${mockReqQuery[key]}`
        }
    })
    return reqUrl;
 }
