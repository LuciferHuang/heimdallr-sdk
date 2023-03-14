import {
  BasePluginType,
  BreadcrumbLevel,
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

const fetchPlugin: BasePluginType = {
  name: 'fetchPlugin',
  monitor(notify: (data: HttpCollectDataType) => void) {
    const { ignoreUrls = [], reportResponds = false  } = this.getOptions();
    const { initUrl, uploadUrl } = this.context;
    const ignore = [...ignoreUrls, uploadUrl, initUrl].map((url) => getUrlPath(url));
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
        const isBlock = ignore.includes(getUrlPath(url));
        return originalFetch.apply(window, [url, config]).then(
          (res: Response) => {
            const resClone = res.clone();
            const eTime = Date.now();
            httpCollect.elapsedTime = eTime - sTime;
            httpCollect.response.status = resClone.status;
            resClone.text().then((data) => {
              if (isBlock) return;
              if (reportResponds) {
                httpCollect.response.data = data;
              }
              notify(httpCollect);
            });
            return res;
          },
          (err: Error) => {
            if (isBlock) return;
            const eTime = Date.now();
            httpCollect.elapsedTime = eTime - sTime;
            httpCollect.response.status = 0;
            notify(httpCollect);
            throw err;
          }
        );
      };
    });
  },
  transform(collectedData: HttpCollectDataType): ReportDataType<HttpCollectType> {
    const id = generateUUID();
    // 添加用户行为栈
    const {
      request: { method, url, data: params },
      elapsedTime = 0,
      response: { status }
    } = collectedData;
    this.breadcrumb.unshift({
      eventId: id,
      type: BrowserBreadcrumbTypes.FETCH,
      level: status != 200 ? BreadcrumbLevel.WARN : BreadcrumbLevel.INFO,
      message: `${method} "${url}" width "${JSON.stringify(params)}" took ${elapsedTime / 1000} seconds`
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
