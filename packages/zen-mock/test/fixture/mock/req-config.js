module.exports = {
    req: {
        path: '/req', //配置路由
        method:'post' //配置方法
    },
    resp: function(req,res) { //符合 express handle 的处理句柄
        res.json({
            code:/\d{32}/,
            msg:'ok',
            data:req.body
        })
    }
}