//转换所有配置为 postman collecitons
const MockServer = require('zen-mock');
const { postman: defaulConfig } = require('../../constant').DEFAULT_CONFIG;

const Collection = require('postman-collection').Collection;
const deepmerge = require('deepmerge');
const { convertToPostman } = require('./converter');




/**
 * @param {object} options 导出为 postman collection
 */
exports.createCollertions = function (options = defaulConfig) {
    //读取命令行运行配置
    let config = options;
    //实例化 zen-mock
    let mockServer = new MockServer(config);
    let { apisConfig } = mockServer;
    let items = [];

    for (key in apisConfig) {
        let item = convertToPostman(apisConfig[key].req, {
            name: key
        }, options);
        items.push(item)
    }


    return new Collection({
        item: items,
        info: {
            name:options.filename
        },
    }).toJSON();
}

