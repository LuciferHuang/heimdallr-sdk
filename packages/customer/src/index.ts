import {
  BasePluginType,
  BrowserBreadcrumbTypes,
  CustomerOptionType,
  CustomerTypes,
  EventTypes,
  IAnyMsgType,
  ReportDataType,
  StoreType
} from '@heimdallr-sdk/types';
import { formatDate, generateUUID, getCookie, getStore, getDeepPropByDot } from '@heimdallr-sdk/utils';

const customerPlugin: BasePluginType = {
  name: 'customerPlugin',
  monitor(notify: (collecteData: IAnyMsgType) => void) {
    const { customers = [] } = this.getOptions();
    window.addEventListener('load', function () {
      // window挂载上报方法
      window['HEIMDALLR_REPORT'] = function (type: string, data: any) {
        notify({
          sub_type: type,
          data
        });
      };
      // 自动上报
      if (!customers.length) {
        return;
      }
      const customerData = {};
      customers.forEach((ele: CustomerOptionType) => {
        const { name, postion } = ele;
        switch (postion) {
          case StoreType.LOCAL:
          case StoreType.SESSION:
            customerData[name] = getStore(postion, name);
            break;
          case StoreType.COOKIE:
            customerData[name] = getCookie(name);
            break;
          case StoreType.GLOBAL:
            customerData[name] = getDeepPropByDot(name, window);
            break;

          default:
            break;
        }
      });
      notify({
        sub_type: CustomerTypes.CUSTOMER,
        ...customerData
      });
    });
  },
  transform(collectedData: IAnyMsgType): ReportDataType<IAnyMsgType> {
    const id = generateUUID();
    // 添加用户行为栈
    const breadData = { ...collectedData };
    delete breadData.sub_type;
    this.breadcrumb.unshift({
      eventId: id,
      type: BrowserBreadcrumbTypes.CUSTOMER,
      message: `User report "${JSON.stringify(collectedData)}"`
    });
    return {
      id,
      time: formatDate(),
      type: EventTypes.CUSTOMER,
      data: collectedData
    };
  }
};

export default customerPlugin;
