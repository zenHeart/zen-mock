该范例演示如何使用 [zen-api-parser](../../README.md) 解析配置.
执行如下代码运行示例.

```bash
# 检出 github 示例到本地,若未安装 svn 则直接复制 basic 目录到本地即可
svn checkout https://github.com/zenHeart/zen-mock/trunk/packages/zen-api-parser/examples/basic 
# 切换到示例根目录
cd basic
# 安装依赖
npm install
# 运行示例
npm run examples:basic
```


该示例说明了, zen-api-parser 解析配置文件的规则.
及输出内容,可参看 [../../README.md] 自行测试其他情况.

文件结构说明.含义参看注释

```
├── README.md
├── index.js //范例启动文件
├── mock //配置目录
│   └── foo.js //配置文件
└── package.json //npm 包文件
```



