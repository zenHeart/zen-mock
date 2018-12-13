const { createHeader } = require('../lib/http-header');
const chai = require('chai');
const { expect } = chai;

/**
 * 采用  mockjs 创建请求头部
 */
describe('http.header', function () {
    it('生成 http 头部', function () {
        expect(createHeader({
            'Etag':/\d{32}/
        }).Etag).to.match(/\d{32}/)
    })
})

