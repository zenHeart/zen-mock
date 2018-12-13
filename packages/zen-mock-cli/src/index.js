#!/usr/bin/env node
'use strict';


/**
 * Module dependencies.
 */

const program = require('commander');
const fs = require('fs');
const path = require('path');


//命令解析器
const zmTest = require('./command/zm-test');
const zmServe = require('./command/zm-serve');

const { parseFileOpts, colorPrint } = require('./options');


/**
 * 测试
 */
program
    .version(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')).version)
    .option('-C, --chdir <path>', 'change the working directory')
    .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
    .option('-T, --no-tests', 'ignore test hook');

program.command('test')
    .description('测试配置接口')
    //option 只有在出现该选项时才会触发解析函数
    //利用事件进行触发
    .option('-f, --file <value>', '测试符合模式匹配的文件,模式匹配详见 minimatch', parseFileOpts) //不考虑文件名映射配置项
    .action(function (options) {

        zmTest({
            file: options.file || null
        });
    }).on('--help', function () {
        colorPrint('example', '\nExamples:\n');
        colorPrint('example', '\tzm test');
        colorPrint('result', '\t测试所有接口\n');

        colorPrint('example', '\tzm test -f demo*');
        colorPrint('result', '\t测试 demo 开头的一级目录文件\n');

        colorPrint('example', '\tzm test -f demo/**');
        colorPrint('result', '\t测试 demo 文件夹下所有文件\n');


        colorPrint('example', '\tzm test -f \'{a*,b*}\'');
        colorPrint('result', '\t测试 a 或 b 开头的一级目录文件');
    });

program
    .command('serve')
    .description('启动服务')
    //option 只有在出现该选项时才会触发解析函数
    //利用事件进行触发
    .action(function (options) {
        zmServe();
    });

program
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env);
  });

//解析传入参数
program.parse(process.argv);

//当未传入任何参数是显示帮助信息
if (program.rawArgs.length === 2) {
    program.help();
}











