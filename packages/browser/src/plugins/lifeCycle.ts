import { BasePluginType, BrowserBreadcrumbTypes, LifecycleDataType, PageLifeType } from '@heimdallr-sdk/types';
import { generateUUID } from '@heimdallr-sdk/utils';

const PLUGIN_NAME = 'lifeCyclePlugin';

const LifeCyclePlugin: BasePluginType = {
  name: PLUGIN_NAME,
  monitor(notify: (eventName: string, data: LifecycleDataType) => void) {
    window.addEventListener('load', function () {
      notify(PLUGIN_NAME, {
        type: PageLifeType.LOAD,
        href: this.location.href
      });
    });
    window.addEventListener('unload', function () {
      notify(PLUGIN_NAME, {
        type: PageLifeType.UNLOAD,
        href: this.location.href
      });
    });
  },
  transform(collectedData: LifecycleDataType) {
    const id = generateUUID();
    // 添加用户行为栈
    this.breadcrumb.unshift({
      eventId: id,
      type: BrowserBreadcrumbTypes.LIFECYCLE,
      data: collectedData
    });
    // 不上报
    return null;
  }
};

export default LifeCyclePlugin;
