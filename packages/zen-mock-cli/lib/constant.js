const  path = require('path');

//TODO:存在和 commander 内部对象混合的可能,需解决
exports.DEFAULT_CONFIG = {
    parent: { //父命令配置
        root:'mock',
        config: '.', //默认配置文件读取目录
        configFileName: '.zenmock',//默认配置文件名    
    },
    test: { //zm test 默认配置
        timeout: 5000,//请求默认等待时间,最长为 5 s
        testUrl: 'http://localhost'
    },
    postman: { //zm postman 命令默认配置
        host: 'http://localhost', //主机地址
        filename: 'zen-mock.postman',
        savePath:path.resolve()
    },
    serve: { //zm server 默认配置
        port:3000
    },
}