zen-api-parser
====

**zen api 配置解析器**

------

## 项目说明
用于 [zen-mock](../zen-mock/README.md) 项目,解析 api 配置.
支持合法的 `json,js` 配置文件.


## 安装
```bash
npm i zen-api-parser
```

## 快速入门
参看示例 [basic]()

## 配置详述
zen-api-parser 直接读取配置文件.
默认解析遵循如下约定.更详细的解析参见 [原理浅析](#原理浅析)

* 读取配置文件不包含合法配置,则整个配置内容作为 mock 的响应体
* 读取配置文件为函数,直接作为 express 的响应函数返回
* 合法的配置文件,配置项如下

* `req` 配置请求,合法的配置对象,详细配置项如下
  * `req.method` 可选,默认 get 请求,支持所有合法 http 请求,**注意采用小写**
  * `req.path` 可选,设置请求路径,默认值为配置文件相对配置根目录对应的路径
  * `req.header` 可选,配置请求头,支持采用 mockjs 设置参数
  * `req.params` 可选,设置请求路径中携带的参数,支持 mockjs 模式模拟数据
  * `req.query` 可选,设置请求查询字段,支持 mockjs 模式模拟数据
  * `req.body` 可选,设置请求体,支持 mockjs 模式模拟数据
* `resp` 配置响应,分为三种情况
  * 若为函数,则直接作为 express 响应函数
  * 若不包含合法配置项则整个配置内容作为响应体
  * 若为合法配置对象,配置规则如下
    * `resp.body` 可选,设置响应体,支持 mockjs 模式模拟数据
    * `resp.header` 可选,设置响应头,支持 mockjs 模式模拟数据

## 原理浅析
默认解析规则如下,**只对核心流程进行描述,详细逻辑请查看源码**

1. 采用 require 读取 api 配置文件
2. 若存在 req,resp 配置字段则解析配置
   1. 传入 req 给 [request](./lib/request.js) 解析
        1. 合并默认配置  
        2. 未配置 path,则结合配置文件目录和配置根目录生成默认路径
            
            > 文件名为 `index` 则忽略文件名只采用相对配置目录的路径作为 path.
        3. mock 相关数据并返回处理后的 req 对象 
   2. 传入 resp 给 [respond](./lib/respond.js) 解析
        1. 根据传入类型做响应处理
           * resp 为函数则直接返回该函数并在函数上附带解析后的配置参数
           * 非函数则包装后返回 express 处理函数
        2. 返回 epxress 请求处理函数,并合并配置到返回的处理函数上
3. 若没有 req 字段则,将整个配置传入 [respond](./lib/respond.js) 进行解析
4. 返回形如
    ```js
    {
        req:{
            path:"/foo",
            //...
        },
        resp:function(req,res) {
            //...
        }
    }
    ```
    的处理后对象
