
## 配置项
### MockServer实例配置
传入 js 对象实例化 MockServer,示例如下

```js
mockServer = new MockServer({
    root:__dirname+'mock',
    //..
})
```

支持配置属性如下

配置项|是否必须|类型|作用
:---|:---|:---|:---|
**root** | 可选 | String | 表示读取路由配置文件的根目录,默认为 `path.resolve('mock')` 表示相对脚本运行目录的 `mock` 文件夹,**必须是绝对路径**
**hotLoad** | 可选 | Boolean| 是否启动热加载,默认为 true,若不启动需要手动重启 mock server 才可更新配置
**staticDir** | 可选 | String | 作为静态资源的目录,默认为相对脚本运行目录的 `mock/static` 文件夹,
**ignoreDir** | 可选 | Array | 读取路由配置文件时忽略的目录组,默认为 `[]` 假设设定为 `['ignore']`,则 zen-mock 不会读取相对配置 `root` 目录下的 `ignore` 文件中内容.


### 路由配置
zen-mock 会读取[实例化 MockServer](#MockServer实例配置) 时设定的 `root` 目录
下的文件为路由配置.每一个路由配置可以是一个 `json` 或 `js` 文件.
> 注意 js 文件必须采用  `module.exports` 导出

常用配置

* `req` 可选,配置请求
    * `req.path` 可选,配置路由路径,等同 [express route path](http://expressjs.com/en/guide/routing.html#route-paths),未设定时,路径为相对配置文件夹目录,加文件名,若文件名为 index,则表示对应根目录,参见 [basic 示例](./README.md#配置示例说明)
    * `req.method` 可选,默认为 get
* `resp` 可选,配置响应
    若为函数则直接,作为 express 响应句柄,
    若为对象则支持如下选项
    * `resp.header` 可选,配置响应头
    * `resp.body` 必须,配置响应体
  
    若不合法则整个内容作为 `resp.body`

> 注意在设定配置时,zen-mock 做了如下处理,来简化配置.

1. 未检测到 `req` 配置 
    * 设定请求为 get
    * 组合文件名和相对配置目录的路径作为路由
    
    > 若文件名为 index 则只提取路径作为路由
2. 根对象未检测到 `resp` 配置项
   1. 若不合法则整个内容作为 resp.body

具体的使用可以参看 [范例中的配置示例说明](#配置示例说明).

更深入理解参看 [zen-api-parser](../../../zen-api-parser/README.md)