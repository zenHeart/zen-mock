# zen-mock 完整学习指南

> HTTP Mock 服务器工具链，适合前后分离项目的 API 模拟

---

## 目录

- [项目概览](#项目概览)
- [快速开始](#快速开始)
- [核心概念](#核心概念)
- [zen-mock 核心包](#zen-mock-核心包)
- [zen-mock-cli 命令行工具](#zen-mock-cli-命令行工具)
- [zen-api-parser 配置解析器](#zen-api-parser-配置解析器)
- [对比其他 Mock 工具](#对比其他-mock-工具)
- [常见问题](#常见问题)

---

## 项目概览

zen-mock 是一个 **monorepo**，包含三个包：

```
zen-mock/
├── packages/
│   ├── zen-mock/         # 核心：基于配置的 Mock 服务器
│   ├── zen-mock-cli/     # CLI：命令行工具 + 接口校验
│   └── zen-api-parser/   # 解析器：配置文件解析工具
└── README.md
```

### 三个包的关系

```
zen-api-parser     (底层解析器)
       ↓
zen-mock           (基于解析器构建 Mock 服务器)
       ↓
zen-mock-cli       (封装 CLI + 接口校验功能)
```

---

## 快速开始

### 安装

```bash
# 安装全部包（monorepo）
npm install

# 或单独安装某个包
npm i -D zen-mock              # 核心包
npm i -g zen-mock-cli          # 命令行工具（全局）
```

### 启动 Mock 服务器

```bash
# 进入示例目录
cd packages/zen-mock/examples/basic
npm install
npm run start:mock
# 访问 http://localhost:3000
```

---

## 核心概念

### 1. 配置文件即路由

zen-mock 的核心理念：**配置文件路径 = API 路由路径**

```
mock/
├── index.json        → GET /
├── user.json         → GET /user
├── user/
│   ├── index.js     → GET /user
│   └── profile.js   → GET /user/profile
└── post/
    └── [id].js      → GET /post/:id
```

### 2. 配置文件结构

```js
// mock/user.js
module.exports = {
  // 请求配置（可选）
  req: {
    method: 'get',        // HTTP 方法，默认 get
    path: '/user',        // 路由路径，默认从文件路径推导
    header: {},           // 请求头
    query: {},            // Query 参数
    body: {}              // 请求体
  },
  
  // 响应配置（必选）
  resp: {
    header: {},           // 响应头
    body: {}              // 响应体，支持 MockJS 语法
  }
}
```

### 3. 支持的响应类型

| 类型 | 示例 | 说明 |
|------|------|------|
| 静态 JSON | `{ "name": "zen" }` | 直接返回 |
| MockJS | `{ "name|1-10": "★" }` | 随机生成 |
| 函数 | `function(req, res) { ... }` | Express Handler |

---

## zen-mock 核心包

**基于 Express + MockJS 实现配置化的 Mock Server**

### 特性

- ✅ 支持 JS 和 JSON 配置文件
- ✅ 支持 MockJS 规范模拟响应数据
- ✅ 递归解析配置文件路径作为路由结构
- ✅ 支持 Express Handler 函数模拟复杂请求
- ✅ 支持静态资源模拟
- ✅ 热更新（修改配置无需重启）
- ✅ 结合 zen-mock-cli 可自动测试接口

### 简单示例

```js
// mock/index.js
const ZenMock = require('zen-mock')

const mock = new ZenMock({
  root: './mock',     // 配置文件目录
  port: 3000
})

mock.listen(() => {
  console.log('Mock server running at http://localhost:3000')
})
```

---

## zen-mock-cli 命令行工具

**Mock 服务器命令行工具 + 接口自动校验**

### 安装

```bash
npm i -g zen-mock-cli
```

### 常用命令

```bash
zm --help              # 查看帮助
zm mock                # 启动 Mock 服务器
zm test                # 校验接口
zm postman             # 导出为 Postman Collection
```

### 启动 Mock 服务器

```bash
# 在项目根目录
zm mock --root ./mock --port 3000

# 使用 postman 验证接口
zm test --root ./mock
```

---

## zen-api-parser 配置解析器

**解析 zen-mock 配置文件的核心解析器**

### 安装

```bash
npm i zen-api-parser
```

### 解析结果格式

```js
const parser = require('zen-api-parser')
const config = parser.parse(require('./mock/user.js'))

// config 格式
{
  req: {
    path: '/user',
    method: 'get',
    header: {},
    query: {},
    body: null
  },
  resp: function(req, res) {
    // Express Handler
  }
}
```

---

## 对比其他 Mock 工具

| 特性 | zen-mock | msw (Mock Service Worker) | json-server | miragejs |
|------|----------|---------------------------|-------------|----------|
| 架构 | Express Server | Service Worker (浏览器层) | Express Server | Ember 插件 |
| 配置方式 | 文件系统 | 程序化 API | JSON 文件 | 程序化 API |
| 覆盖阶段 | 服务器层 | 网络层（拦截请求） | 服务器层 | 服务器层 |
| 支持 MockJS | ✅ | ❌ (原生支持 faker.js) | ❌ | ✅ |
| 接口校验 | ✅ (CLI) | ❌ | ❌ | ❌ |
| 静态资源 | ✅ | ❌ | ❌ | ✅ |
| 浏览器支持 | ✅ | ✅ (现代浏览器) | ✅ | ✅ (需构建) |
| 维护状态 | ⚠️ 较少更新 (2021) | ✅ 活跃 | ✅ 活跃 | ⚠️ 较少更新 |

### 何时用 zen-mock

- ✅ 前后分离项目，需要本地 Mock API
- ✅ 已有大量 zen-mock 配置文件
- ✅ 需要 CLI 接口校验功能
- ✅ 简单场景，不需要复杂的请求拦截

### 何时迁移到 msw

- ✅ 已有 React/Vue 项目使用现代框架
- ✅ 需要在浏览器层拦截请求
- ✅ 需要持续维护和社区支持
- ✅ 需要与 Testing Library 等工具集成

---

## 常见问题

### Q: 修改配置后需要重启服务器吗？

**不需要**。zen-mock 实现热更新，访问对应路由时自动重载配置。修改配置后刷新两次即可。

### Q: 如何处理 POST 请求？

```js
// mock/post.js
module.exports = {
  req: {
    method: 'post',
    path: '/api/submit'
  },
  resp: {
    body: {
      success: true,
      message: '提交成功'
    }
  }
}
```

测试：
```bash
curl -X POST http://localhost:3000/api/submit \
  -H 'Content-Type: application/json' \
  -d '{"name":"zen"}'
```

### Q: 如何自定义路由路径？

```js
module.exports = {
  req: {
    path: '/custom/path'  // 覆盖默认路径
  },
  resp: {
    body: { custom: true }
  }
}
```

### Q: 配置文件支持哪些格式？

- `.js` — 支持 MockJS 语法和函数
- `.json` — 纯静态数据
- 其他文件 — 作为静态资源暴露

---

## 相关资源

- GitHub: https://github.com/zenHeart/zen-mock
- npm: https://www.npmjs.com/package/zen-mock
- MockJS 文档: http://mockjs.com/examples.html
- Express 路由: https://expressjs.com/en/starter/basic-routing.html
