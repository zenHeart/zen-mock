
const { isEmptyObj, isObjectHasKeys } = require('../lib/utils');
const { expect } = require('chai');

/**
 * 请求对象测试,
 * 返回 mockjs 生成的请求对象
 */
describe('utils', function () {
    describe('isEmptyObj', function () {
        it('null', function () {
            expect(isEmptyObj(null)).to.true;
        })
        it('空对象', function () {
            expect(isEmptyObj({})).to.true;
        })
        it('非空对象', function () {
            expect(isEmptyObj({a:1})).to.false;
        })
    })

    describe('isObjectHasKeys', function () {
        it('null', function () {
            expect(isObjectHasKeys([],null)).to.false;
        })
        it('空键', function () {
            expect(isObjectHasKeys([],{})).to.true;
        })
        it('包含键名', function () {
            expect(isObjectHasKeys(['req'],{req:null})).to.true;
        })
        it('不包含键名', function () {
            expect(isObjectHasKeys(['req1'],{req:null})).to.false;
        })
        it('包含多个键名', function () {
            expect(isObjectHasKeys(['req','resp'],{req:null,resp:1})).to.true;
        })
    })
})

