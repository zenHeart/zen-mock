module.exports = {
    req:{
        path:'/app/:appId',
        params:{
            appId:/\w{32}/
        },
        query:{
            before:/\d{4}-\d{4}/,
            appName:/\w{10}/
        }
    },
    resp:{
        body:{
            code:'\d{6}',
            msg:'ok',
            data:{
                appName:'de'
            }
        }
    }
}