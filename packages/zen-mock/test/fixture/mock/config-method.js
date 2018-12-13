/**
 * 所有配置项说明
 */
module.exports = {
    req: {
        method:'post' //支持所有合法请求
    },
    resp: function(req,res) { //符合 express handle 的处理句柄
        
        res.json({
            code:/\d{32}/,
            msg:'ok',
            data:{
                req:req.body
            }
        })
    }
}