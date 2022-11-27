import { BasePluginType, BrowserBreadcrumbTypes, CustomerOptionType, EventTypes, LifecycleDataType, LifeCycleMsgType, PageLifeType, ReportDataType, StoreKeyType, StoreType } from '@heimdallr-sdk/types';
import { formatDate, generateUUID, getCookie, getStore, setStore } from '@heimdallr-sdk/utils';

const PLUGIN_NAME = 'lifeCyclePlugin';

function getStoreUserId(userIdentify: CustomerOptionType) {
  const { name = '', postion = '' } = userIdentify;
  switch (postion) {
    case StoreType.LOCAL:
    case StoreType.SESSION:
      return getStore(postion, name);
    case StoreType.COOKIE:
      return getCookie(name);
    case StoreType.GLOBAL:
      return window[name];
    default:
      break;
  }
  return '';
}

const LifeCyclePlugin: BasePluginType = {
  name: PLUGIN_NAME,
  monitor(notify: (eventName: string, data: LifecycleDataType) => void) {
    const { userIdentify = {} } = this.getOptions();
    window.addEventListener('load', function () {
      const sessionId = generateUUID();
      setStore(StoreType.LOCAL, StoreKeyType.SESSION, sessionId);
      notify(PLUGIN_NAME, {
        type: PageLifeType.LOAD,
        session_id: sessionId,
        user_id: getStoreUserId(userIdentify),
        href: this.location.href
      });
    });
    window.addEventListener('unload', function () {
      notify(PLUGIN_NAME, {
        type: PageLifeType.UNLOAD,
        session_id: getStore(StoreType.LOCAL, StoreKeyType.SESSION),
        user_id: getStoreUserId(userIdentify),
        href: this.location.href
      });
    });
  },
  transform(collectedData: LifecycleDataType): ReportDataType<LifeCycleMsgType> {
    const id = generateUUID();
    // 添加用户行为栈
    this.breadcrumb.unshift({
      eventId: id,
      type: BrowserBreadcrumbTypes.LIFECYCLE,
      data: collectedData
    });
    // 上报数据
    const subType = collectedData.type;
    delete collectedData.type;
    return {
      id,
      time: formatDate(),
      type: EventTypes.LIFECYCLE,
      data: {
        sub_type: subType,
        ...collectedData
      }
    };
  }
};

export default LifeCyclePlugin;
