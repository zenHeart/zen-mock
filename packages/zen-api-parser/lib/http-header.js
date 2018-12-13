
'use strict'
/**
 * 设置 http 头部
 */
const Mockjs = require('mockjs');

/**
 * 采用 mockjs 创建请求头
 */
exports.createHeader = function(headers={}) {
    return Mockjs.mock(headers);
}

