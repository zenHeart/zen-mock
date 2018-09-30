module.exports = {
    req: {
        path: '/foo/func',
    },
    resp:function(req,res) {
        res.send('采用函数返回');
    }
}