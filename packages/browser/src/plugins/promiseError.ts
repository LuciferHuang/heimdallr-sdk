import {
  BasePluginType,
  BrowserBreadcrumbTypes,
  BrowserErrorTypes,
  EventTypes,
  PromiseErrorType,
  ReportDataType
} from '@heimdallr-sdk/types';
import { generateUUID, formatDate } from '@heimdallr-sdk/utils';

const PLUGIN_NAME = BrowserErrorTypes.UNHANDLEDREJECTION;
const TAG = '[@heimdallr-sdk/promiseError]：';

interface CollectedType {
  category: EventTypes;
  data: PromiseRejectionEvent;
}

const PromiseErrorPlugin: BasePluginType = {
  name: PLUGIN_NAME,
  monitor(notify: (eventName: BrowserErrorTypes, data: CollectedType) => void) {
    window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
      e.preventDefault();
      console.error(TAG, e);
      notify(PLUGIN_NAME, {
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
    // 上报用户行为栈
    this.breadcrumb.unshift({
      eventId: id,
      type: BrowserBreadcrumbTypes.UNHANDLEDREJECTION,
      data: { message }
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
