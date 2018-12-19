const fs = require('fs');
const path = require('path');
const {createCollertions} = require('./collections');
const debug = require('debug')('zm:command/zm-postman');
const {colorPrint} = require('../../options');
const defaultConfig = {
    savePath:path.resolve(),
    saveName:'zm.json'
}

/**
 * @param {string} files 导出配置为 postman collection 格式
 */
module.exports = function zmPostman(options) {
    let collections = createCollertions(options);
    let savePath = path.join(defaultConfig.savePath,defaultConfig.saveName);
    fs.writeFileSync(savePath,JSON.stringify(collections));
    colorPrint('success',`已保存为 zm.json,可导入 postman`);
}

