import {
  BasePluginType,
  EventTypes,
  RouteMsgType,
  ReportDataType,
  RouteTypes,
  voidFun,
  BrowserBreadcrumbTypes,
  RouteDataMsgType
} from '@heimdallr-sdk/types';
import { formatDate, generateUUID, replaceOld } from '@heimdallr-sdk/utils';
import { supportsHistory } from './utils';

const historyPlugin: BasePluginType = {
  name: 'historyPlugin',
  monitor(notify: (data: RouteDataMsgType) => void) {
    let lastHref = '';
    if (!supportsHistory()) return;
    const originOnpopstate = window.onpopstate;
    window.onpopstate = function (this: WindowEventHandlers, ...args: any[]) {
      const to = document.location.href;
      const from = lastHref;
      lastHref = to;
      notify({
        from,
        to
      });
      originOnpopstate && originOnpopstate.apply(this, args);
    };
    function historyReplaceFn(originalHistoryFn: voidFun): voidFun {
      return function (this: History, ...args: any[]): void {
        const url = args.length > 2 ? args[2] : undefined;
        if (url) {
          const from = lastHref;
          const to = String(url);
          lastHref = to;
          notify({
            from,
            to
          });
        }
        return originalHistoryFn.apply(this, args);
      };
    }
    // 人为调用，不触发onpopstate
    replaceOld(window.history, 'pushState', historyReplaceFn);
    replaceOld(window.history, 'replaceState', historyReplaceFn);
  },
  transform(collectedData: RouteDataMsgType): ReportDataType<RouteMsgType> {
    const id = generateUUID();
    // 添加用户行为栈
    const { from, to } = collectedData;
    if (from === to) {
      return;
    }
    this.breadcrumb.unshift({
      eventId: id,
      type: BrowserBreadcrumbTypes.ROUTE,
      message: `from "${from}" to "${to}" by history`
    });
    return {
      id,
      time: formatDate(),
      type: EventTypes.ROUTE,
      data: {
        sub_type: RouteTypes.HISTORY,
        ...collectedData
      }
    };
  }
};

export default historyPlugin;
