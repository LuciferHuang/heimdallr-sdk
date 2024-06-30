import { BasePluginType, BrowserBreadcrumbTypes, DomTypes, EventTypes, ReportDataType } from '@heimdallr-sdk/types';
import { generateUUID, throttle } from '@heimdallr-sdk/utils';
import { DomMsgType, DomOptions } from './types';
import { htmlElementAsString } from './lib';

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
      const lid = generateUUID();
      this.breadcrumb.unshift({
        lid,
        bt: BrowserBreadcrumbTypes.CLICK,
        msg: `Click ${htmlString}`,
        t: this.getTime()
      });
      return {
        lid,
        t: this.getTime(),
        e: EventTypes.DOM,
        dat: {
          st: category,
          ele: htmlString
        }
      };
    }
  };
}

export default domPlugin;
