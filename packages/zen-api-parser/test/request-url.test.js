const { createUrl } = require('../lib/request-url');
const { expect } = require('chai');

/**
 * 验证利用配置文件名,和配置根目录自动生成请求默认路径功能
 * 非 index 提取配置文件相对根目录的路径结合文件名作为请求 path
 * index 忽略文件名其余同上
 */
describe('request.createUrl', function () {
    it('生成请求路径', function () {
        expect(createUrl('/demo')).to.equal('/demo');
    })
    it('传入路径参数', function () {
        expect(createUrl('/demo'),{id:1}).to.equal('/demo');
        expect(createUrl('/demo/:id',{id:1})).to.equal('/demo/1');
    })
    it('传入路径参数采用 mock',function() {
        expect(createUrl('/demo/:id',{id:/\d{32}/})).to.match(/^\/demo\/\d{32}/);
    })
    it('传入查询字段',function() {
        expect(createUrl('/demo',undefined,{id:10})).to.equal('/demo?id=10');
    })
    it('mock 传入查询字段',function() {
        expect(createUrl('/demo',undefined,{id:/\d{32}/})).to.match(/^\/demo\?id=\d{32}/);
    })
    it('结合 mock 传入路径参数和查询字段',function() {
        expect(createUrl('/demo/:id/test/:name',{
            id:/\d{32}/,
            name:/\w{6}/,
        },{time:/\d{10}/,page:/\d{1}/})).to.match(/^\/demo\/\d{32}\/test\/\w{6}\?time=\d{10}\&page=\d{1}/);
    })

})

