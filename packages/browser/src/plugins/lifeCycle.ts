import {
  BasePluginType,
  BrowserBreadcrumbTypes,
  CustomerOptionType,
  EventTypes,
  LifecycleDataType,
  LifeCycleMsgType,
  PageLifeType,
  ReportDataType,
  StoreKeyType,
  StoreType
} from '@heimdallr-sdk/types';
import { formatDate, generateUUID, getCookie, getStore, setStore, getDeepPropByDot } from '@heimdallr-sdk/utils';

function getStoreUserId(userIdentify: CustomerOptionType) {
  const { name = '', postion = '' } = userIdentify;
  switch (postion) {
    case StoreType.LOCAL:
    case StoreType.SESSION:
      return getStore(postion, name);
    case StoreType.COOKIE:
      return getCookie(name);
    case StoreType.GLOBAL:
      return getDeepPropByDot(name, window);
    default:
      break;
  }
  return '';
}

const LifeCyclePlugin: BasePluginType = {
  name: 'lifeCyclePlugin',
  monitor(notify: (data: LifecycleDataType) => void) {
    const { userIdentify = {} } = this.getOptions();
    const { name: userPath, postion: userPosi } = userIdentify;
    window.addEventListener('load', () => {
      const sessionId = generateUUID();
      setStore(StoreType.LOCAL, StoreKeyType.SESSION, sessionId);
      const user_id = getStoreUserId(userIdentify) || '';
      if (userPath && userPosi && !user_id) {
        this.log(`${userPath} does not exist on ${userPosi}`);
      }
      notify({
        type: PageLifeType.LOAD,
        session_id: sessionId,
        user_id,
        href: location.href
      });
    });
    window.addEventListener('unload', () => {
      const user_id = getStoreUserId(userIdentify) || '';
      if (userPath && userPosi && !user_id) {
        this.log(`${userPath} does not exist on ${userPosi}`);
      }
      notify({
        type: PageLifeType.UNLOAD,
        session_id: getStore(StoreType.LOCAL, StoreKeyType.SESSION),
        user_id,
        href: location.href
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
