const Mock = require('mockjs');
const debug = require('debug')('zen-mock:apiConfigParser');

 /**
  * api 默认配置项.
  * 
  */
const  apoDefaultConfig =  {
    req:{
        method:'get', //请求方法
        path:'/', //路径参数
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
    megergeConfig,
    generateResp
};


/**
 * 合并默认配置和用户配置
 * @param {object} apiCustomConfig 用户 api 配置.  
 */
function megergeConfig(apiCustomConfig) {
    let req = {
        ...apoDefaultConfig.req,
        ...apiCustomConfig.req,
    }
    let resp = apiCustomConfig.resp;

    //重新合并配置项
    return {
        req,
        resp
    }
}



/**
* 解析响应配置.生成 express 响应函数
* @param {object} options  根据 resp 配置项生成响应
*/
function generateResp(options) {
    return function (req, res) {
        //只有定义了 header 才进行解析
        if (options.header) {
            //若定义了 cookie 则进行设定
            if (options.header.cookie) {
                generateCookie(options.header.cookie, res);
            }
        }


        //确保返回在最后触发
        if (options.body) {
            let mockBody = generateBody(options.body);
            res.send(mockBody);
        }
    };
}


/**
* 根据 cookie 配置项生成 cookie
* @param {array} options 对应的 cookie 配置 
* @param {respond} res express respond 对象 */
function generateCookie(options, res) {
    options.forEach((cookie) => {
        debug(cookie);
        res.cookie.apply(res, cookie);
    })
}

/**
* 解析包体
* @param {array} body 对应的响应内容
*/
function generateBody(body) {
    return Mock.mock(body);
}

