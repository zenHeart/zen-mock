/**
 * 
 * @param {array} apiFiles 虽有 api 对应的文件数组
 */
const fs = require('fs');
const  {loadApi} =  require('../mockRouter');

module.exports = function hotReload(apiFiles,router) {
    return function(req,res,next) {
        //利用 方法+path 映射对应文件
        let filekey = req.method+req.path;
        let fileInfo = apiFiles[filekey];//获取文件
        let filename = fileInfo.name;//获取文件

      




    }
}