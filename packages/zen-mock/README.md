zen-mock
====

**基于 express,mockjs 实现配置化的 mock server**

----

## 项目说明
通过配置项,快速模拟 server(**主要针对 JSON API 服务**)行为.

适用基于接口分离的项目中,快速搭建 server.模拟后端行为

zen-mock 提供如下特性

* 支持 js 和 json 的配置格式
* 递归解析配置文件路径及文件名作为路由结构,也可通过 `req.path` 修改路由结构
* 支持 [mockjs 规范](http://mockjs.com/examples.html) 模拟响应数据
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
* [X] 实现利用配置项启动 server
* [X] 实现自定义 server 特性 
* [X] 实现热更新
* [X] 实现自动测试接口功能
* [ ] 实现导出到 postman


