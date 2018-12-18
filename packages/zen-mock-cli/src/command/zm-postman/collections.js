//转换所有配置为 postman collecitons
const MockServer = require('zen-mock');
const  Collection = require('postman-collection').Collection;
const deepmerge = require('deepmerge');
const {convertToPostman}  = require('./converter');
const {readConfig} = require('../../utils')




/**
 * @param {object} options 导出为 postman collection
 */
exports.createCollertions = function (options = {}) {
    //读取命令行运行配置
    let config = readConfig(options);
    //实例化 zen-mock
    let mockServer = new MockServer(config);
    let {apisConfig} = mockServer;
    let items = [];

    for(key in apisConfig) {
        let item = convertToPostman(apisConfig[key].req,{
            name:key
        });
        items.push(item)
    }

    return new Collection({
        item:items
    }).toJSON();
}

