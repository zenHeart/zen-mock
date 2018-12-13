
module.exports = {
    req:{
        method:'post',
        header:{
            'Content-Type':'application/x-www-form-urlencoded'
        },
        body:{
            a:1,
            b:2
        }
    },
    resp:function(req,res) {
        res.json(1);
    }
}