import { BasePluginType, BrowserErrorTypes } from '@heimdallr-sdk/types';
import { generateUUID } from '@heimdallr-sdk/utils';

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
      const data = {
        sendUrl: uploadUrl,
        href: window.location.href
      };
      const heartbeat = () => {
        crashWorker.postMessage({
          type: 'heartbeat',
          id: sessionId,
          data: {
            stack: this.breadcrumb.getStack(),
            ...data
          }
        });
      };
      window.addEventListener('beforeunload', () => {
        crashWorker.postMessage({
          type: 'unload',
          id: sessionId,
          data: {
            stack: this.breadcrumb.getStack(),
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
