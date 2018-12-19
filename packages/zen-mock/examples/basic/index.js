const MockServer = require('zen-mock'); //引入 zen-mock
const path = require('path');//引入原生 path 模块

/**
 * 实例化 mockserver 
 * 
 */
const mockServer = new MockServer(); //默认会读取 mock 目录作为配置根目录

//启动 zen-mock
//mockServer.app 指向 express app 实例,此处调用该实例 listen 方法启动 mock
mockServer.app.listen(3000, () => console.log('zen-mock listening on port 3000!'))