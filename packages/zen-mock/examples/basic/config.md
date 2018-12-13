
## 配置项
### MockServer 实例配置
* **root** 可选,表示读取路由配置文件的根目录,默认为相对脚本运行目录的 `mock` 文件夹,
* **hotLoad** 可选,是否启动热加载,默认为 true,若不启动需要手动重启 mock server 才可更新配置
* **staticDir** 可选,作为静态资源的目录,默认为相对脚本运行目录的 `mock/static` 文件夹,
* **ignoreDir** 可选,读取路由配置文件时忽略的目录组,默认为 `[]` 假设设定为 `['ignore']`,则 zen-mock 不会读取配置 `root` 目录下的 `ignore` 文件中内容.


### 路由配置
* `req` 可选,配置请求
    * `req.path` 可选,配置路由路径,等同 [express route path](http://expressjs.com/en/guide/routing.html#route-paths),未设定时,路径为相对配置文件夹目录,加文件名,若文件名为 index,则表示对应根目录,参见 [basic 示例](./README.md#配置示例说明)
    * `req.method` 可选,默认为 get
    * `req.header` 可选,在 zen-mock-cli 中模拟请求头
    * `req.items` 可选,在 zen-mock-cli 中模拟字段
    * `req.body` 可选,在 zen-mock-cli 中模拟请求体
* `resp` 可选,配置响应
    * `resp.header` 可选,配置响应头
    * `resp.body` 必选配置响应体,可以为函数或,对象,对象会直接调用 mockjs 生成数据

注意在设定配置时,zen-mock 做了如下处理,来简化配置.

1. 未检测到 `req` 配置
    * 设定请求为 get
    * 组合文件名和相对配置目录的路径作为路由
    
    > 若文件名为 index 则只提取路径作为路由
2. 根对象未检测到 `resp` 配置项
    1. 若为 json 文件则将整个文件作为 `resp.body` 的配置项
    2. 若为 js 文件
        1. 若返回函数则将之间作为 express 的路由 handle
        2. 若为对象则整个对象作为, `reps.body` 的配置项,放入 `Mock.mock` 生成响应数据

