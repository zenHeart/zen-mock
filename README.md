zen-mock
====

**基于 express,mockjs 等实现配置化的 mock server**

----
## 概述
zen-mock 是基于 [http://expressjs.com/] 和 [mockjs](http://expressjs.com/) 的 mock server.
利用配置项快速模拟 server 端接口(主要是 json 接口).


## 快速入门
1. 安装 zen-mock

    ```bash
    npm install -D zen-mock
    ```
2. 参看 [examples](./examples) 复制文件夹到项目根目录
   > **注意参考 [basic.js](./examples/basic) 中的注释修改 zen-mock 的引用 **
3. 引用修改完后在 `package.json ` scripts 字段中添加如下命令.
    ```json
    "start:mock": "nodeexamples/basic.js"
    ```
4. 运行 `npm run start:mock` 及开启了 mock server.
5. 在 [mock](./examples/mock)已配置了一系列路由,访问 [only-resp](http://localhost:3000/only-resp) 可看到返回值为 `{"foo":1}`
6. 查看 [only-resp 配置文件](./examples/mock/only-resp.json) 内容如下

    ```json
    {
        "resp":{
            "body":{
                "foo":1
            }
        }
    }
    ```

    各配置项含义为
    * `resp` 配置响应
    * `resp.body` 配置响应包返回的 json 对象

    > 当未检测到 `req` 请求配置时,zen-mock 会默认请求为 get,并将文件名作为路由,所以访问
    <http://localhost:3000/only-resp> 可直接看到结果.

    修改文件内容如下
    ```json
    {
        "resp":{
            "body":{
                "test":"hello zen mock"
            }
        }
    }
    ```

    重新访问 [only-resp](http://localhost:3000/only-resp) 即可看到返回值为 `{"test":"hello zen mock"}`

    > **注意此处需刷新两次才可看到效果,第一次刷新是为了重载路由,后续才可正常访问.**
    > 该处利用一次请求访问,自动更新了路由配置(下次访问即可查看到变化).
    > 避免每次修改配置后需要手动重启 mock server 

7. 基于上述原理,在 `examples/mock` 目录创建 `demo.js` ,添加如下内容

    ```js
    module.exports = {
        test:"hello"
    }
    ```

    访问 [demo 页面](http://localhost:3000/demo) 刷新两次即可看到返回内容为 `{"test":"hello"}`
    当未检测到 resp 配置项时,zen-mock 会将整对象作为响应体以 json 形式返回.
8. 可采用 mockjs 模拟返回数据,修改 `demo.js` 文件为如下内容 

    ```js
     //支持采用 mockjs 配置响应内容,详情参看 http://mockjs.com/examples.html
    module.exports = {
        code:/\d{6}/, //mockjs 正则模拟 6 位数字的字符串
        data:{
            'record|1-5':[{ //mockjs 模拟一个长度从 1-5 的随机数组
                url:'@url' //mockjs 模拟生成一个 url
            }]
        }
    }
    ```

    重新访问 <http://localhost:3000/demo> 会返回随机内容.可以刷新多次查看效果.

9.  除了 get 请求,可以通过配置 `req` 字段模拟其他请求,修改 `demo.js` 如下
    ```js
    //导出配置文件
    module.exports = {
        req:{ //配置请求
            path:'/zen/demo', //配置 router 该等效为express 中的 route,详情参看 http://expressjs.com/en/guide/routing.html
            method:'post' //配置方法为 post,会自动调用 express 中的 post 方法
        },
        resp:{//配置响应
            body:{ //配置响应体
                code:/\d{6}/, //支持采用 mockjs 配置响应内容,详情参看 http://mockjs.com/examples.html
                data:{
                    'record|1-5':{
                        url:'@url'
                    }
                }
            }
        }
    }
    ```
    由于请求为 post 运行如下命令 `curl -X POST  localhost:3000/zen/demo?[1-2]`
    该命令使用 curl 命令模拟两次 post 请求发送.第二次会看到返回结果
    > 若未安装 curl 可采用 postman 发送两次请求第二次即可看到该结果.
    
    结合 mockjs 及上述讲解即可满足日常的 mock 服务

10. 当需要模拟服务端逻辑时,可以配置响应为一个函数,修改 `demo.js` 如下
    
    ```js
    module.exports = function(req,res) {
        res.send('返回函数');
    }
    ```

    重现访问 <http://localhost:3000/demo>(记得刷新两次,后续不再强调),即可看到`返回函数`.
    该函数和 express 中的响应函数完全相似
    > 此处只支持最终的响应函数,不要采用中间件的形式书写返回函数

    更详细的配置可参看 [examples/mock](./examples/mock/) 目录的示例.

## 原理浅析
查看 [examples/basic.js](./examples/basic) 注释可知,
1. zen-mock 通过配置 `root`,递归解析该目录下的接口配置文件
2. zen-mock 将配置文件转化为 express 的路由配置
3. 利用实例化的 `mockServer` 内部引用的 express app 对象挂载路由配置
4. 然后启动 `mockServer.app` 对应的 express 引用即可.
   
目前 zen-mock 支持如下配置项

* **root** 可选,表示读取路由配置文件的根目录,默认为相对脚本运行目录的 `mock` 文件夹,
* **hotLoad** 可选,是否启动热加载,默认为 true,若不启动需要手动重启 mock server 才可更新配置
* **staticDir** 可选,作为静态资源的目录,默认为相对脚本运行目录的 `mock/static` 文件夹,
* **ignoreDir** 可选,读取路由配置文件时忽略的目录组,默认为 `[]` 假设设定为 `['ignore']`,则 zen-mock 不会读取相对 `root` 目录下 `ignore` 目录中内容.

zen-mock 会自动进行如下处理

1. 当未检测到 `req` 配置项时,会利用将文件名最为 path ,会默认使用 `app.get` 加载路由.
若为嵌套目录,则合并目录为 path,假设读取的配置文件为 `foo/bar/demo.js` 则对应 path 为 '/foo/bar/demo'.
    > app 表示 express 的实例对象   
2. 当未检测到 `resp` 字段时,会默认将整个配置文件作为响应体,注意如下问题
    
    ```js
    //由于未配置响应此处会将整个内容作为响应体返回
    module.exports = {
        req:{path:'/hello'}
    }
    ```

    正确配置为

    ```js
    //由于未配置响应此处会将整个内容作为响应体返回
    module.exports = {
        req:{path:'/hello'},
        resp:{
            body:{data:'hello zen-mock'}
        }
    }
    ```
    若配置项为函数则,自动采用该函数最为 express 的响应函数.

## todo
* [X] 实现利用配置项启动 server
* [X] 实现自定义 server 特性 
* [X] 实现热更新
* [ ] 实现本地存储特性
* [ ] 实现导出到 postman
* [ ] 实现自动测试接口功能
