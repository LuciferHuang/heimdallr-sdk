# `@heimdallr-sdk/wx-dom`

> 捕获小程序的点击事件并上报

## Options

|配置名称|类型|描述|默认值|
|-|-|-|-|
|ignoreUrls|Array|过滤请求url|-|
|reportResponds|Boolean|是否上报返回值，开启后将使用 post 上报(仍可通过reqOption修改)|false|

## Usage

```js
import heimdallr from "@heimdallr-sdk/wx";
import heimdallrWxDom from "@heimdallr-sdk/wx-dom";
const heimdallrInstance = heimdallr({
    dsn: {
        host: 'http://localhost:8888',
        init: '/project/init',
        upload: '/log/upload'
    },
    app: {
        name: 'playgroundWx',
        leader: 'test',
        desc: 'test wx proj'
    },
    plugins: [heimdallrWxDom]
});
```
