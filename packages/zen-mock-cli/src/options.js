/**
 * Created by lockepc on 2017/6/13.
 */
const colors = require('colors/safe');

// set theme
colors.setTheme({
    info: 'rainbow',
    input: 'grey',
    prompt: 'purple',
    example: 'green',
    success: 'green',
    result: ['cyan', 'bold'],
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

exports.colorPrint = colorPrint;
exports.parseFileOpts = parseFileOpts;


//output info
//tool function define
function colorPrint(label, msg) {
    //返回剩余参数
    var resideArg = [].slice.call(arguments, 2);
    resideArg.unshift(colors[label](msg));
    console.log.apply(this, resideArg);
}

/**
 * 
 * @param {string} filename 解析文件名
 */
function parseFileOpts(filename) {
        return  filename;
}




