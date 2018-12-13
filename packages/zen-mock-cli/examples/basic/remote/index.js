//本地复制时将该 require('../src/MockServer') 修改为 require('zen-mock');
const MockServer = require('zen-mock');
const remoteServer = new MockServer({
    root:__dirname+'/server'
});

//启动 zen-mock
remoteServer.app.listen(3000, () => console.log('remote server listening on port 3000!'))
