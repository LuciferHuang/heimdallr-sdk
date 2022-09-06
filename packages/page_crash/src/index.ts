import { BasePluginType, BrowserErrorTypes, StoreType } from '@heimdallr-sdk/types';
import { generateUUID, getStore } from '@heimdallr-sdk/utils';

// 脱离 发布订阅 方式，走 serviceWorker 方式

const PLUGIN_NAME = BrowserErrorTypes.PAGECRASH;

const Tag = `[@frontendmonitor-${PLUGIN_NAME}]: `;

const PageCrashPlugin: BasePluginType = {
  name: PLUGIN_NAME,
  monitor() {
    if (Worker) {
      const { pageCrashWorkerUrl } = this.options;
      const { uploadUrl } = this.context;
      if (!pageCrashWorkerUrl) {
        console.warn(Tag, 'missing pageCrashWorkerUrl in options');
      }
      const crashWorker = new Worker(pageCrashWorkerUrl);
      const HEARTBEAT_INTERVAL = 5 * 1000; // 5秒一次
      const sessionId = generateUUID();
      const { userAgent, language } = navigator;
      const { title } = document;
      const { href } = location;
      const id = getStore(StoreType.LOCAL, this.storeAppIdKey);
      const clientInfo = {
        appID: id, // 应用id
        pageTitle: title, // 页面标题
        path: href, // 页面路径
        language, // 站点语言
        userAgent // 浏览器标识
      };
      const data = {
        sendUrl: uploadUrl,
        clientInfo
      };
      const heartbeat = () => {
        const [lastOperate] = this.breadcrumb.getStack();
        crashWorker.postMessage({
          type: 'heartbeat',
          id: sessionId,
          data: {
            stack: [lastOperate],
            ...data
          }
        });
      };
      window.addEventListener('beforeunload', () => {
        const [lastOperate] = this.breadcrumb.getStack();
        crashWorker.postMessage({
          type: 'unload',
          id: sessionId,
          data: {
            stack: [lastOperate],
            ...data
          }
        });
      });
      setInterval(heartbeat, HEARTBEAT_INTERVAL);
      heartbeat();
    }
  }
};

export default PageCrashPlugin;
