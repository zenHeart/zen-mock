#!/usr/bin/env node

const path = require('path');
const MockServer = require('../src/MockServer');
const program = require('commander');
const mockDir = path.resolve('examples/mock');
const debug = require('debug')('zen-mock:bin');
const mockServer = new MockServer({
    root:mockDir
})

//发送 api 的子命令
program
  .version('0.1.0')
  .command('rmdir <dir> [otherDirs...]')
  .action(function (dir, otherDirs) {
    console.log('rmdir %s', dir);
    if (otherDirs) {
      otherDirs.forEach(function (oDir) {
        console.log('rmdir %s', oDir);
      });
    }
  });


program
  .version('0.1.0')
  .option('-a, --api <fileList>', '指定执行那个 api',function list(val) {
    return val.split(',');
  })
  .option('-r, --root', '指定根目录路径,默认为项目根目录 mock')
  .parse(process.argv);

// if (program.api) {
    debug(program);
// }

