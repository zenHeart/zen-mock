const { assert, should, expect } = require('chai');
const {getJsonType, flattenObjToJsonType, isSubItem, sortObject } = require('../lib/utils.js');
const path = require('path');

describe('utils', function () {
    /**
     * assert 断言库类似 node 自带断言库
     *
     * {@link} http://chaijs.com/api/assert/
     */
    describe('getJsonType', function () {
        it('number', function () {
            expect(getJsonType(12)).to.equal('number');
        });
        it('boolean', function () {
            expect(getJsonType(true)).to.equal('boolean');
            expect(getJsonType(false)).to.equal('boolean');
        });
        it('string', function () {
            expect(getJsonType('')).to.equal('string');
            expect(getJsonType(``)).to.equal('string');
            expect(getJsonType("df")).to.equal('string');
        });
        it('null', function () {
            expect(getJsonType(null)).to.equal('object');
        });
        it('obejct', function () {
            expect(getJsonType({})).to.equal('object');
            expect(getJsonType({ a: 1 })).to.equal('object');
        });
        it('array', function () {
            expect(getJsonType([])).to.equal('array');
            expect(getJsonType([{ a: 1 }])).to.equal('array');
        });
        it('array', function () {
            expect(getJsonType([])).to.equal('array');
            expect(getJsonType([{ a: 1 }])).to.equal('array');
        });
    });

    //扁平化对象
    describe('flattenObjToJsonType', function () {
        it('object', function () {
            expect(flattenObjToJsonType({ a: 1 })).to.deep.equal({ a: 'number' });
        });
        it('complex object', function () {
            expect(flattenObjToJsonType({
                a: null,
                b: {
                    c: 1,
                    d: 'df',
                    q: [{ foo: 1, bar: true, d: { a: 1 } }]
                }
            })).to.deep.equal({
                a: 'object',
                b: 'object',
                'b.c': 'number',
                'b.d': 'string',
                'b.q': 'array',
                'b.q.0': 'object',
                'b.q.0.foo': 'number',
                'b.q.0.bar': 'boolean',
                'b.q.0.d': 'object',
                'b.q.0.d.a': 'number',
            });
        });
        it('array', function () {
            expect(flattenObjToJsonType({
                a: [1, 2, 3]
            })).to.deep.equal({ a: 'array', 'a.0': 'number' });
        });
        it('recuresive a', function () {
            expect(flattenObjToJsonType({
                a: [{ a: [{ a: 1 }] }]
            })).to.deep.equal({ a: 'array', 'a.0': 'object', 'a.0.a': 'array', 'a.0.a.0': 'object', 'a.0.a.0.a': 'number' });
        });
        it('object null', function () {
            expect(flattenObjToJsonType({
                c: 1,
                d: { a: 1, b: null },
                a: null,
                b: null
            })).to.deep.equal({ c: 'number', d: 'object', 'd.a': 'number', 'd.b': 'object', a: 'object', b: 'object' });
        });
    });


    //判断是否为子字段
    describe('isSubItem', function () {
        it('one item', function () {
            expect(isSubItem('df.sdf', ['df'])).to.true;
        })
        it('multi item', function () {
            expect(isSubItem('df.sdf', ['df', 'sdf', 'dfg'])).to.true;
        })
        it('recursive multi item', function () {
            expect(isSubItem('df.sdf.g.0', ['df.sdf', 'sdf', 'dfg'])).to.true;
        })
        it('not true', function () {
            expect(isSubItem('dfg1.sdf', ['df', 'sdf', 'dfg'])).to.false;
        })
    })

    describe('sortObject', function () { //排序对象
        it('simple', function () {
            expect(Object.keys(sortObject({
                'a.0': 1,
                a: 1,
            }))).to.ordered.members(['a', 'a.0'])
        })

        it('multi object', function () {
            expect(Object.keys(sortObject({
                '0.a': 1,
                a: 1,
                'a.0': 1,
                'f.g.c': 1,
                'f.g.0.c': 1,
                'f.g': 1,
                f: 1
            }))).to.ordered.members(["0.a",
                "a",
                "a.0",
                "f",
                "f.g",
                "f.g.0.c",
                "f.g.c"])
        })
    })

})