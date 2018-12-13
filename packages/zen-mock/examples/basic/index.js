const MockServer = require('zen-mock'); //引入 zen-mock
const path = require('path');//引入原生 path 模块

/**
 * 实例化 mockserver 支持的所有配置项
 * root 配置路由设置文件,默认为项目根目录下的 mock 文件
 * 
 */
const mockServer = new MockServer({
    root:path.join(__dirname,'./mock') //设定服务配置目录
});
//启动 zen-mock
//mockServer.app 指向 express app 实例,此处调用该实例 listen 方法启动 mock
mockServer.app.listen(3000, () => console.log('zen-mock listening on port 3000!'))