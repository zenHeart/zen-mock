const path = require('path');
const {expect} = require('chai')
const {readConfigFile} = require('../lib/options');

describe('options', function () {
  
    describe('readConfigFile', function () {
        it('配置文件不存在返回空对象', function () {
            expect(readConfigFile()).to.deep.equal({});
        })
        it('读取相对路径配置文件', function () {
            expect(readConfigFile({
                config: path.relative(path.resolve(), path.join(__dirname, 'fixture'))
            })).to.deep.equal({ root: __dirname + '/fixture/mock' });
        })

        it('读取绝对路径配置文件', function () {
            expect(readConfigFile({
                config: __dirname+'/fixture'
            })).to.deep.equal({ root: __dirname + '/fixture/mock' });
        })

    })
})

