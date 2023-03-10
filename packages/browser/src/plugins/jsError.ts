import {
  BasePluginType,
  BrowserErrorTypes,
  EventTypes,
  CodeErrorType,
  ReportDataType,
  ResourceErrorType,
  BrowserBreadcrumbTypes,
  ConsoleTypes,
  BreadcrumbLevel
} from '@heimdallr-sdk/types';
import { generateUUID, formatDate } from '@heimdallr-sdk/utils';

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
  name: 'jsErrorPlugin',
  monitor(notify: (data: CollectedType) => void) {
    window.addEventListener(
      'error',
      (e: Event) => {
        e.preventDefault();
        this.log(e, ConsoleTypes.ERROR);
        notify({
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
        level: BreadcrumbLevel.FATAL,
        message: `Unable to load "${resourceData.href}"`
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
      level: BreadcrumbLevel.ERROR,
      message
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
