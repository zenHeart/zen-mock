const path = require('path');
const { execFileSync, execFile } = require('child_process');
const zmPath = path.join(__dirname, '../lib/index.js');
const { expect } = require('chai')

describe('zm test', function () {
    it('测试错误检查', function (done) {
        const port = 8080;
        //模拟服务端,开启 10s
        const server = execFile(zmPath, ['-r', 'server', 'serve', '-p', port], {
            cwd: __dirname + '/fixture',
            timeout:10000
        })

        const process = execFile(zmPath, ['test', '-u', `http://localhost:${port}`], {
            cwd: __dirname + '/fixture',
        });

        let result = '';
        process.stdout.on('data', (data) => {
            result += data;
        })
        process.stderr.on('data', (data) => {
            result += data;
        })
        process.on('close', (exitCode) => {
            expect(result).to.include('get /basic file:basic');
            expect(result).to.include('total');
            expect(result).to.include('expect:string	get:number');
            expect(result).to.include('响应超时,5000ms 没有响应');
            expect(exitCode).to.equal(1);
            done();
        })
    })

})

