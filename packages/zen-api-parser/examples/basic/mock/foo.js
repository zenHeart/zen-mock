module.exports = {
    req:{
        path:'/foo/:id',//设置请求路径,符合 express routing,详见 http://expressjs.com/en/guide/routing.html
        params:{
            id:/\d{32}/ //mock path 中的参数 id
        },
        header:{
            token:/\d{32}/ //mock 请求头 token
        },
        query:{
            time:/\d{10}/ //mock 查询时间 time
        }
    },
    resp:{
        header:{
            'Set-Cookie':'foo=bar' //mock 响应 cookie
        },
        body:{ //mock 响应体
            code:/\d{6}/,
            msg:'ok',
            data:{
                a:1
            }
        }
    }
}