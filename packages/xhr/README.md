# @heimdallr-sdk/xhr

[English](./README_en.md)

> 捕获 XMLHttprequest 请求，上报请求头、响应、请求耗时

## Options

|配置名称|类型|是否必填|描述|默认值|
|-|-|-|-|
|ignoreUrls|Array|否|过滤请求url|-|
|reportResponds|Boolean|否|是否上报返回值|false|

## Usage

### cdn

```html
<script src="[xhr-dist]/xhr.iife.js"></script>
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
            HEIMDALLR_XHR(),
        ]
    };
</script>
<script async src="/browser-dist/browser.iife.js"></script>
```

### npm

```js
import heimdallr from "@heimdallr-sdk/browser";
import xhrPlugin from "@heimdallr-sdk/xhr";
heimdallr({
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
        xhrPlugin(),
    ]
});
```
