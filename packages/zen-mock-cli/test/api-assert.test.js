const { assert, should, expect } = require('chai');
const { apiDiff, apiEqual } = require('../src/command/zm-test/api-assert')

describe('api-assert', function () {
    describe('apiEqual', function () {
        it('success api', function () {
            expect(apiEqual({ a: 1, c: { a: 1 } }, { a: 2, c: { a: 1 } })).to.be.true;
        })

        it('origin type number string error', function () { //基础类型错误
            try { apiEqual('sadf', 1) }
            catch (err) {
                expect(err).to.deep.include({
                    showDiff: true,
                    missingItems: [],
                    invalidItems: [
                          {
                            expect: "string",
                            item: "respond",
                            real: "number"
                          }
                        
                  ],
                    redundantItems: []
                });
            }
        });

        it('simple api equal error', function () {
            try { apiEqual({ a: 1 }, { b: 2 }); }
            catch (err) {
                expect(err).to.be.instanceOf(Error);
                expect(err).to.deep.include({
                    showDiff: true,
                    missingItems: ['respond.a'],
                    invalidItems: [],
                    redundantItems: []
                });
            }
        })


        it('complex api error', function () {
            try { apiEqual({ a: 1, b: [{ a: 1, b: { c: 1 } }] }, { a: 1, b: [{ b: ['number'] }] }); }
            catch (err) {
                expect(err).to.be.instanceOf(Error);
                expect(err).to.deep.include({
                    showDiff: true,
                    missingItems: ['respond.b.0.a'],
                    invalidItems: [
                        {
                            expect: "object",
                            real: "array",
                            item: "respond.b.0.b",
                        }
                    ],
                    redundantItems: []
                });
            }
        })
    })

    /**
     * assert 断言库类似 node 自带断言库
     *
     * {@link} http://chaijs.com/api/assert/
     */
    describe('apiDiff', function () {
        it('origin type error', function () { //基础类型错误
            expect(apiDiff('sadf', null)).to.deep.equal({
                missingItems: [],
                invalidItems: [{
                    item: 'respond',
                    expect: 'string',
                    real: 'object'
                }],
                redundantItems: [],
            });
        });

        it('origin type number string error', function () { //基础类型错误
            expect(apiDiff('sadf', 1)).to.deep.equal({
                missingItems: [],
                invalidItems: [{
                    item: 'respond',
                    expect: 'string',
                    real: 'number'
                }],
                redundantItems: [],
            });
        });

        it('type error', function () { //类型错误
            expect(apiDiff({
                a: 1,
                b: 2
            }, { a: '1', b: 2 })).to.deep.equal({
                missingItems: [],
                invalidItems: [{
                    item: 'respond.a',
                    expect: 'number',
                    real: 'string'
                }],
                redundantItems: [],
            });
        });


        it('item missing error', function () { //字段缺失
            expect(apiDiff({
                a: 1,
                b: 2,
                c: { a: 1 }
            }, { a: 1, b: 2, c: { d: 1 } })).to.deep.equal({
                missingItems: ['respond.c.a'],
                invalidItems: [],//存储类型错误字段
                redundantItems: [],//冗余字段
            });
        });

        it('item missing  with null error', function () { //字段缺失
            expect(apiDiff({
                a: 1,
                n: { c: [] }
            }, { a: 1, n: null })).to.deep.equal({
                missingItems: ['respond.n.c'],
                invalidItems: [],//存储类型错误字段
                redundantItems: [],//冗余字段
            });
        });



        it('mixed error', function () { //混合类型和字段缺失等错误
            expect(apiDiff({
                a: 1,
                b: 2,
                c: { a: 1 },
                g: {
                    foo: [{ a: 1, b: 2, c: [{ foo: 1 }] }]
                },
                n: { b: [] }
            }, {
                    b: { a: 1 },
                    a: 1,
                    g: { foo: [{ a: 1, b: 'demo', c: 1 }] },
                    n: null
                })).to.deep.equal(
                    {
                        missingItems: ['respond.c', 'respond.n.b'],
                        invalidItems: [
                            {
                                expect: "number",
                                item: "respond.b",
                                real: "object"
                            },
                            {
                                expect: "number",
                                item: "respond.g.foo.0.b",
                                real: "string"
                            },
                            {
                                expect: "array",
                                item: "respond.g.foo.0.c",
                                real: "number",
                            }
                        ],
                        redundantItems: [],//冗余字段
                    });
        });
    });


})