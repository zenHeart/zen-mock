const { createBody } = require('../lib/http-body');
const chai = require('chai');
const { expect } = chai;

/**
 * 采用  mockjs 创建请求头部
 */
describe('http.body', function () {
    it('生成 http 请求体', function () {
        expect(createBody({
            'code':/\d{6}/
        }).code).to.match(/\d{6}/)
    })
    it('空请求体 null', function () {
        expect(createBody(null)).to.equal(null)
    })
})

