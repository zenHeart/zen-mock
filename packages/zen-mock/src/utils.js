'use strict'

const fs = require('fs');
const path = require('path');
const debug = require('debug')('zen-mock:utils');
const minimatch = require('minimatch');// 采用 glob 来处理文件解析问题
const {DEFAULT_CONFIG} = require('./constants');
const deepmerge = require('deepmerge');



exports.isIllegatExt = isIllegatExt;
exports.isIgnorePath = isIgnorePath;
exports.flattenPathFile = flattenPathFile;
exports.getBaseName = getBaseName;
exports.getRelativeName = getRelativeName;

/**
 * 判断文件后缀是否符合要求
 * 
 * @param {string} filename 文件名包含后缀
 * @param {string} pattern 符合 minimatch ,详见 https://github.com/isaacs/minimatch
 */
function isIllegatExt(filename, pattern = DEFAULT_CONFIG.extPattern) {
   return minimatch(filename,pattern);
}

/**
 * 判断资源是否属于忽略目录
 * @param {string} sourcePath 需要判断的资源目录,采用绝对路径
 * @param {array} ignorePath 忽略目录的数组,绝对路径
 * @return {boolean} true-> 在忽略资源中为真
 */
function isIgnorePath(source, ignorePath) {
    return ignorePath.some((ele) => ele === source);
}


/**
 * 扁平化目录中的文件,以数组形式保存目录树下所有符合要求文件
 * 
 * @param {string} root 需要扁平化的目录,必须为绝对路径
 * @param {string} options.extPattern 可选,符合 minimatch 中的后缀,配置后只提取符合要求文件
 * @param {array} options.ignoreDir  葫芦目录,相对 root 而言,配置后会跳过该目录
 */
function flattenPathFile(root,options={}) {
      //非绝对路径直接抛出错误
      if (!path.isAbsolute(root)) {
        throw new Error("make sure is absolute path,you can use path.join(__dirname,<relativePath>)");
    }

    /**
     * 合并默认配置
     * 由于配置项为 1 维未采用 deepmerge 
     */
    options = deepmerge({
        extPattern:DEFAULT_CONFIG.extPattern
    },options);

    let {extPattern} = options;
    let flattenPathFiles = [];//存储扁平化后的文件
    let absoluteIgnoreDir=[];

    if(options.ignoreDir) { //如果设定了忽略目录,则转换此目录为相对 root 的绝对模式
        absoluteIgnoreDir = relativeToAbsolutPath(options.ignoreDir,root);
    }
    
    //读取该目录,并遍历目录内容
    fs.readdirSync(root).forEach((source) => {
        //获取资源绝对路径
        let absoluteSource = path.resolve(root, source);

        /**
         * 判断目录
         * TODO: 此处有优化空间,在配置为空时刻不执行 isIgnorePath,此处这样简化了分情况处理配置的问题
         */
        if (fs.lstatSync(absoluteSource).isDirectory() && !isIgnorePath(absoluteSource, absoluteIgnoreDir)) {
            /**
             * 递归解析,返回扁平化的目录结构
             * 注意忽略目录只在第一层,并非递归解析忽略
             */
            let subSources = flattenPathFile(absoluteSource,{
                extPattern
            });  
            flattenPathFiles.push(...subSources);
        } else { //默认不是目录就是文件
            //只保存符合后缀的文件
            if (isIllegatExt(source, extPattern)) {
                //匹配符合格式的文件
                flattenPathFiles.push(absoluteSource);
            }
        }
    })  //存储所有 api 配置文件
    return flattenPathFiles;
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