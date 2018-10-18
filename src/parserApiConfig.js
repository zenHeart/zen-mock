'use strict'
const Mock = require('mockjs');
const path = require('path');
const debug = require('debug')('zen-mock:apiConfigParser');

 /**
  * api 默认配置项.
  * 
  */
const  apiDefaultConfig =  {
    req:{
        method:'get', //请求方法
        params:{ //get 查询字段

        },       
        header:{ //请求头
            
        },
        body:{ //请求体

        }
    },
    resp:{
        header:{ //响应头
        },
        body:{ //响应体

        }
    }
};

//导出合并函数
module.exports = {
    mergeConfig,
    createResp
};


/**
 * 合并默认配置和用户配置
 * @param {object} apiCustomConfig 用户 api 配置.  
 * @param {options} 额外的合并信息
 */
function mergeConfig(apiCustomConfig,options) {
    let req = {
        ...apiDefaultConfig.req,
        ...apiCustomConfig.req,
    }
    //如果没有响应则,认为整个配置为响应包
    //若未定义 resp  说明整个设置为 resp 包.
    let resp = parserRespConfig(apiCustomConfig);

    //如果请求 path 为空则使用文件名作为  path
    if(!req.path) {
        req.path = createPath(options.filePath,options.root);
    }

    //重新合并配置项
   let api=  {
        req,
        resp
    };
    debug(api);
    return api;
}

/**
 * 解析响应配置
 * @param {object} cofig 用户配置项
 */
function parserRespConfig(config) {
    if(config.resp) { //若存在响应项则返回用户配置
        return config.resp;
    } else if(typeof config === 'function') { //若整个配置项为函数则直接返回作为 respond
        return config;
    } else { //若不包含 resp,且非函数响应则将整个配置作为响应体返回
        return {
            body:config
        }
    }
}

/**
 * 基于文件名创建请求 path.
 * @param {string} filePath 文件路径,必须为绝对路径.
 * @param {stirng} rootPat 资源的根目录
 */ 
function createPath(filePath,root) {
   let parsePath = path.parse(path.relative(root,filePath));
    let filename = parsePath.name;
   //若文件名为 index 则不将此文件名作为路径
   if(filename === 'index') {
        return path.join('/',parsePath.dir);
    } else {
        return path.join('/',parsePath.dir,parsePath.name);
   }
   
}

/**
* 解析响应配置.生成 express 响应函数
* @param {object} options  根据 resp 配置项生成响应
*/
function createResp(options) {
    return function (req, res) {
        //只有定义了 header 才进行解析
        if (options.header) {
            //若定义了 cookie 则进行设定
            if (options.header.cookie) {
                createCookie(options.header.cookie, res);
            }
        }


        //确保返回在最后触发
        if (options.body) {
            let mockBody = createBody(options.body);
            res.send(mockBody);
        }
    };
}


/**
* 根据 cookie 配置项生成 cookie
* @param {array} options 对应的 cookie 配置 
* @param {respond} res express respond 对象 */
function createCookie(options, res) {
    options.forEach((cookie) => {
        debug(cookie);
        res.cookie.apply(res, cookie);
    })
}

/**
* 解析包体
* @param {array} body 对应的响应内容
*/
function createBody(body) {
    return Mock.mock(body);
}

