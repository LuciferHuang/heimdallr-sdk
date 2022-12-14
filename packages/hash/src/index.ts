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

const PLUGIN_NAME = 'hashPlugin';

const hashPlugin: BasePluginType = {
  name: PLUGIN_NAME,
  monitor(notify: (pluginName: string, data: RouteDataMsgType) => void) {
    window.addEventListener('hashchange', function (e: HashChangeEvent) {
      const { oldURL: from, newURL: to } = e;
      notify(PLUGIN_NAME, {
        from,
        to
      });
    });
  },
  transform(collectedData: RouteDataMsgType): ReportDataType<RouteMsgType> {
    // 添加用户行为栈
    const id = generateUUID();
    this.breadcrumb.unshift({
      eventId: id,
      type: BrowserBreadcrumbTypes.ROUTE,
      data: collectedData,
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
