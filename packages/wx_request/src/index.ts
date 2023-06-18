import {
  BasePluginType,
  EventTypes,
  MethodTypes,
  ReportDataType,
  HttpCollectDataType,
  HttpCollectType,
  HttpTypes,
  WxBreadcrumbTypes,
  BreadcrumbLevel,
  RequestPluginOptionType
} from '@heimdallr-sdk/types';
import { formatDate, generateUUID, getUrlPath } from '@heimdallr-sdk/utils';
import { WxXhrTypes } from './types';

function wxRequestPlugin(options: RequestPluginOptionType = {}): BasePluginType {
  const { ignoreUrls = [], reportResponds = false } = options;
  return {
    name: 'wxRequestPlugin',
    monitor(notify: (data: HttpCollectDataType) => void) {
      const { initUrl, uploadUrl } = this.context;
      const ignore = [...ignoreUrls, uploadUrl, initUrl].map((url) => getUrlPath(url));
      [WxXhrTypes.REQUEST, WxXhrTypes.DOWNLOADFILE, WxXhrTypes.UPLOADFILE].forEach((hook) => {
        const originRequest = wx[hook];
        Object.defineProperty(wx, hook, {
          writable: true,
          enumerable: true,
          configurable: true,
          value: function (...args: any[]) {
            const options: WechatMiniprogram.RequestOption | WechatMiniprogram.DownloadFileOption | WechatMiniprogram.UploadFileOption =
              args[0];
            const { url } = options;
            const isBlock = ignore.includes(getUrlPath(url));
            if (isBlock) {
              return originRequest.call(this, options);
            }
            let method = '';
            if ((options as WechatMiniprogram.RequestOption).method) {
              method = (options as WechatMiniprogram.RequestOption).method;
            } else if (hook === WxXhrTypes.DOWNLOADFILE) {
              method = MethodTypes.GET;
            } else {
              method = MethodTypes.POST;
            }
            let reqData = undefined;
            switch (hook) {
              case WxXhrTypes.REQUEST:
                reqData = (options as WechatMiniprogram.RequestOption).data;
                break;
              case WxXhrTypes.DOWNLOADFILE:
                reqData = {
                  filePath: (options as WechatMiniprogram.DownloadFileOption).filePath
                };
                break;
              case WxXhrTypes.UPLOADFILE:
                reqData = {
                  filePath: (options as WechatMiniprogram.UploadFileOption).filePath,
                  name: (options as WechatMiniprogram.UploadFileOption).name
                };
                break;
              default:
                break;
            }
            const sTime = Date.now();
            // 收集小程序的请求信息
            const httpCollect: HttpCollectDataType = {
              request: {
                url,
                method,
                data: reqData
              },
              response: {},
              time: sTime
            };
            // 成功回调
            const oriSuccess = options.success;
            const successHandler:
              | WechatMiniprogram.RequestSuccessCallback
              | WechatMiniprogram.DownloadFileSuccessCallback
              | WechatMiniprogram.UploadFileFailCallback = function (res) {
              const eTime = Date.now();
              if (reportResponds) {
                httpCollect.response.data = res.data;
              }
              httpCollect.elapsedTime = eTime - sTime;
              httpCollect.response.status = res.statusCode;
              httpCollect.response.msg = res.errMsg;
              notify(httpCollect);
              if (typeof oriSuccess === 'function') {
                return oriSuccess(res);
              }
            };
            // 失败回调
            const oriFail = options.fail;
            const failHandler:
              | WechatMiniprogram.RequestFailCallback
              | WechatMiniprogram.DownloadFileFailCallback
              | WechatMiniprogram.UploadFileFailCallback = function (err) {
              const eTime = Date.now();
              httpCollect.elapsedTime = eTime - sTime;
              httpCollect.response.msg = err.errMsg;
              httpCollect.response.status = 0;
              notify(httpCollect);
              if (typeof oriFail === 'function') {
                return oriFail(err);
              }
            };
            const actOptions = {
              ...options,
              success: successHandler,
              fail: failHandler
            };
            return originRequest.call(this, actOptions);
          }
        });
      });
    },
    transform(collectedData: HttpCollectDataType): ReportDataType<HttpCollectType> {
      const id = generateUUID();
      const {
        request: { method, url, data: params },
        elapsedTime,
        response: { status }
      } = collectedData;
      this.breadcrumb.unshift({
        eventId: id,
        type: WxBreadcrumbTypes.API,
        level: status === 0 ? BreadcrumbLevel.WARN : BreadcrumbLevel.INFO,
        message: `${method} "${url}" width "${JSON.stringify(params)}" took ${elapsedTime / 1000} seconds`
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
}

export default wxRequestPlugin;
