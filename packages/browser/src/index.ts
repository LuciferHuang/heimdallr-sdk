import { Breadcrumb, Core } from '@heimdallr-sdk/core';
import { IAnyObject, BrowserOptionsType, BrowserReportType, StoreType, StoreKeyType, ReportPayloadDataType } from '@heimdallr-sdk/types';
import { beacon, formatDate, generateUUID, get, getStore, imgRequest, setStore } from '@heimdallr-sdk/utils';
// 基础插件
import jsErrorPlugin from './plugins/jsError';
import promiseErrorPlugin from './plugins/promiseError';
import lifeCyclePlugin from './plugins/lifeCycle';

class Browser extends Core<BrowserOptionsType> {
  private readonly breadcrumb: Breadcrumb<BrowserOptionsType>;

  constructor(options: BrowserOptionsType) {
    super(options);
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
      if (id && getStore(StoreType.LOCAL, StoreKeyType.APP) !== id) {
        setStore(StoreType.LOCAL, StoreKeyType.APP, id);
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

  transform(datas: IAnyObject): ReportPayloadDataType {
    if (!datas) {
      return null;
    }
    const { userAgent, language } = navigator;
    const { title } = document;
    const { href } = location;
    const appID = getStore(StoreType.LOCAL, StoreKeyType.APP);
    const sessionID = getStore(StoreType.LOCAL, StoreKeyType.SESSION);
    return {
      app_id: appID, // 应用id
      session_id: sessionID,
      page_title: title, // 页面标题
      path: href, // 页面路径
      language, // 站点语言
      user_agent: userAgent, // 浏览器标识
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
