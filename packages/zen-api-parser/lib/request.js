
'use strict'
const deepmerge = require('deepmerge')

const { createPath } = require('./request-path');
const { createUrl } = require('./request-url');
const { createBody } = require('./http-body');
const { createHeader } = require('./http-header');

/**           
* 请求对象的默认配置
*/
const defaultConfig = {
    method: 'get',
    path: '',
    url: '',
    params: {},
    query: {},
    header:{},
    body: {}
};

/**
 * 生成请求对象.
 * @param {string} configFile 配置文件地址
 * @param {root} root 配置文件根目录
 * @param {object} options 覆盖默认请求配置
 */
module.exports = function (configfile = '', root = '', options = {}) {
    let config = deepmerge(defaultConfig, options);

    let { url, path, params, query, header, body } = config;
    if (!path) { //若请求路径未赋值
        path=config.path = createPath(configfile, root);
    }
    if (!url) { //若 url 未赋值
        config.url = createUrl(path, params, query);
    }

    config.header = createHeader(header); //mockjs 生成请求头
    config.body = createHeader(body); //mockjs 生成请求体

    //返回创建的请求对象
    return config;
}