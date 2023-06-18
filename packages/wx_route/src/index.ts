import { BasePluginType, EventTypes, ReportDataType, WxBreadcrumbTypes, BreadcrumbLevel } from '@heimdallr-sdk/types';
import { formatDate, generateUUID } from '@heimdallr-sdk/utils';
import { WxRouteDataType, WxRouteEvents, WxRouteMsgType } from './types';
import { getCurrentRoute, getNavigateBackTargetUrl } from './utils';

function wxRoutePlugin(): BasePluginType {
  return {
    name: 'wxRoutePlugin',
    monitor(notify: (data: WxRouteDataType) => void) {
      [
        WxRouteEvents.SWITCHTAB,
        WxRouteEvents.RELAUNCH,
        WxRouteEvents.REDIRECTTO,
        WxRouteEvents.NAVIGATETO,
        WxRouteEvents.NAVIGATEBACK,
        WxRouteEvents.NAVIGATETOMINIPROGRAM
      ].forEach((method) => {
        const originMethod = wx[method] as Function;
        Object.defineProperty(wx, method, {
          writable: true,
          enumerable: true,
          configurable: true,
          value: function (
            options:
              | WechatMiniprogram.SwitchTabOption
              | WechatMiniprogram.ReLaunchOption
              | WechatMiniprogram.RedirectToOption
              | WechatMiniprogram.NavigateToOption
              | WechatMiniprogram.NavigateBackOption
              | WechatMiniprogram.NavigateToMiniProgramOption
          ) {
            let toUrl = '';
            if (method === WxRouteEvents.NAVIGATEBACK) {
              toUrl = getNavigateBackTargetUrl((options as WechatMiniprogram.NavigateBackOption)?.delta);
            } else {
              toUrl = (options as WechatMiniprogram.SwitchTabOption).url;
            }
            const data = {
              from: getCurrentRoute(),
              to: toUrl,
              sub_type: method
            };
            notify(data);
            if (typeof options.complete === 'function' || typeof options.success === 'function' || typeof options.fail === 'function') {
              const oriFail = options.fail;
              const failHandler:
                | WechatMiniprogram.SwitchTabFailCallback
                | WechatMiniprogram.ReLaunchFailCallback
                | WechatMiniprogram.RedirectToFailCallback
                | WechatMiniprogram.NavigateToFailCallback
                | WechatMiniprogram.NavigateBackFailCallback = function (res) {
                notify({
                  ...data,
                  isFail: true,
                  message: res.errMsg
                });
                if (typeof oriFail === 'function') {
                  return oriFail(res);
                }
              };
              options.fail = failHandler;
            }
            return originMethod.call(this, options);
          }
        });
      });
    },
    transform(collectedData: WxRouteDataType): ReportDataType<WxRouteMsgType> {
      const id = generateUUID();
      const { to, from, sub_type, message: errMsg } = collectedData;
      this.breadcrumb.unshift({
        eventId: id,
        type: WxBreadcrumbTypes.ROUTE,
        level: errMsg ? BreadcrumbLevel.WARN : BreadcrumbLevel.INFO,
        message: `from "${from}" to "${to}" by "${sub_type}"`
      });
      return {
        id,
        time: formatDate(),
        type: EventTypes.ROUTE,
        data: {
          ...collectedData
        }
      };
    }
  };
}

export default wxRoutePlugin;
