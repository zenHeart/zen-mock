const path = require('path');
const { expect } = require('chai');
const { getBaseName, flattenPathFile, isIllegatExt, isIgnorePath } = require('../lib/utils');



describe('zen-mock utils', function () {
    describe('flattenPathFile', function () {
        it('test root must absolutpath', function () {
            let badFunc = () => { flattenPathFile('./sdf') };
            expect(badFunc).to.throw(/make sure is absolute path/);
        })

        it('test default options', function () {
            let testData = {
                input: [__dirname + '/fixture/mock'],
                expect: {
                    include: [
                        __dirname + '/fixture/mock/index.json',
                        __dirname + '/fixture/mock/static/index.js',
                        __dirname + '/fixture/mock/ignore/foo.js',
                        __dirname + '/fixture/mock/sub/foo.json',
                        __dirname + '/fixture/mock/sub/ignore/foo.js',
                    ],
                    exclude: [
                        __dirname + '/fixture/mock/READEME.md',
                    ]
                }
            }
            let result = flattenPathFile.apply(this, testData.input)

            expect(result).to.include.members(testData.expect.include);
            testData.expect.exclude.forEach(ele => {
                expect(result).to.not.include(ele);
            })
        })

        it('test ignore options', function () {
            let testData = {
                input: [__dirname + '/fixture/mock', { ignoreDir: ['ignore', 'static'] }],
                expect: {
                    include: [
                        __dirname + '/fixture/mock/index.json',
                        __dirname + '/fixture/mock/sub/foo.json',
                        __dirname + '/fixture/mock/sub/ignore/foo.js',
                    ],
                    exclude: [
                        __dirname + '/fixture/mock/ignore/foo.json',
                        __dirname + '/fixture/mock/static/index.js',
                        __dirname + '/fixture/mock/READEME.md',
                    ]
                }
            }
            let result = flattenPathFile.apply(this, testData.input)

            expect(result).to.include.members(testData.expect.include);
            testData.expect.exclude.forEach(ele => {
                expect(result).to.not.include(ele);
            })
        })


        it('test extPattern options', function () {
            let testData = {
                input: [__dirname + '/fixture/mock', { extPattern: "*.json" }],
                expect: {
                    include: [
                        __dirname + '/fixture/mock/index.json',
                        __dirname + '/fixture/mock/sub/foo.json',
                    ],
                    exclude: [
                        __dirname + '/fixture/mock/sub/ignore/foo.js',
                        __dirname + '/fixture/mock/static/index.js',
                        __dirname + '/fixture/mock/READEME.md',
                    ]
                }
            }
            let result = flattenPathFile.apply(this, testData.input)

            expect(result).to.include.members(testData.expect.include);
            testData.expect.exclude.forEach(ele => {
                expect(result).to.not.include(ele);
            })
        })

        it('test all options', function () {
            let testData = {
                input: [__dirname + '/fixture/mock', { ignoreDir: ['ignore', 'static'], extPattern: "*.js" }],
                expect: {
                    include: [
                        __dirname + '/fixture/mock/sub/ignore/foo.js',
                        __dirname + '/fixture/mock/sub/index.js',
                    ],
                    exclude: [
                        __dirname + '/fixture/mock/index.json',
                        __dirname + '/fixture/mock/sub/foo.json',
                        __dirname + '/fixture/mock/static/index.js',
                        __dirname + '/fixture/mock/ignore/foo.js',
                        __dirname + '/fixture/mock/READEME.md',
                    ]
                }
            }
            expect(flattenPathFile.apply(this, testData.input)).to.include.members(testData.expect.include);
            expect(flattenPathFile.apply(this, testData.input)).to.not.include.members(testData.expect.exclude);
        })
    })

    describe('isIllegatExt ', function () {
        it('test default', function () {
            let testData = [
                {
                    input: 'demo.js',
                    expect: true
                }, {
                    input: 'demo.json',
                    expect: true
                }, {
                    input: 'demo.yml',
                    expect: false
                }
            ];

            testData.forEach((ele) => {
                expect(isIllegatExt(ele.input)).to.equal(ele.expect);
            })
        });
    })

    describe('isIgnoreSource ', function () {
        it('test ignore ', function () {
            let testData = [
                {
                    input: ['/demo/ha', ['/demo/ha']],
                    expect: true
                }
            ];

            testData.forEach((ele) => {
                expect(isIgnorePath.apply(this, ele.input)).to.equal(ele.expect);
            })
        });
    })

    describe('getBaseName', function () {
        it('包含文件后缀', function () {
            expect(getBaseName('demo.txt')).to.equal('demo')
        })

        it('不包含文件后缀', function () {
            expect(getBaseName('demo/foo')).to.equal('foo')
        })

    })

}) 
