const request = require('../lib/request');
const { expect } = require('chai');

/**
 * 请求对象测试,
 * 返回 mockjs 生成的请求对象
 */
describe('request', function () {
    it('采用默认对象创建请求', function () {
        expect(request()).to.deep.equal({
            body: {},
            header: {},
            method: "get",
            params: {},
            path: "/",
            query: {},
            url: "/"
        });
    })
    
    it('传入配置文件及路径信息', function () {
        expect(request('/demo/foo.js','/demo')).to.deep.equal({
            body: {},
            header: {},
            method: "get",
            params: {},
            path: "/foo",
            query: {},
            url: "/foo"
        });
    })
        
    it('覆盖默认 path', function () {
        expect(request('/demo/foo.js','/demo',{
            path:'/index'
        })).to.deep.equal({
            body: {},
            header: {},
            method: "get",
            params: {},
            path: "/index",
            query: {},
            url: "/index"
        });
    })

    it('完全配置', function () {
        let mockRequst = request('/demo/foo.js','/demo',{
            path:'/index/:id',
            method:'post',
            params:{
                id:/\d{32}/
            },
            query:{
                timestamp:/\d{10}/
            },
            header:{
                Etag:/\d{6}/
            },
            body:{
                name:/\w{6}/
            },
        });
        expect(mockRequst).to.deep.include({
            method: "post",
            path: "/index/:id",
        });
        expect(mockRequst.url).to.match(/^\/index\/\d{32}\?timestamp=\d{10}/)
        expect(mockRequst.header.Etag).to.match(/\d{6}/)
        expect(mockRequst.body.name).to.match(/\w{6}/)
    })
})

