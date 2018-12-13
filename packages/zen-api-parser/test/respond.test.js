
const respond = require('../lib/respond');
const { expect } = require('chai');

/**
 * 请求对象测试,
 * 返回 mockjs 生成的请求对象
 */
describe('respond', function () {
    it('null', function () {
        expect(respond(null)).to.be.an.instanceof(Function)
    })
    it('传入函数,原样返回', function () {
        let a = () => { };
        expect(respond(a)).to.equal(a)
    })
    it('传入对象,返回函数', function () {
        expect(respond({body:{a:1}})).to.an.instanceof(Function)
    })
})

