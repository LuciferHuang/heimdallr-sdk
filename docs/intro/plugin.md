# 插件

当前仅有 Browser 基座与 Wx 基座的插件

篇幅有限，只能罗列一下了，没法一个个单独讲

## For Browser

Browser 基座的所有插件均提供 CDN 与 NPM 两种引入方式

- @heimdallr-sdk/console：监听浏览器控制台的输出并上报，debug 为 false 时，控制台所有信息都不会打印
- @heimdallr-sdk/customer：自动读取存储在 cookie、localStorage、sessionStorage、window 上的数据并上报，同时也可以通过调用 `window.HEIMDALLR_REPORT(type: string, data: any)` 手动上报
- @heimdallr-sdk/dom：监听页面的点击事件并上报
- @heimdallr-sdk/fetch：监听页面发起的 fetch 请求，reportResponds 为 true 时，将连同接口返回值一同上报
- @heimdallr-sdk/xhr：监听页面发起的 XMLHttpRequest 请求，reportResponds 为 true 时，将连同接口返回值一同上报
- @heimdallr-sdk/hash：监听页面路由的 hash 变化，记录来源与跳转地址并上报
- @heimdallr-sdk/history：监听页面路由的变化，包括手动点击浏览器按钮的跳转，自动记录来源与跳转地址并上报
- @heimdallr-sdk/performance：页面性能监控，可以得到下列性能指标
  - dnsSearch: DNS 解析耗时
  - tcpConnect: TCP 连接耗时
  - sslConnect: SSL 安全连接耗时
  - request: TTFB 网络请求耗时
  - response: 数据传输耗时
  - parseDomTree: DOM 解析耗时
  - resource: 资源加载耗时
  - domReady: DOM Ready
  - httpHead: http 头部大小
  - interactive: 首次可交互时间
  - complete: 页面完全加载
  - redirect: 重定向次数
  - redirectTime: 重定向耗时
  - duration
  - fp: 渲染出第一个像素点，白屏时间
  - fcp: 渲染出第一个内容，首屏结束时间
  - fmp: 有意义内容渲染时间
  - fps: 刷新率
  - lcp: 最大内容渲染时间，2.5s 内
  - fid: 交互性能，应小于 100ms
  - cls: 视觉稳定性，应小于 0.1
  - resource: 页面资源加载耗时
- @heimdallr-sdk/record：录制当前会话所有操作并上报
- @heimdallr-sdk/page_crash：监听页面崩溃，需配合 `@heimdallr-sdk/page-crash-worker` 使用，不走基座的上报与数据转换，在 page-crash-worker 文件中使用 get 方法上报崩溃数据。从命名就能看出来，核心原理就是使用 Worker (狗头)
- @heimdallr-sdk/vue：捕获 vue 抛出的错误并上报，支持 sourcemap（需上传 sourcemap 文件）

## For Wx

小程序基座的插件较少，但也不太需要那么多，毕竟小程序自己就有一套性能、错误监控；因此，只写了几个常用但小程序没提供的监控插件

- @heimdallr-sdk/wx-dom：监听小程序的点击事件，记录触发的函数名以及附带信息并上报
- @heimdallr-sdk/wx-request：监听小程序发起的请求，包括 request、downloadFile、uploadFile，同样可通过 reportResponds 配置决定是否上报接口返回结果
- @heimdallr-sdk/wx-route：捕获小程序的路由跳转，记录来源、跳转地址与跳转状态（成功与否）并上报

## 自定义插件

插件本质上就是一个个 Plugin 类型对象

基础的 Plugin 类型如下：

```js
export interface BasePluginType {
  name: string;
  monitor: (notify: (collectedData: any) => void) => void;
  transform?: (collectedData: any) => ReportDataType<any>;
}
```

- name: 当前插件名称（反正不能写中文）
- monitor: 插件逻辑的具体实现放在这个函数体中
  - notify 函数负责将数据上报，collectedData 还不是最终上报到服务器的数据，会在基座的 transform 内包装一下再上报
- transform: 可选配置，即接收 notify 中上报的数据，在这里转换一下；最终也是会到基座的 transform 方法内做最后的“包装”

因此，只需要实现并返回一个符合 BasePluginType 的对象，即可接入到 heimdallr-sdk 的基座中作为插件使用
