import { BasePluginType, BrowserErrorTypes, ClientInfoType, StoreKeyType, StoreType } from '@heimdallr-sdk/types';
import { generateUUID, getStore } from '@heimdallr-sdk/utils';

// 脱离 发布订阅 方式，走 webWorker 方式

const PLUGIN_NAME = BrowserErrorTypes.PAGECRASH;

const Tag = `[@heimdallr-sdk/${PLUGIN_NAME}]: `;

const PageCrashPlugin: BasePluginType = {
  name: PLUGIN_NAME,
  monitor() {
    if (Worker) {
      const { pageCrashWorkerUrl } = this.getOptions();
      const { uploadUrl } = this.context;
      if (!pageCrashWorkerUrl) {
        console.warn(Tag, 'missing pageCrashWorkerUrl in options');
      }
      const crashWorker = new Worker(pageCrashWorkerUrl);
      const HEARTBEAT_INTERVAL = 5 * 1000; // 5秒一次
      const workerSessionId = generateUUID();
      const { userAgent, language } = navigator;
      const { title } = document;
      const { href } = location;
      const id = getStore(StoreType.LOCAL, StoreKeyType.APP);
      const sessionID = getStore(StoreType.LOCAL, StoreKeyType.SESSION);
      const clientInfo: ClientInfoType = {
        app_id: id, // 应用id
        session_id: sessionID,
        page_title: title, // 页面标题
        path: href, // 页面路径
        language, // 站点语言
        user_agent: userAgent // 浏览器标识
      };
      const data = {
        sendUrl: uploadUrl,
        clientInfo
      };
      const heartbeat = () => {
        const [lastOperate] = this.breadcrumb.getStack();
        crashWorker.postMessage({
          type: 'heartbeat',
          id: workerSessionId,
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
          id: workerSessionId,
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
