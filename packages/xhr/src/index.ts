import {
  BasePluginType,
  BrowserBreadcrumbTypes,
  EventTypes,
  HttpCollectDataType,
  HttpCollectType,
  HttpTypes,
  IAnyObject,
  ReportDataType,
  voidFun
} from '@heimdallr-sdk/types';
import { formatDate, generateUUID, getUrlPath, replaceOld } from '@heimdallr-sdk/utils';

const PLUGIN_NAME = 'XHRPlugin';

interface XMLHttp extends IAnyObject {
  httpCollect: HttpCollectDataType;
}

const XHRPlugin: BasePluginType = {
  name: PLUGIN_NAME,
  monitor(notify: (eventName: string, data: HttpCollectDataType) => void) {
    const { context } = this;
    const { ignoreUrls = [] } = context;
    const originalXhrProto = XMLHttpRequest.prototype;
    replaceOld(originalXhrProto, 'open', (originalOpen: voidFun): voidFun => {
      return function (this: XMLHttp, ...args: any[]): void {
        this.httpCollect = {
          request: {
            method: args[0] ? args[0].toUpperCase() : args[0],
            url: args[1]
          },
          response: {},
          time: Date.now()
        };
        originalOpen.apply(this, args);
      };
    });
    replaceOld(originalXhrProto, 'send', (originalSend: voidFun): voidFun => {
      return function (this: IAnyObject, ...args: any[]): void {
        const { request } = this.httpCollect;
        const { url } = request;
        this.addEventListener('loadend', function (this: XMLHttp) {
          const isBlock = ignoreUrls.includes(getUrlPath(url));
          if (isBlock) return;
          const { responseType, response, status } = this;
          request.data = args[0];
          const eTime = Date.now();
          if (['', 'json', 'text'].indexOf(responseType) !== -1) {
            this.httpCollect.response.data = typeof response === 'object' ? JSON.stringify(response) : response;
          }
          this.httpCollect.response.status = status;
          this.httpCollect.elapsedTime = eTime - this.httpCollect.time;
          notify(PLUGIN_NAME, this.httpCollect);
        });
        originalSend.apply(this, args);
      };
    });
  },
  transform(collectedData: HttpCollectDataType): ReportDataType<HttpCollectType> {
    // 添加用户行为栈
    const id = generateUUID();
    this.breadcrumb.unshift({
      eventId: id,
      type: BrowserBreadcrumbTypes.XHR,
      data: collectedData
    });
    return {
      id,
      time: formatDate(),
      type: EventTypes.API,
      data: {
        sub_type: HttpTypes.XHR,
        ...collectedData
      }
    };
  }
};

export default XHRPlugin;
