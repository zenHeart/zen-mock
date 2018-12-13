const { createHeader } = require('../lib/http-header');
const chai = require('chai');
const { expect } = chai;

/**
 * 采用  mockjs 创建请求头部
 */
describe('http.body', function () {
    it('生成 http 请求体', function () {
        expect(createHeader({
            'code':/\d{6}/
        }).code).to.match(/\d{6}/)
    })
    it('空请求体 null', function () {
        expect(createHeader(null)).to.equal(null)
    })
})

