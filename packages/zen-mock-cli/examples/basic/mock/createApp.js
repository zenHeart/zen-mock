module.exports = {
    req:{
        path:'/apps',
        method:'post',
        body:{
            appId:10,
        }
    },
    resp:{
        body:{
            code:'\d{6}',
            msg:'ok',
            data:{
                appId:/\w{32}/
            }
        }
    }
}