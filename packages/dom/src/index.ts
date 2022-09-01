import { BasePluginType, BrowserBreadcrumbTypes, DomMsgType, DomTypes, EventTypes, ReportDataType } from '@heimdallr-sdk/types';
import { formatDate, generateUUID, htmlElementAsString, throttle } from '@heimdallr-sdk/utils';

const PLUGIN_NAME = 'domPlugin';

export interface DomCollectedType {
  category: DomTypes;
  data: Document;
}

const domPlugin: BasePluginType = {
  name: PLUGIN_NAME,
  monitor(notify: (pluginName: string, collecteData: DomCollectedType) => void) {
    const { throttleDelayTime = 2000 } = this.options;
    const clickThrottle = throttle(notify, throttleDelayTime);
    document.addEventListener(
      'click',
      function () {
        clickThrottle(PLUGIN_NAME, {
          category: DomTypes.CLICK,
          data: this
        });
      },
      true
    );
  },
  transform(collectedData: DomCollectedType): ReportDataType<DomMsgType> {
    const { category, data } = collectedData;
    const htmlString = htmlElementAsString(data.activeElement as HTMLElement);
    if (!htmlString) {
      return null;
    }
    // 添加用户行为栈
    const id = generateUUID();
    this.breadcrumb.unshift({
      eventId: id,
      type: BrowserBreadcrumbTypes.CLICK,
      data: {
        ele: htmlString
      }
    });
    return {
      id,
      time: formatDate(),
      type: EventTypes.DOM,
      data: {
        sub_type: category,
        ele: htmlString
      }
    };
  }
};

export default domPlugin;
