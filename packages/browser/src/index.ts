import { Breadcrumb, Core } from '@heimdallr-sdk/core';
import { IAnyObject, BrowserOptionsType, BrowserReportType, StoreType } from '@heimdallr-sdk/types';
import { beacon, formatDate, generateUUID, get, getStore, imgRequest, setStore } from '@heimdallr-sdk/utils';
// 基础插件
import jsErrorPlugin from './plugins/jsError';
import promiseErrorPlugin from './plugins/promiseError';
import lifeCyclePlugin from './plugins/lifeCycle';

class Browser extends Core<BrowserOptionsType> {
  private readonly storeAppIdKey: string;
  private readonly breadcrumb: Breadcrumb<BrowserOptionsType>;

  constructor(options: BrowserOptionsType) {
    super(options);
    const { storeAppKey } = this.context;
    this.storeAppIdKey = storeAppKey;
    this.breadcrumb = new Breadcrumb(options);
  }

  initAPP(): void {
    const { initUrl, app } = this.context;
    const id = generateUUID();
    const ctime = formatDate();
    const params = {
      id,
      ...app,
      ctime
    };
    this.report(initUrl, params, BrowserReportType.GET).then((res) => {
      const { data: { id = '' } = {} } = res;
      if (id && getStore(StoreType.LOCAL, this.storeAppIdKey) !== id) {
        setStore(StoreType.LOCAL, this.storeAppIdKey, id);
      }
    });
  }

  report(url: string, data: IAnyObject, type: BrowserReportType = BrowserReportType.BEACON) {
    if (type === BrowserReportType.BEACON && navigator.sendBeacon) {
      beacon(url, data);
      return;
    }
    if (type === BrowserReportType.IMG || !navigator.sendBeacon) {
      imgRequest(url, data);
      return;
    }
    return get(url, data);
  }

  transform(datas: IAnyObject) {
    if (!datas) {
      return null;
    }
    const { userAgent, language } = navigator;
    const { title } = document;
    const { href } = location;
    const id = getStore(StoreType.LOCAL, this.storeAppIdKey);
    return {
      appID: id, // 应用id
      pageTitle: title, // 页面标题
      path: href, // 页面路径
      language, // 站点语言
      userAgent, // 浏览器标识
      ...datas
    };
  }
}

const init = (options: BrowserOptionsType) => {
  const client = new Browser(options);
  const { plugins = [] } = options;
  client.use([jsErrorPlugin, promiseErrorPlugin, lifeCyclePlugin, ...plugins]);
};

export default init;

if (window.__HEIMDALLR_OPTIONS__) {
  init(window.__HEIMDALLR_OPTIONS__);
}
