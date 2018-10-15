const path =require('path');
module.exports = {
    req: {
        path: '/foo',
    },
    resp: function(req,res) {
        res.sendFile(path.join(__dirname,'./index.html'));
    }
}