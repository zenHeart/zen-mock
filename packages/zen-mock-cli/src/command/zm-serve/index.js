const debug = require('debug')('zm:command/zm-serve');
const MockServer = require('zen-mock');
const {readConfig} = require('../../utils')

/**
 * @param {string} files 读取的配置文件
 */
module.exports = function zmServe(options) {
    //读取命令行运行配置
    let config = readConfig();
    //实例化 zen-mock
    this.mockServer = new MockServer(config);

    let listener = this.mockServer.app.listen(function() {
        console.log('listen on ',listener.address().port)
    })
}

