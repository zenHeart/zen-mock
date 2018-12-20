/**
 * Created by lockepc on 2017/6/13.
 */
const colors = require('colors/safe');
const { DEFAULT_CONFIG } = require('./constant');
const deepmerge = require('deepmerge');
const path = require('path');
const validUrl = require('valid-url');

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
exports.parseUrlOpts = parseUrlOpts;

exports.readConfigFile = readConfigFile;
exports.mergeOptions = mergeOptions;

//output info
//tool function define
function colorPrint(label, msg) {
    //返回剩余参数
    var resideArg = [].slice.call(arguments, 2);
    resideArg.unshift(colors[label](msg));
    console.log.apply(this, resideArg);
}

/**
 * 允许不配置文件返回默认配置项
 * TODO:后续支持不配置 .zenmock 文件进行测试的功能
 * TODO: 遇到非常诡异的错误,函数名为 readConfig 时会报错,后续需研究原因
 */
function readConfigFile(option = {}) {
    let mergeConfig = deepmerge(DEFAULT_CONFIG.parent,option);
    let {config,configFileName} = mergeConfig;
    let configFile = '';
    if(path.isAbsolute(config)) { //如果绝对路径则直接和文件名拼接
        configFile = path.join(config,configFileName);
    } else { //相对路径则相对运行目录设定配置文件
        configFile = path.resolve(config,configFileName);
    }
        
    try {
        return require(configFile);
    } catch (e) {
        colorPrint('warn','建议在项目根目录配置 .zenmock.js 文件');
        return {};
    }
}

/**
 * 
 * @param {string} filename 解析文件名
 */
function parseFileOpts(filename) {
    return filename;
}
/**
 * 
 * @param {string} url 解析 url
 */
function parseUrlOpts(url) {
    if(!validUrl.isHttpUri(url)) {
        throw new Error('确保为合法的 http url!')
    } else {
        return url;
    }
}


/**
 * 提取父命令上合法选项
 * @param {object} options commander  对象
 */
function mergeOptions(options={}) {
    //提取父命令对象,和子命令名
    const { parent, _name: sub } = options;
    const {
        parent: defaultParent, //获取父命令默认参数
        [sub]: defaultSub //子命令默认参数
    } = DEFAULT_CONFIG;
    let mergeOptions = {};//保存合并选项

    for (let key in defaultParent) {
        mergeOptions[key] = parent[key] || defaultParent[key]
    }
    //读取父命令配置并导入配置文件
    let fileConfig = readConfigFile(mergeOptions);

    for (let key in defaultSub) {
        //当命令行未配置时,采用文件配置,若文件也未配置,采用默认配置.
        mergeOptions[key] = options[key] || fileConfig[key] || defaultSub[key]
    }

    return mergeOptions;
}




