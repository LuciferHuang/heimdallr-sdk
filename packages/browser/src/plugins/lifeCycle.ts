import {
  BasePluginType,
  BrowserBreadcrumbTypes,
  CustomerOptionType,
  EventTypes,
  PageLifeType,
  ReportDataType,
  StoreType
} from '@heimdallr-sdk/types';
import { formatDate, generateUUID, getCookie, getStore, getDeepPropByDot } from '@heimdallr-sdk/utils';
import { LifecycleDataType, LifeCycleMsgType } from '../types';

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
    this.sessionID = generateUUID();
    window.addEventListener('load', () => {
      const user_id = getStoreUserId(userIdentify) || '';
      if (userPath && userPosi && !user_id) {
        this.log(`${userPath} does not exist on ${userPosi}`);
      }
      notify({
        type: PageLifeType.LOAD,
        session_id: this.sessionID,
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
        session_id: this.sessionID,
        user_id,
        href: location.href
      });
    });
  },
  transform(collectedData: LifecycleDataType): ReportDataType<LifeCycleMsgType> {
    const id = generateUUID();
    // 添加用户行为栈
    const { type, href } = collectedData;
    let action = '';
    switch (type) {
      case PageLifeType.LOAD:
        action = 'Enter';
        break;
      case PageLifeType.UNLOAD:
        action = 'Leave';
        break;
      default:
        break;
    }
    this.breadcrumb.unshift({
      eventId: id,
      type: BrowserBreadcrumbTypes.LIFECYCLE,
      message: `${action || type} "${href}"`
    });
    // 上报数据
    const subType = type;
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
