const { assert, should, expect } = require('chai');
const { convertToPostman } = require('../lib/command/zm-postman/converter');

describe('zm-postman/converter', function () {
    /**
     * assert 断言库类似 node 自带断言库
     *
     * {@link} http://chaijs.com/api/assert/
     */
    describe('convertToPostman', function () {
        it('基础转换', function () {
            expect(convertToPostman({
                method: 'get',
                url: '/sdf',
                header: {},
                body: 'tom'
            })).to.deep.equal({
                request:{
                "body": {
                    "mode": "raw",
                    "raw": "\"tom\"",
                },
                "header": [
                    {
                        "key": "Content-type",
                        "value": "application/json"
                    }
                ],
                "method": "GET",
                "url": "http://localhost/sdf",
            }});
        });

        it('携带 collection', function () {
            expect(convertToPostman({
                method: 'get',
                url: '/sdf',
                header: {},
                body: 'tom'
            },{name:'tom'})).to.deep.equal({
                request:{
                "body": {
                    "mode": "raw",
                    "raw": "\"tom\"",
                },
                "header": [
                    {
                        "key": "Content-type",
                        "value": "application/json"
                    }
                ],
                "method": "GET",
                "url": "http://localhost/sdf"
            },name:'tom'});
        });

        it('携带 collection,options', function () {
            expect(convertToPostman({
                method: 'get',
                url: '/sdf',
                header: {},
                body: 'tom'
            },{name:'tom'},{host:'http://mock.demo'})).to.deep.equal({
                request:{
                "body": {
                    "mode": "raw",
                    "raw": "\"tom\"",
                },
                "header": [
                    {
                        "key": "Content-type",
                        "value": "application/json"
                    }
                ],
                "method": "GET",
                "url":  "http://mock.demo/sdf",
            },name:'tom'});
        });
        it('携带相同 header', function () {
            expect(convertToPostman({
                method: 'get',
                url: '/sdf',
                header: {
                    'Etags':12
                },
                body: 'tom'
            },{name:'tom'})).to.deep.equal({
                request:{
                "body": {
                    "mode": "raw",
                    "raw": "\"tom\"",
                },
                "header": [
                    {
                        "key": "Etags",
                        "value": 12
                    },
                    {
                        "key": "Content-type",
                        "value": "application/json"
                    }
                ],
                "method": "GET",
                "url": "http://localhost/sdf",
            },name:'tom'});
        });
    })
})