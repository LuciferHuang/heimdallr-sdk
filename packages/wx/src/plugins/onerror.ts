import { generateUUID, formatDate, replaceOld } from '@heimdallr-sdk/utils';
import { BasePluginType, EventTypes, ConsoleTypes, ReportDataType, voidFun, WxBreadcrumbTypes, BreadcrumbLevel } from '@heimdallr-sdk/types';
import { WxErrorDataType, WxErrorMsgType, WxErrorTypes } from '../types';

const errorPlugin: BasePluginType = {
  name: 'errorPlugin',
  monitor(notify: (data: WxErrorDataType) => void) {
    const oriApp = App;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const client = this;
    App = function (appOptions: any) {
      replaceOld(
        appOptions,
        'onError',
        function (originMethod: voidFun) {
          return function (...args): void {
            if (originMethod) {
              originMethod.apply(this, args);
            }
            const [error] = args;
            client.log(error, ConsoleTypes.ERROR)
            notify({ error });
          };
        },
        true
      );
      return oriApp(appOptions);
    };
  },
  transform(collectedData: WxErrorDataType): ReportDataType<WxErrorMsgType> {
    const { error } = collectedData;
    const id = generateUUID();
    this.breadcrumb.unshift({
      eventId: id,
      type: WxBreadcrumbTypes.ERROR,
      level: BreadcrumbLevel.ERROR,
      data: { error }
    });
    const breadcrumb = this.breadcrumb.getStack();
    return {
      id,
      time: formatDate(),
      type: EventTypes.ERROR,
      breadcrumb,
      data: {
        sub_type: WxErrorTypes.UNCAUGHTEXCEPTION,
        error
      }
    };
  }
};

export default errorPlugin;
