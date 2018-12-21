const path = require('path');
const { execFileSync, execFile } = require('child_process');
const zmPath = path.join(__dirname, '../lib/index.js');
const { expect } = require('chai')
const supertest = require('supertest');

describe('zm serve', function () {
    it('测试不包含配置文件使用默认配置', function (done) {
        const process = execFile(zmPath, ['serve'], {
            cwd: __dirname + '/fixture/basic',
            timeout: 1000
        });
        let result = '';
        process.stdout.on('data', (data) => {
            result += data;
        })
        process.stderr.on('data', (data) => {
            result += data;
        })
        process.on('close', (exitCode) => {
            expect(result).to.match(/.*mock server start,listen on  3000/);
            done();
        })
    })

    it('测试包含配置的文件', function (done) {
        const process = execFile(zmPath, ['serve'], {
            cwd: __dirname + '/fixture',
            timeout: 1000
        });
        let result = '';
        process.stdout.on('data', (data) => {
            result += data;
        })
        process.stderr.on('data', (data) => {
            result += data;
        })
        process.on('close', (exitCode) => {
            expect(result).to.match(/.*mock server start,listen on /);
            done();
        })
    })
})

