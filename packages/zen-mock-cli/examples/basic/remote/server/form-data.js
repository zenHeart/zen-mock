
module.exports = {
    req:{
        method:'post',
        header:{
            'Content-Type':'multipart/form-data'
        },
        body:{
            a:1,
            b:2,
            file1:__dirname+'/form-data.txt'
        }
    },
    resp:function(req,res) {
        let {files} = req;
        let fileInfo = Object.keys(files).map((key) => {
            return {
                name:files[key].name,
                fileId:files[key].md5()
            }
        } )

        res.json({
            code:'0',
            msg:'ok',
            data:fileInfo
        });
    }
}