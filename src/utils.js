const fs = require('fs');
const path = require('path');
const debug = require('debug')('zen-mock:utils');

exports.loopParserPath = loopParserPath;
exports.isIllegatExt = isIllegatExt;

/**
 * 判断文件后缀是否符合要求
 * @param {string} filename  文件名
 * @param {array} ext 符合要求的后缀名
 */
//TODO: 需要对比此操作和 path.parse 谁更高效,此处默认只支持 js,json
function isIllegatExt(fileName,ext = ['.js','.json']) {
    let fileExt = path.extname(fileName);
    if(ext.includes(fileExt)) { //只过滤符合特定格式的文件
        return true;
    } else {
        return false;//不符合返回空
    }
}

/**
 * 
 * @param {string} dir 绝对路径.
 */
 // TODO: 后续添加 dir 绝对路径判读及处理
function loopParserPath(dir) {
    //非绝对路径直接抛出错误
    if (!path.isAbsolute(dir)) {
        throw new Error("make sure is absolute path,you can use path.resolve(__dirname,<relativePath>)");
    }

    let pathName = [];
    //设定的 api 配置文件目录的绝对路径
    let rootPath = dir;

    //读取该目录,并遍历目录内容
    fs.readdirSync(rootPath).forEach((source) => {
        //获取资源绝对路径
        let absoluteSource = path.resolve(rootPath,source);
        //TODO: 添加自动解析文件名作为
        let relativePath = path.relative(rootPath,absoluteSource);

        //判断是否为目录
        if(fs.lstatSync(absoluteSource).isDirectory()) {
           let subPathName = loopParserPath(absoluteSource);
           pathName.push(...subPathName);
        } else { //默认不是目录就是文件
            //只保存符合后缀的文件
            if(isIllegatExt(absoluteSource)) {
                pathName.push(absoluteSource);
            }
        }
    })
    return pathName;
}

