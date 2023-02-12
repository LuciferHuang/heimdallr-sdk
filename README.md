# `heimdallr-sdk`

node version: 16+
npm script: yarn

## Dev

安装依赖

```bash
yarn
```

需要本地存在 mysql 数据库服务

- host: localhost
- port: 3306

初始化数据库，将自动创建 `test_base` 数据库用于调试

```bash
yarn prisma
```

启动本地服务

```bash
yarn dev
```

监控后台服务地址：[http://localhost:8888](http://localhost:8888)

监控后台地址：[http://localhost:5173](http://localhost:5173)

（确保 3306、7777、8888、5173 端口未被占用）

## Build

安装依赖

```bash
yarn
```

构建单个包

```bash
yarn workspace [packageName] build
```

如：构建 browser 包

```bash
yarn workspace @heimdallr-sdk/browser build
```

构建所有包

```bash
yarn build
```
