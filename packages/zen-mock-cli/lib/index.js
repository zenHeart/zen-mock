#!/usr/bin/env node
'use strict';


/**
 * Module dependencies.
 */

const program = require('commander');
const fs = require('fs');
const path = require('path');
const deepmerge = require('deepmerge');

//命令解析器
const zmTest = require('./command/zm-test');
const zmServe = require('./command/zm-serve');
const zmPostman = require('./command/zm-postman');

const { mergeOptions, parseFileOpts,parseUrlOpts, colorPrint } = require('./options');


/**
 * 测试
 */
program
    .version(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')).version)
    .option('-c, --config <path>', '设置 .zenmock.js 命令配置目录,支持相对和绝对路径')
    .option('-r, --root <path>', 'mock 路由配置目录,支持相对和绝对路径,默认为 mock 文件夹')

program.command('test')
    .description('测试配置接口')
    //option 只有在出现该选项时才会触发解析函数
    //利用事件进行触发
    .option('-f, --file <value>', '测试符合模式匹配的文件,模式匹配详见 minimatch', parseFileOpts) //不考虑文件名映射配置项
    .option('-t, --timeout <number>', '设定请求超时时间,单位 ms,默认为 5000', parseInt) //不考虑文件名映射配置项
    .option('-u,--testUrl <url>', '待测试地址,默认为 http://localhost',parseUrlOpts) //不考虑文件名映射配置项
    .action(function (options) {
        let allOptions = mergeOptions(options);
        zmTest(allOptions);
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
    .option('-p, --port <number>', '设定服务端口,默认为 3000', parseInt) //不考虑文件名映射配置项
    .description('启动 mock server 服务')
    //option 只有在出现该选项时才会触发解析函数
    //利用事件进行触发
    .action(function (options) {
        let allOptions = mergeOptions(options);
        zmServe(allOptions);
    });

program
    .command('postman')
    .description('导出为 postman collection')
    .action(function (options) {
        let allOptions = mergeOptions(options);
        zmPostman(allOptions);
    });
//非法命令,显示帮助信息
program
    .command('*')
    .action(function (env) {
        program.help();
    });

//解析传入参数
program.parse(process.argv);

//当未传入任何参数是显示帮助信息
if (program.rawArgs.length === 2) {
    program.help();
}











