const apiConfigParser = require('../lib/index');
const { expect } = require('chai');
const root = __dirname+'/fixture';

/**
 * 请求对象测试,
 * 返回 mockjs 生成的请求对象
 */
describe('index', function () {
    it('默认配置', function () {
        let configFile = root+'/default.json';
        let api = apiConfigParser(configFile,root);
        let {req,resp} = api;

        expect(req).to.deep.include({
            method: "get",
            path: "/default",
        });
        expect(resp).to.be.an.instanceof(Function);
    })
    it('index 文件名', function () {
        let configFile = root+'/index.js';
        let api = apiConfigParser(configFile,root);
        let {req,resp} = api;

        expect(req).to.deep.include({
            method: "get",
            path: "/",
        });
        expect(resp).to.be.an.instanceof(Function);
    })

    it('配置为函数',function() {
        let configFile = root+'/function.js';
        let api = apiConfigParser(configFile,root);
        let {req,resp} = api;

        expect(req.path).to.equal('/function');
        expect(req.method).to.equal('get');
        expect(resp).to.be.an.instanceof(Function);
        expect(resp).to.equal(require(configFile));
    })

    it('所有配置项', function () {
        let configFile = root+'/all-config.js';
        let api = apiConfigParser(configFile,root);
        let {req,resp} = api;

        
        expect(req).to.deep.include({
            method: "post",
            path: "/index/:id",
        });
        expect(req.url).to.match(/^\/index\/\d{32}\?timestamp=\d{10}/)
        expect(req.header.Etag).to.match(/\d{6}/)
        expect(req.body.name).to.match(/\w{6}/)
        expect(resp).to.be.an.instanceof(Function);
    })
})

