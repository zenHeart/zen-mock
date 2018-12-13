module.exports = {
    req:{
        path:'/apps',
        method:'post',
        body:{
            appName:/\w{32}/,
        }
    },
    resp:function(req,res) {
        res.json({
            code:'demo',
            msg:'ok',
            data:req.body
        });
    }
}