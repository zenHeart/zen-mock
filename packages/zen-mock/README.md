zen-mock
====

**基于 express,mockjs 实现配置化的 mock server**

----

## 项目说明
适用于前后分离的项目中,通过配置项,快速模拟 server.

zen-mock 提供如下特性

* 支持 js 和 json 的配置格式
* 支持 [mockjs 规范](http://mockjs.com/examples.html) 模拟响应数据
* 递归解析配置文件路径及文件名作为路由结构,也可通过 `req.path` 修改路由结构
* 支持配置符合 [expressjs HANDLER](https://expressjs.com/en/starter/basic-routing.html) 的请求处理函数来模拟复杂请求

## 安装
在项目根目录运行.

```bash
# 安装 zen-mock 为开发依赖
npm i -D zen-mock
```

> 使用前确保已安装了 [nodejs](http://nodejs.cn/).


## 快速入门
参看 [examples](./examples) 目录提供了一系列使用示例.

* [入门示例](./examples/basic/README.md)

## 项目信息
使用 MIT LICENSE,详见 [LISENSE](./LICENSE)

## todo
* [X] 支持 mockjs 配置响应
* [X] 支持 header 配置
* [X] 支持配置 express [expressjs HANDLER](https://expressjs.com/en/starter/basic-routing.html) 作为响应
* [X] 支持静态资源模拟
* [X] 实现热更新
* [X] 支持结合 [zen-mock-cli][zen-mock-cli] 实现自动测试接口功能
* [X] 支持结合 [zen-mock-cli][zen-mock-cli] 启动 mock server
* [X] 支持结合 [zen-mock-cli][zen-mock-cli] 导出配置文件为 postman collections


[zen-mock-cli]: https://github.com/zenHeart/zen-mock/tree/master/packages/zen-mock-cli