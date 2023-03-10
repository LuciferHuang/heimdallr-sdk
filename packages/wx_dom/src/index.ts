import {
  BasePluginType,
  EventTypes,
  ReportDataType,
  WxDomMsgType,
  WxDomDataType,
  WxBreadcrumbTypes
} from '@heimdallr-sdk/types';
import { formatDate, generateUUID, replaceOld } from '@heimdallr-sdk/utils';

const wxDomPlugin: BasePluginType = {
  name: 'wxDomPlugin',
  monitor(notify: (data: WxDomDataType) => void) {
    const originPage = Page;
    Page = function (options) {
      if (options) {
        Object.keys(options).forEach((m) => {
          if ('function' !== typeof options[m]) {
            return;
          }
          replaceOld(
            options,
            m,
            function (originMethod: (args: any) => void) {
              return function (...args: any): void {
                const e = args[0];
                // 判断是否是事件
                if (e && e.type && e.currentTarget) {
                  const { type, detail, currentTarget } = e;
                  notify({
                    method: m,
                    sub_type: type,
                    detail,
                    currentTarget
                  });
                }
                return originMethod.apply(this, args);
              };
            },
            true
          );
        });
      }
      return originPage(options);
    };
  },
  transform(collectedData: WxDomDataType): ReportDataType<WxDomMsgType> {
    const id = generateUUID();
    this.breadcrumb.unshift({
      eventId: id,
      type: WxBreadcrumbTypes.CLICK,
      message: `Invoke "${collectedData.method}"`
    });
    return {
      id,
      time: formatDate(),
      type: EventTypes.DOM,
      data: {
        ...collectedData
      }
    };
  }
};

export default wxDomPlugin;
