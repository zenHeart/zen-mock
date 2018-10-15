const MockServer = require('../src/MockServer');
const path = require('path');

const mockServer = new MockServer({
    root:path.join(__dirname,'./mock')
});
mockServer.app.listen(3000, () => console.log('Example app listening on port 3000,use default config!'));
