
'use strict'
/**
 * 处理请求路径
 * 
 */
const path = require('path');

/**
 * 基于文件名创建请求 path.
 * @param {string} filePath 文件路径,必须为绝对路径.
 * @param {stirng} rootPat 资源的根目录
 */
exports.createPath = function createPath(filePath, root) {
    let parsePath = path.parse(path.relative(root, filePath));
    let filename = parsePath.name;

    //TODO: 此处可增加配置项,设定 index 文件的转换规则
    //若文件名为 index 则不将此文件名作为路径
    if (filename === 'index') {
        return path.join('/', parsePath.dir);
    } else {
        return path.join('/', parsePath.dir, parsePath.name);
    }
}
