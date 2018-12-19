## 示例说明
该示例说明如何使用 zen-mock 作为 mock-server. 
使用前,确保已 [安装 zen-mock](../../README.md#安装)

## 示例步骤
1 在桌面,创建 `zen-mock-demo` 文件夹,将 [examples/basic](../basic) 中的内容拷贝到 `zen-mock-demo`

> 若本地安装了 SVN 采用如下命令,在桌面执行如下命令
> ```bash
> svn checkout https://github.com/zenHeart/zen-mock/trunk/packages/zen-mock/examples/basic zen-mock-demo
> ```

2 执行如下命令

```bash
# 安装 npm 依赖
npm install
# 启动 mock server
npm run start:mock 
```

3 访问 <http://localhost:3000> 可看到返回值为 `home`


参看 [index.js](./index.js) 注释可知,实例化 zen-mock 时会默认读取 [mock 文件夹](./mock) ,该文件夹包含了所有配置.每一个文件代表一个
路由配置. 

> * [MockServer实例配置](./config.md#MockServer实例配置)
> * [路由配置](./config.md#路由配置)

## 原理浅析
1. zen-mock 通过配置 `root`,递归解析该目录下的路由配置文件
2. zen-mock 将配置转化为 [express 路由](https://expressjs.com/en/starter/basic-routing.html)
3. 内部实例化 express app 对象挂载路由配置
4. 暴露内部 express 对象为 `mockServer.app`,并调用 listen 启动服务.

> **默认情况,配置文件的路径加上文件名即为请求路径,其中 index 会默认作为根目录**

> 参看该示例中各配置文件说明

### 配置示例说明
配置文件路径|请求访问路径|说明
:---|:---|:---|
[index.json](./mock/index.json)|[/](http://localhost:3000)|默认 index 作为根目录
[basic.json](./mock/basic.json)|[/basic](http://localhost:3000/basic)|不包含 req,resp 配置,整个数据作为响应返回
[mock.js](./mock/mock.js)|[/mock](http://localhost:3000/mock)|采用 mockjs 模拟响应数据
[header.js](./mock/header.js)|[/header](http://localhost:3000/header)|配置header 设置 cookie 等
[function.js](./mock/function.js)|[/function](http://localhost:3000/function)| 支持 express 函数设定响应格式
[sub/index.js](./mock/sub/index.js)|[/sub](http://localhost:3000/sub)|解析为子路由规则同上
[sub/foo.json](./mock/sub/foo.json)|[/sub/foo](http://localhost:3000/sub/foo)|规则同上
[static/static.txt](./mock/static/static.txt)|[/static.txt](http://localhost:3000/static/static.txt)|static 目录下的内容为静态资源


当未配置 `req` zen-mock 结合路由解析规则,设置响应为 get.
若需要设定 post 参看 [post 配置示例](./mock/post.js)采用 postman ,或采用 curl 查看返回

```bash
curl -X POST \
  http://localhost:3000/req \
  -H 'Content-Type: application/json' \
  -d '{
	"a":1
}'
```

5 基于上述规则,可知 <http://localhost:3000> 对应的配置文件为
[index.js](./mock/index.js) 修改字符串为 `hello zen-mock`.

刷新页面两次,访问 <http://localhost:3000> 即可查看到返回内容为 `hello zen-mock`

> zen-mock 实现了热重载,你无须重启服务,zen-mock 会在访问路由时重载新的配置文件
> 第二次刷新即可正常访问
> **注意任何时候修改了配置文件,多刷新一次重载路由,才可正常访问,后续不再赘述**


你可以仿照 [示例配置](#配置示例说明) 创建新的路由文件验证上述特性.

详细的配置项参见 [config](./config.md)

