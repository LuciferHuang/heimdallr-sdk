# `heimdallr-sdk`

node version: 16+
npm script: yarn

## Dev

安装依赖

```bash
yarn
```

启动本地服务

```bash
yarn dev
```

sdk示例地址：[http://localhost:8888](http://localhost:8888)

监控后台地址：[http://localhost:5173](http://localhost:5173)

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
