const path = require('path');
const {loopParserPath,isIllegatExt,isIgnorePath} = require('../src/parserServerConfig');

describe('test loopParserPath',function() {
    it('test ignore config',function() {
            let testData = {
                input:path.resolve(__dirname,'mock'),
                expect:[path.resolve(__dirname,'mock/getTest.js')]
            }
            //判断是否包含测试
            expect(loopParserPath({root:testData.input,ignore:['ignore']})).toEqual(expect.arrayContaining(testData.expect));
    })

})

describe('test isIllegatExt ',function() {
    it('test ext ',function() {
        let testData = [
            {
                input:'demo.js',
                expect:true 
            },{
                input:'demo.json',
                expect:true
            },{
                input:'demo.yml',
                expect:false
            }
        ];

        testData.forEach((ele) => {
            expect(isIllegatExt(ele.input)).toBe(ele.expect);
        })
    });
})

describe('test isIgnoreSource ',function() {
    it('test ext ',function() {
        let testData = [
            {
                input:['/demo/ha',['/demo/ha']],
                expect:true
            }
        ];

        testData.forEach((ele) => {
            expect(isIgnorePath.apply(this,ele.input)).toBe(ele.expect);
        })
    });
})