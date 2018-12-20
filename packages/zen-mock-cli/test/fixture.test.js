const path = require('path');
const execFile = require('child_process').execFile;
const zmPath = path.join(__dirname,'../lib/index.js');
const {expect} = require('chai')

describe('命令行测试', function () {
    describe('zm', function () {
        it('测试默认帮助', function (done) {
            const zm = execFile(zmPath);

            zm.stdout.on('data', (data) => {
                expect(data.toString('utf8')).to.match(/\[options\] \[command\]/)
                done();
            });
        })

        it('测试非法命令显示帮助信息', function (done) {
            const zm = execFile(zmPath,['df']);

            zm.stdout.on('data', (data) => {
                expect(data.toString('utf8')).to.match(/\[options\] \[command\]/)
                done();
            });
        })

    })
})

