'use strict'

const fs = require('fs');
const path = require('path');
const debug = require('debug')('zen-mock:parserServer');
const minimatch = require('minimatch');// 采用 glob 来处理文件解析问题

const defaultExtPattern = "*.js?(on)"; //默认合法的后缀名
const defaultRoot = path.join(process.cwd(), 'mock'); //默认合法的后缀名

exports.loopParserPath = loopParserPath;
exports.isIllegatExt = isIllegatExt;
exports.isIgnorePath = isIgnorePath;
exports.getBaseName = getBaseName;
exports.getRelativeName = getRelativeName;

/**
 * 判断文件后缀是否符合要求
 * @param {string} filename 文件名包含后缀
 * @param {string} pattern 符合 minimatch 规则
 */
function isIllegatExt(filename, pattern = defaultExtPattern) {
    if (minimatch(filename, pattern)) { //只过滤符合特定格式的文件
        return true;
    } else {
        return false;//不符合返回空
    }
}

/**
 * 判断资源是否被忽略
 * @param {source} source 需要判断的资源,采用绝对路径
 * @param {array} ignorePath 逗号格式的目录
 * @return {boolean} true-> 在忽略资源中为真
 */
function isIgnorePath(source, ignorePath) {
    return ignorePath.some((ele) => ele == source);
}


/**
 * 
 * @param {object} options 路径解析函数.
 * @param {string} options.root 解析对应的根目录.
 * @param {string} options.extPattern 合法的文件后缀,符合 minimatch 中的后缀
 * @param {array} options.ignoreDir 需要忽略的文件夹,采用逗号分隔
 */
// TODO: 后续添加 dir 绝对路径判读及处理
//TODO: 添加自动解析文件名作为为 path 的功能
//TODO: 此处赋值需优化
function loopParserPath(options = {}) {
    let extPattern = options.extPattern || defaultExtPattern;
    let rootPath = options.root || defaultRoot;
    //非绝对路径直接抛出错误
    if (!path.isAbsolute(rootPath)) {
        throw new Error("make sure is absolute path,you can use path.resolve(__dirname,<relativePath>)");
    }
    //存储所有 api 配置文件
    let allApiConfigFile = [];
    //TODO:提取忽略目录的
    //TODO:此处忽略目录应该只计算一次,不应反复计算 
    let ignorePath = relativeToAbsolutPath([].concat(options.staticDir,options.ignoreDir),rootPath);

    //读取该目录,并遍历目录内容
    fs.readdirSync(rootPath).forEach((source) => {
        //获取资源绝对路径
        let absoluteSource = path.resolve(rootPath, source);
        //判断是否为目录
        if (fs.lstatSync(absoluteSource).isDirectory() && !isIgnorePath(absoluteSource, ignorePath)) {
            //递归解析资源,返回合法文件
            let subSource = loopParserPath({...options,root: absoluteSource});     //存储所有 api 配置文件
            allApiConfigFile.push(...subSource);
        } else { //默认不是目录就是文件
            //只保存符合后缀的文件
            if (isIllegatExt(source, extPattern)) {
                //匹配符合格式的    //存储所有 api 配置文件文件名
                allApiConfigFile.push(absoluteSource);
            }
        }
    })  //存储所有 api 配置文件
    return allApiConfigFile;
}

/**
 * 转换忽略目录数组为绝对目录
 * @param {array} dirs 忽略目录数组
 */
function relativeToAbsolutPath(dirs,root) {

    return dirs.map( dir => path.join(root,dir));
}

/**
 * 提取文件名的基础部分
 * @param {string} file 文件名
 */
function getBaseName(file) {
    return path.parse(file).name;
}

/**
 * 提取相对 root 文件文件名,携带子目录信息,但剔除文件后缀
 * @param {string} root 根目录
 * @param {string} file 文件绝对路径
 */
function getRelativeName(root, file) {
    let relativeFile = path.relative(root, file)
    let { dir, name } = path.parse(relativeFile);
    return path.join(dir, name)
}