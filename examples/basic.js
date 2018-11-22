//本地复制时将该 require('../src/MockServer') 修改为 require('zen-mock');
const MockServer = require('../src/MockServer');
const path = require('path');

//配置 zen-mock
const mockServer = new MockServer({
    root:path.join(__dirname,'./mock') //设定读取的配置目录文件夹
});

//启动 zen-mock
mockServer.app.listen(3000, () => console.log('Example app listening on port 3000!'))
