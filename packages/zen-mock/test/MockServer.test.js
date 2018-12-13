const { expect } = require('chai');
const MockServer = require('../src/MockServer');

describe('MockServer', function () {
    describe('测试 MockServer 实例属性', function () {
        let mockServer = new MockServer({
            root: __dirname + '/fixture/mock'
        })

        it('mockServer.configFiles', function () {
            expect(mockServer.configFiles).include.members([
                __dirname+"/fixture/mock/basic.json",
                __dirname+"/fixture/mock/config.js",
                __dirname+"/fixture/mock/config-req.js",
                __dirname+"/fixture/mock/function.js",
                __dirname+"/fixture/mock/ignore/foo.js",
                __dirname+"/fixture/mock/index.json",
                __dirname+"/fixture/mock/mock.js",
                __dirname+"/fixture/mock/req-config.js",
                __dirname+"/fixture/mock/sub/foo.json",
                __dirname+"/fixture/mock/sub/ignore/foo.js",
                __dirname+"/fixture/mock/sub/index.js",
            ]);

            //验证配置文件不包含
            [
                __dirname+"/fixture/mock/static/foo.json",
                __dirname+"/fixture/mock/static/foo.json",
            ].forEach(ele => {
                expect(mockServer.configFiles).to.not.include(ele);
            })
        })

        it('mockSderver.apisConfig', function () {
            //验证包含所有 api 解析后的配置文件
            expect(mockServer.apisConfig).to.deep.nested.include({
                'basic.req.method': "get",
                'config.req.method': "post",
            });
        })
    })
})

