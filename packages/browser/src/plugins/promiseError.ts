import {
  BasePluginType,
  BreadcrumbLevel,
  BrowserBreadcrumbTypes,
  BrowserErrorTypes,
  ConsoleTypes,
  EventTypes,
  ReportDataType
} from '@heimdallr-sdk/types';
import { generateUUID, formatDate } from '@heimdallr-sdk/utils';
import { PromiseErrorType } from '../types';

interface CollectedType {
  category: EventTypes;
  data: PromiseRejectionEvent;
}

const PromiseErrorPlugin: BasePluginType = {
  name: BrowserErrorTypes.UNHANDLEDREJECTION,
  monitor(notify: (data: CollectedType) => void) {
    window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
      e.preventDefault();
      this.log(e, ConsoleTypes.ERROR);
      notify({
        category: EventTypes.ERROR,
        data: e
      });
    });
  },
  transform(collectedData: CollectedType): ReportDataType<PromiseErrorType> {
    const {
      category,
      data: { reason }
    } = collectedData;
    let message: string;
    if (typeof reason === 'string') {
      message = reason;
    } else if (typeof reason === 'object' && reason.stack) {
      message = reason.stack;
    }
    const id = generateUUID();
    this.breadcrumb.unshift({
      eventId: id,
      type: BrowserBreadcrumbTypes.UNHANDLEDREJECTION,
      level: BreadcrumbLevel.ERROR,
      message
    });
    const breadcrumb = this.breadcrumb.getStack();
    return {
      id,
      time: formatDate(),
      type: category,
      breadcrumb,
      data: {
        sub_type: BrowserErrorTypes.UNHANDLEDREJECTION,
        message
      }
    };
  }
};

export default PromiseErrorPlugin;
