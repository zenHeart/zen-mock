
const path = require('path');
const { execFileSync, execFile } = require('child_process');
const zmPath = path.join(__dirname, '../lib/index.js');
const { expect } = require('chai')
const supertest = require('supertest');

describe('zm postman', function () {
    it('测试生成 postman', function (done) {
        const process = execFile(zmPath, ['postman'], {
            cwd: __dirname + '/fixture'
        });
        let result = '';
        process.stdout.on('data', (data) => {
            result += data;
        })
        process.stderr.on('data', (data) => {
            result += data;
        })
        process.on('close', (exitCode) => {
            expect(result).to.include('保存成功,可导入 postman,完整路径:');
            done();
        })
    })
})

