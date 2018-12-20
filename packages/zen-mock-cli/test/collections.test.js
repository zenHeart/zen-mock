const { assert, should, expect } = require('chai');
const { createCollertions } = require('../lib/command/zm-postman/collections');
const path = require('path');

describe('zm-postman/collections', function () {
    /**
     * assert 断言库类似 node 自带断言库
     *
     * {@link} http://chaijs.com/api/assert/
     */
    describe('collections', function () {
        it('基础转换', function () {
            let result = createCollertions({
                root: path.relative(path.resolve(), __dirname + '/fixture/mock')
            });
            expect(result.item).to.instanceOf(Array);
            expect(result.item[0]).to.have.nested.property('name','basic');
            expect(result.item[0]).to.have.nested.property('request');
            expect(result.item[0].request).to.have.nested.property('body');
        });
    })
})