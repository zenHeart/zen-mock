const { TEST_STATUS } = require('./runner');
const debug = require('debug')('zm:zm-test/reporter');
const colors = require('colors/safe');
const util = require('util');

//设置输出主题
colors.setTheme({
    success: 'green',
    fail: 'red',
    missing: 'yellow',
    invalid: 'yellow',
    redundant: 'yellow',
});
const RESULT_ICON = {
    SUCCESS: '\u221A',
    FAIL: '\u00D7',
    WAIT: '.'
}


function stringfyApiDiff(err, apiInfo) {
    let { missingItems, invalidItems } = err;
    let result = '';

    //标题格式: 请求方法名 请求路径 文件名
    let title = util.format("\n%s %s file:%s\n", apiInfo.method, apiInfo.path, apiInfo.filename);
    result += colors.fail(title)

    if (missingItems.length) {
        result += colors.fail("\tmissing item\n")
        missingItems.forEach(item => {
            result += colors.missing(util.format("\t\t%s\n", item))
        })
    }
    if (invalidItems.length) {
        invalidItems.forEach((invalidItem, index) => {
            if (index === 0) {
                result += colors.fail("\tinvalid item\n")
            }
            result += colors.invalid(util.format("\t\t%s ", invalidItem.item))
            result += colors.fail(util.format("expect:%s\tget:%s\n", invalidItem.expect, invalidItem.real))
        });
    }
    return result;
}

function normalErr(err,apiInfo) {
    let result = '';
    let title = util.format("\n%s %s file:%s\n",apiInfo.method, apiInfo.path,apiInfo.filename);
    result += colors.fail(title);
    result += colors.fail(util.format("\t%s\n",err.message));
    return result
}

module.exports = function report(runner) {
    let failures = [];

    runner.on(TEST_STATUS.START,(config) => {
        console.log(colors.blue(util.format(
            "测试地址: %s\n验证结果:\n",config.testUrl
        )))

    })

    runner.on(TEST_STATUS.FAIL, (err, key) => {
        //提取该 api 对应信息
        let apiConfig = runner.apisConfig[key];
        let { req } = apiConfig;
        //输出格式:失败符号 请求方法名 请求路径 file:mock文件名
        console.log(colors.fail(util.format("%s %s %s file:%s", RESULT_ICON.FAIL, req.method, req.path, key)));

        if (err.showDiff) {
            failures.push(stringfyApiDiff(err, {
                filename: key,
                method: req.method,
                path: req.path
            }))
        } else {
            failures.push(normalErr(err, {
                filename: key,
                method: req.method,
                path: req.path
            }))
        }
    })

    runner.on(TEST_STATUS.SUCCESS, (key) => {
        let apiConfig = runner.apisConfig[key];
        let { req } = apiConfig;
        //输出格式:失败符号 请求方法名 请求路径 file:mock文件名
        console.log(colors.success(util.format("%s %s %s file:%s", RESULT_ICON.SUCCESS, req.method, req.path, key)));
    });

    runner.on(TEST_STATUS.FINISH, (total) => {
        let totalUnits = total;
        let failUnits = failures.length;

        console.log(
            colors.blue(util.format("\ntotal:%s", totalUnits)),
            colors.success(util.format("%s:%s", RESULT_ICON.SUCCESS, totalUnits - failUnits)),
            colors.fail(util.format("%s:%s\n", RESULT_ICON.FAIL, failUnits)))

        failures.forEach(failTest => {
            console.log(failTest);
        })
        if (failUnits) { //有错误退出码设为 1
            process.exit(1);
        }
    });
}