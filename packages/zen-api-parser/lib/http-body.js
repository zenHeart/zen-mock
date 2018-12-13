
'use strict'
/**
 * mockjs 创建 http 请求体
 */
const Mockjs = require('mockjs');

/**
 * 采用 mockjs 创建请求头
 */
exports.createBody = function(body={}) {
    return Mockjs.mock(body);
}

