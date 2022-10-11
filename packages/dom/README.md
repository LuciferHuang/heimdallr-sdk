# `dom`

> 捕获 dom 元素点击事件并上报

## Options

|配置名称|类型|描述|默认值|
|-|-|-|-|
|throttleDelayTime|Number|节流阈值（ms）|2000|

## Usage

### cdn

```html
<script src="[dom-dist]/dom.iife.js"></script>
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
import heimdallr from "@heimdallr-sdk/browser";
import domPlugin from "@heimdallr-sdk/dom";
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
        domPlugin,
    ],
    debug: true
});
```
