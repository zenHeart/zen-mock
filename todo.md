## 2018-12-19
* [ ] 支持命令行在低版本使用
* [ ] 编写命令行测试代码
* [ ] 默认配置报错
## 2018-12-04
* [ ] 修改代码结构为异步模式,支持类似 webpack loader 来处理配置
* [ ] 兼容 node 6.x,npm 3.x webpack 2.x
## 2018-11-27
* [ ] 添加 lerna 管理 cli 工具
* [ ] 可以集成代理功能,在实际上调试接口过程中利用
zen-mock 作为代理,当实际服务器不可用时,利用 mock 数据,当实际可用时返回真实数据.实现对请求的重放
## 2018-11-20
* [ ] 使用 webpack 无法触发代理模式,需保证既可以 mock 也不影响代理模式的设置
* [ ] 添加测试功能,一键验证接口
* [ ] 和文档合并,实现利用文档自动生成 mock,测试的功能
## 2018-10-17
* [ ] 添加即使服务器出错也可以重载的功能
## 参考资料
* [collection ](http://www.postmanlabs.com/postman-collection/Collection.html#toJSON)
* [npm collection](https://github.com/postmanlabs/postman-collection)

    