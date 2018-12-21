const fs = require('fs');
const path = require('path');
const {createCollertions} = require('./collections');
const debug = require('debug')('zm:command/zm-postman');
const {colorPrint} = require('../../options');
const {postman:defaultConfig} = require('../../constant').DEFAULT_CONFIG;

/**
 * @param {string} files 导出配置为 postman collection 格式
 */
module.exports = function zmPostman(options = defaultConfig) {
    let collections = createCollertions(options);
    let savePath = path.join(options.savePath,options.filename+'.json');
    fs.writeFileSync(savePath,JSON.stringify(collections));
    colorPrint('success',`保存成功,可导入 postman,完整路径: ${savePath}`);
}

