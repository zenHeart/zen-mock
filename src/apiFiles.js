/**
 * api 文件管理对象
 */
const fs = require('fs');

module.exports = apis;

const apis = {
    configFiles: {},//存储各 api 信息
    saveFileInfo:(apiKey,filenName) => {
        this.configFiles[apiKey] = {
            filenName,
            modifyTime:this.getFileModifyTime(filenName)
        }
    },
    getFileInfo:(apiKey) => {
        return this.configFiles[apiKey];
    },
    getFileModifyTime: (filenName) => {
        return fs.statSync(filenName).mtime;
    },
    updateModify: (apiKey) => {
        let fileInfo = this.getFileInfo(apiKey);
        let lastModifyTime =  this.getFileModifyTime(fileInfo.filenName);

        //若文件修改则跟新修改时间,并返回文件名
        if(lastModifyTime > fileInfo.modifyTime) {
            fileInfo.modifyTime = lastModifyTime;
            return fileInfo.filenName;
        } else { //否则返回空
            return false;
        }
    }
}
