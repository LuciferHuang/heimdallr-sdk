import {
  BasePluginType,
  BrowserBreadcrumbTypes,
  EventTypes,
  HttpCollectDataType,
  HttpCollectType,
  HttpTypes,
  MethodTypes,
  ReportDataType,
  voidFun
} from '@heimdallr-sdk/types';
import { formatDate, generateUUID, getUrlPath, replaceOld } from '@heimdallr-sdk/utils';

const PLUGIN_NAME = 'fetchPlugin';

const fetchPlugin: BasePluginType = {
  name: PLUGIN_NAME,
  monitor(notify: (eventName: string, data: HttpCollectDataType) => void) {
    const { context } = this;
    const { ignoreUrls = [] } = context;
    replaceOld(window, HttpTypes.FETCH, (originalFetch: voidFun) => {
      return function (url: string, config: Partial<Request> = {}): void {
        const sTime = Date.now();
        const method = (config && (config.method as MethodTypes)) || MethodTypes.GET;
        const httpCollect: HttpCollectDataType = {
          request: {
            url,
            method,
            data: config && config.body
          },
          time: sTime,
          response: {}
        };
        const headers = new Headers(config.headers || {});
        Object.assign(headers, {
          setRequestHeader: headers.set
        });
        config = {
          ...config,
          headers
        };
        const isBlock = ignoreUrls.includes(getUrlPath(url));
        return originalFetch.apply(window, [url, config]).then(
          (res: Response) => {
            const resClone = res.clone();
            const eTime = Date.now();
            httpCollect.elapsedTime = eTime - sTime;
            httpCollect.response.status = resClone.status;
            resClone.text().then((data) => {
              if (isBlock) return;
              httpCollect.response.data = data;
              notify(PLUGIN_NAME, httpCollect);
            });
            return res;
          },
          (err: Error) => {
            if (isBlock) return;
            const eTime = Date.now();
            httpCollect.elapsedTime = eTime - sTime;
            httpCollect.response.status = 0;
            notify(PLUGIN_NAME, httpCollect);
            throw err;
          }
        );
      };
    });
  },
  transform(collectedData: HttpCollectDataType): ReportDataType<HttpCollectType> {
    // 添加用户行为栈
    const id = generateUUID();
    this.breadcrumb.unshift({
      eventId: id,
      type: BrowserBreadcrumbTypes.FETCH,
      data: collectedData,
    });
    return {
      id,
      time: formatDate(),
      type: EventTypes.API,
      data: {
        sub_type: HttpTypes.FETCH,
        ...collectedData
      }
    };
  }
};

export default fetchPlugin;
