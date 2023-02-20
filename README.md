# `heimdallr-sdk`

## Env

- node version: `16+`
- npm script: `yarn`

## Preparation

确保已经安装了 `MySQL` 与 `RabbitMQ`

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
