const path = require('path');
const {loopParserPath,isIllegatExt} = require('../src/utils');

describe('test loopParserPath',function() {
    it('resolve path',function() {
            let testData = {
                input:path.resolve(__dirname,'mock'),
                expect:[path.resolve(__dirname,'mock/getTest.js')]
            }
            //判断是否包含测试
            expect(loopParserPath(testData.input)).toEqual(expect.arrayContaining(testData.expect));
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