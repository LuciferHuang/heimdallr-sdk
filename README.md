
<h2 style="color:#10b981">HEIMDALLR-SDK</h2>

一款简单易用、轻量化、插件化的前端监控sdk

An easy-to-use, lightweight, plug-in front-end monitoring SDK

## Documentation

To check out docs, visit [heimdallr-sdk](https://luciferhuang.github.io/heimdallr-sdk/).

## Env

- node version: `16+`
- npm script: `yarn`

## Preparation

Make sure `MySQL` and `RabbitMQ` are installed

## Dev

Installation Dependency

```bash
yarn
```

Ensure that the local MySQL database service is started

- host: localhost
- port: 3306

Initialize the database and automatically create a database named `test_base` database for debugging

```bash
yarn prisma
```

If this is the first run, execute the build script first

```bash
yarn build
```

Start Local Service

```bash
yarn dev
```

## Build

Installation Dependency

```bash
yarn
```

Build a single package

```bash
yarn workspace [packageName] build
```

For example, build a browser package

```bash
yarn workspace @heimdallr-sdk/browser build
```

Build all packages

```bash
yarn build
```
