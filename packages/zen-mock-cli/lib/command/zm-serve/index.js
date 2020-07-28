const debug = require('debug')('zm:command/zm-serve');
const MockServer = require('zen-mock');
const portfinder = require('portfinder');
const path = require('path');
const { serve: defaultConfig } = require('../../constant').DEFAULT_CONFIG;

/**
 * @param {string} files 读取的配置文件
 */
module.exports = function zmServe(options = defaultConfig) {
    //读取命令行运行配置
    let config = options;
    portfinder.basePort = config.port;//设定默认端口为 3000

    if (config.root) {//检测到 root 配置
        if (!path.isAbsolute(config.root)) {
            //若 root 非绝对目录则转换为相对执行路径的目录
            config.root = path.resolve(config.root);
        }
    }

    //实例化 zen-mock
    let mockServer = new MockServer(config);

    portfinder.getPort(function (err, port) {
        let listener = mockServer.app.listen(port, function () {
            console.log(
                `mock server start,listen on ${listener.address().port},open http://localhost:${listener.address().port}`)
        })
    });
}

