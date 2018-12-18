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

const { getParentOptions, parseFileOpts, colorPrint } = require('./options');


/**
 * 测试
 */
program
    .version(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')).version)
    .option('-c, --config <path>', '设置配置文件路径,相对执行目录')

program.command('test')
    .description('测试配置接口')
    //option 只有在出现该选项时才会触发解析函数
    //利用事件进行触发
    .option('-f, --file <value>', '测试符合模式匹配的文件,模式匹配详见 minimatch', parseFileOpts) //不考虑文件名映射配置项
    .action(function (options) {
        zmTest({
            file: options.file,
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
        let parentOptions = getParentOptions(options);
        console.log(parentOptions);
        zmServe(parentOptions);
    });

program
    .command('postman')
    .description('导出为 postman collection')
    .action(function (options) {
        let parentOptions = getParentOptions(options);
        zmPostman(parentOptions);
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











