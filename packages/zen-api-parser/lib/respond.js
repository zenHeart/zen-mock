
'use strict'
/**
 * 后续可优化 req,resp 为独立配置文件.
 * 
 */

const debug = require('debug')('zen-api-parser:respond');
const  deepmerge = require('deepmerge')

const { isObjectHasKeys } = require('./utils');
const { createBody } = require('./http-body')
const { createHeader } = require('./http-header');
const defaultConfig = {
    header: {},
    body:null
}


/**
 * 创建请求
 * @param {mixed} options 支持不同类型
 */
exports = module.exports = function respond(options = {}) {
    if (typeof options === 'function') { //若整个配置项为函数则直接返回作为 respond
        return Object.assign(options, parseConfig());
    } else if (isObjectHasKeys(['body'], options)) { //若包含 body 配置则生成响应函数
        return createRespond(options)
    } else {
        //不符合上述规则则将整个配置作为响应体
        return createRespond({
            body: options
        })
    }
}

/**
* 解析配置
* 默认返回 express 响应函数
* @param {object} options 支持配置项
* @param {mixed} options.body 设置请求体,默认为 json 符合 http://expressjs.com/zh-cn/api.html#res.set
* @param {object.header} options.header 设置请求头,符合 http://expressjs.com/zh-cn/api.html#res.set
*/
function parseConfig(options = {}) {
    let config = deepmerge(defaultConfig,options);
    let {header,body} = config;
    config.header = createHeader(header);
    config.body = createHeader(body);

    return config;//返回 mock 后的配置
}

/**
* 创建响应函数.
* 默认返回 express 响应函数
* @param {object} options 支持配置项
* @param {mixed} options.body 设置请求体,默认为 json 符合 http://expressjs.com/zh-cn/api.html#res.set
* @param {object.header} options.header 设置请求头,符合 http://expressjs.com/zh-cn/api.html#res.set
*/
function createRespond(options = {}) {

    let respondConfig = parseConfig(options);

    let respond = function (req, res) {
        res.set(respondConfig.header);//设置请求头
        res.json(respondConfig.body);
    };
    return Object.assign(respond, respondConfig);
}




