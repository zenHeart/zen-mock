
'use strict'
const {createPath} = require('./request-path');
const {createUrl} = require('./request-url');
const {createBody} = require('./http-body');
const {createHeader} = require('./http-header');

 /**           
 * 请求对象的默认配置
 */         
const defaultConfig =  {
        method:'get', //请求方法
        path:null,
        url:null,
        params:{ //路由字段

        }, 
        query:{ //查询字段

        },   
        header:{ //请求头
            
        },
        body:{ //请求体

        }
};

/**
 * 生成请求对象.
 * @param {string} configFile 配置文件地址
 * @param {root} root 配置文件根目录
 * @param {object} options 覆盖默认请求配置
 */
module.exports = function(configfile='',root='',options={}) {
    //TODO: 目前对象扩展为一维,后续可能采用 deepMerge
    let req = {
        ...defaultConfig,
        ...options
    };

    if(!req.path) { //若请求路径未赋值
        req.path = createPath(configfile,root);
    }
    if(!req.url) { //若 url 未赋值
        req.url = createUrl(req.path,req.params,req.query);
    }

    req.header = createHeader(req.header); //mockjs 生成请求头
    req.body = createBody(req.body); //mockjs 生成请求体

    //返回创建的请求对象
    return req;
}