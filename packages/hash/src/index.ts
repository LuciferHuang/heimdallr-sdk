import {
  BasePluginType,
  EventTypes,
  RouteMsgType,
  ReportDataType,
  RouteTypes,
  RouteDataMsgType,
  BrowserBreadcrumbTypes,
} from '@heimdallr-sdk/types';
import { formatDate, generateUUID } from '@heimdallr-sdk/utils';

const hashPlugin: BasePluginType = {
  name: 'hashPlugin',
  monitor(notify: (data: RouteDataMsgType) => void) {
    window.addEventListener('hashchange', function (e: HashChangeEvent) {
      const { oldURL: from, newURL: to } = e;
      notify({
        from,
        to
      });
    });
  },
  transform(collectedData: RouteDataMsgType): ReportDataType<RouteMsgType> {
    const id = generateUUID();
    // 添加用户行为栈
    const { from, to } = collectedData;
    this.breadcrumb.unshift({
      eventId: id,
      type: BrowserBreadcrumbTypes.ROUTE,
      message: `from "${from}" to "${to}" by hash`
    });
    return {
      id,
      time: formatDate(),
      type: EventTypes.ROUTE,
      data: {
        sub_type: RouteTypes.HASH,
        ...collectedData
      }
    };
  }
};

export default hashPlugin;
