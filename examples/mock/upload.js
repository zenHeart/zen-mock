const debug = require('debug')('zen-mock:upload');
module.exports = {
    req:{
        method:'post'
    },
    resp:function(req,res) {
        let fileId = req.files.file.md5();
        debug(req.files);
        res.json({
            fileId,
            body:req.body
        })
    }
}
