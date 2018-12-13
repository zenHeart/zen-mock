const zenApiParser  = require('zen-api-parser');
const root = __dirname+'/mock';
const configFile = root+'/foo.js';

const result = zenApiParser(configFile,root);

/**
 * 返回解析后的对象.
 * 注意 resp 为一个 express 处理句柄
 */
console.log(result);
