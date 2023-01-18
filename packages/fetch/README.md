# `fetch`

> 捕获 fetch 请求，上报请求头、响应、请求耗时

## Options

|配置名称|类型|描述|默认值|
|-|-|-|-|
|ignoreUrls|Array|过滤请求url|-|

## Usage

### cdn

```html
<script src="[fetch-dist]/fetch.iife.js"></script>
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
            HEIMDALLR_FETCH,
        ]
    };
</script>
<script async src="/browser-dist/browser.iife.js"></script>
```

### npm

```js
import heimdallr from "@heimdallr-sdk/browser";
import fetchPlugin from "@heimdallr-sdk/fetch";
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
        fetchPlugin,
    ]
});
```
