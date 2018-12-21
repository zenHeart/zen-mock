const path = require('path');
const { execFileSync, execFile } = require('child_process');
const zmPath = path.join(__dirname, '../lib/index.js');
const { expect } = require('chai')
const supertest = require('supertest');

describe('zm', function () {
    it('测试默认帮助', function () {
        const result = execFileSync(zmPath);
        expect(result.toString('utf8')).to.match(/\[options\] \[command\]/)

    })

    it('测试非法命令显示帮助信息', function () {
        const result = execFileSync(zmPath, ['df']);

        expect(result.toString('utf8')).to.match(/\[options\] \[command\]/)
    })
})


