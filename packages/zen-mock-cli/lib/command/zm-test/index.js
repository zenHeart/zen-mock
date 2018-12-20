const debug = require('debug')('zm:command/zm-test');
const TestRunner = require('./runner');
const reporter = require('./reporter')



/**
 * @param {string} files 读取的配置文件
 */
module.exports = function zmTest(options) {
    
    let testRunner = new TestRunner(options);
    reporter(testRunner);
    testRunner.run();
}

