# `browser`

> 浏览器监控基座，内置错误捕获sdk

可捕获错误类型
- js错误
- 资源加载错误
- unhandledrejection

默认使用 sendBeaconAPI （post）上报

## Options

|配置名称|类型|描述|可选值|默认值|
|-|-|-|-|-|
|dsn|Object|上报接口配置信息|DSN|-|
|app|Object|应用信息|APPInfo|-|
|enabled|Boolean|是否向后台发送事件|true/false|true|
|maxBreadcrumbs|Number|面包屑最大层级|-|5|
|plugins|Array|插件集合|-|-|

### DSN

|名称|类型|描述|可选值|
|-|-|-|-|
|host|String|上报接口域名地址|-|
|init|String|应用初始化接口地址|-|
|upload|String|信息上报接口地址|-|

### APPInfo

|名称|类型|描述|可选值|
|-|-|-|-|
|name|String|应用名称|-|
|leader|String|负责人|-|
|desc|String|应用描述|-|

## Usage

### CDN

```html
<script src="/dom-dist/dom.iife.js"></script>
<script>
    window.__HEIMDALLR_OPTIONS__ = {
        dsn: {
            host: 'localhost:8888',
            init: '/project/init',
            upload: '/log/upload'
        },
        app: {
            name: 'playgroundAPP',
            leader: 'test',
            desc: 'test proj'
        },
        plugins: [
            HEIMDALLR_DOM,
        ],
        debug: true
    };
</script>
<script async src="/browser-dist/browser.iife.js"></script>
```

### npm

```js

```
