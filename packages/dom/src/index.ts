import { BasePluginType, BrowserBreadcrumbTypes, DomTypes, EventTypes, ReportDataType } from '@heimdallr-sdk/types';
import { formatDate, generateUUID, throttle } from '@heimdallr-sdk/utils';
import { DomMsgType, DomOptions } from './types';
import { htmlElementAsString } from './utils';

export interface DomCollectedType {
  category: DomTypes;
  data: Document;
}

function domPlugin(options: DomOptions = {}): BasePluginType {
  return {
    name: 'domPlugin',
    monitor(notify: (collecteData: DomCollectedType) => void) {
      const { throttleDelayTime = 300 } = options;
      const clickThrottle = throttle(notify, throttleDelayTime);
      document.addEventListener(
        'click',
        function () {
          clickThrottle({
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
        message: `Click ${htmlString}`
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
}

export default domPlugin;
