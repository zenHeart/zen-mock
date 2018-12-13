const { createPath } = require('../lib/request-path');
const { expect } = require('chai');

/**
 * 验证利用配置文件名,和配置根目录自动生成请求默认路径功能
 * 非 index 提取配置文件相对根目录的路径结合文件名作为请求 path
 * index 忽略文件名其余同上
 */
describe('request.createPath', function () {
    it('提取相对根目录文件名作为 path', function () {
        expect(createPath('/demo.js', '/')).to.be.equal("/demo");
    })
    it('文件为多级目录',function() {
        expect(createPath('/demo/test/foo.js','/demo')).to.be.equal("/test/foo");
    })
    it('index 文件忽略文件名', function () {
        expect(createPath('/index.js', '/')).to.be.equal("/");
    })
    it('index 为多级目录', function () {
        expect(createPath('/demo/test/index.js', '/demo')).to.be.equal("/test");
    })

})

