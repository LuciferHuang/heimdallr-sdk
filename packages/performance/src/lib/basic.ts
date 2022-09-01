interface BasicType {
  dnsSearch: number; // DNS 解析耗时
  tcpConnect: number; // TCP 连接耗时
  sslConnect: number; // SSL安全连接耗时
  request: number; // TTFB 网络请求耗时
  response: number; // 数据传输耗时
  parseDomTree: number; // DOM 解析耗时
  resource: number; // 资源加载耗时
  domReady: number; // DOM Ready
  httpHead: number; // http 头部大小
  interactive: number; // 首次可交互时间
  complete: number; // 页面完全加载
  redirect: number; // 重定向次数
  redirectTime: number; // 重定向耗时
  duration: number; // 资源请求的总耗时 responseEnd-startTime
  fp: number; // 渲染出第一个像素点，白屏时间
  fcp: number; // 渲染出第一个内容，首屏结束时间
}

export default function getBasic(): BasicType {
  const {
    domainLookupEnd,
    domainLookupStart,
    connectEnd,
    connectStart,
    secureConnectionStart,
    loadEventStart,
    domInteractive,
    domContentLoadedEventEnd,
    duration,
    responseStart,
    requestStart,
    responseEnd,
    fetchStart,
    transferSize,
    encodedBodySize,
    redirectEnd,
    redirectStart,
    redirectCount
  } = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const { startTime: fp } = performance.getEntriesByType('paint').find(({ name }) => name === 'first-paint') || {};
  const { startTime: fcp } = performance.getEntriesByType('paint').find(({ name }) => name === 'first-contentful-paint') || {};
  return {
    dnsSearch: domainLookupEnd - domainLookupStart,
    tcpConnect: connectEnd - connectStart,
    sslConnect: connectEnd - secureConnectionStart,
    request: responseStart - requestStart,
    response: responseEnd - responseStart,
    parseDomTree: domInteractive - responseEnd,
    resource: loadEventStart - domContentLoadedEventEnd,
    domReady: domContentLoadedEventEnd - fetchStart,
    interactive: domInteractive - fetchStart,
    complete: loadEventStart - fetchStart,
    httpHead: transferSize - encodedBodySize,
    redirect: redirectCount,
    redirectTime: redirectEnd - redirectStart,
    duration,
    fp,
    fcp
  };
}
