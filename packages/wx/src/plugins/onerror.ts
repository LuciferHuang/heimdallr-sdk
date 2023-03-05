import { generateUUID, formatDate, replaceOld } from '@heimdallr-sdk/utils';
import { BasePluginType, EventTypes, ConsoleTypes, ReportDataType, voidFun } from '@heimdallr-sdk/types';
import { WxCollectType, WxErrorType } from '../types';

const errorPlugin: BasePluginType = {
  name: 'errorPlugin',
  monitor(notify: (data: WxCollectType) => void) {
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
            notify({
              category: EventTypes.ERROR,
              data: { error }
            });
          };
        },
        true
      );
      return oriApp(appOptions);
    };
  },
  transform(collectedData: WxCollectType): ReportDataType<WxErrorType> {
    const { category, data } = collectedData;
    const { error } = data;
    return {
      id: generateUUID(),
      time: formatDate(),
      type: category,
      data: {
        sub_type: category,
        error
      }
    };
  }
};

export default errorPlugin;
