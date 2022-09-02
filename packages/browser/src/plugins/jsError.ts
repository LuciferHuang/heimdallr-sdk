import {
  BasePluginType,
  BrowserErrorTypes,
  EventTypes,
  CodeErrorType,
  ReportDataType,
  ResourceErrorType,
  BrowserBreadcrumbTypes
} from '@heimdallr-sdk/types';
import { generateUUID, formatDate } from '@heimdallr-sdk/utils';

const PLUGIN_NAME = 'jsErrorPlugin';
const TAG = '[@heimdallr-sdk/jsError]：';

interface CollectedType {
  category: EventTypes;
  data: Event;
}

interface ResourceTarget {
  src?: string;
  href?: string;
  localName?: string;
}

const errorPlugin: BasePluginType = {
  name: PLUGIN_NAME,
  monitor(notify: (eventName: string, data: CollectedType) => void) {
    window.addEventListener(
      'error',
      (e: Event) => {
        e.preventDefault();
        console.error(TAG, e);
        notify(PLUGIN_NAME, {
          category: EventTypes.ERROR,
          data: e
        });
      },
      true
    );
  },
  transform(collectedData: CollectedType): ReportDataType<ResourceErrorType | CodeErrorType> {
    const { category, data } = collectedData;
    const { localName, src, href } = (data.target as ResourceTarget) || {};
    const id = generateUUID();
    const time = formatDate();
    if (localName) {
      // 资源加载错误
      const resourceData = {
        source_type: localName,
        href: src || href
      };
      // 上报用户行为栈
      this.breadcrumb.unshift({
        eventId: id,
        type: BrowserBreadcrumbTypes.RESOURCE,
        data: resourceData
      });
      const breadcrumb = this.breadcrumb.getStack();
      return {
        id,
        time,
        type: category,
        breadcrumb,
        data: {
          sub_type: BrowserErrorTypes.RESOURCEERROR,
          ...resourceData
        }
      };
    }
    // 代码错误
    const { message, lineno, colno, filename } = data as ErrorEvent;
    // 上报用户行为栈
    this.breadcrumb.unshift({
      eventId: id,
      type: BrowserBreadcrumbTypes.CODE_ERROR,
      data: data
    });
    const breadcrumb = this.breadcrumb.getStack();
    return {
      id,
      time,
      type: category,
      breadcrumb,
      data: {
        sub_type: BrowserErrorTypes.CODEERROR,
        message,
        lineno,
        colno,
        filename
      }
    };
  }
};

export default errorPlugin;
