import { BrowserBreadcrumbTypes, BrowserErrorTypes, EventTypes, BreadcrumbLevel } from '@heimdallr-sdk/types';
import { formatDate, get } from '@heimdallr-sdk/utils';
import { CrashErrorType } from './types';

// 运行在 webWorker

const TAG = '[@heimdallr-sdk/page-crash-worker]:';

class PageCrashWorker {
  private readonly CHECK_CRASH_INTERVAL = 10 * 1000; // 每 10s 检查一次
  private readonly CRASH_THRESHOLD = 15 * 1000; // 15s 超过15s没有心跳则认为已经 crash
  private pages = {};
  private timer = null;
  private stack = [];

  constructor() {
    console.info(TAG, 'webWorker running');
    this.init();
  }

  init() {
    onmessage = (e) => {
      const { id, type, data: detail } = e.data || {};
      this.stack = detail.stack || [];
      if (type === 'heartbeat') {
        this.pages[id] = {
          t: Date.now()
        };
        if (!this.timer) {
          this.timer = setInterval(() => {
            this.checkCrash(detail);
          }, this.CHECK_CRASH_INTERVAL);
        }
      } else if (type === 'unload') {
        delete this.pages[id];
      }
    };
  }

  checkCrash(data: CrashErrorType) {
    const now = Date.now();
    const { sendUrl, clientInfo } = data;
    const href = clientInfo.path;
    for (const id in this.pages) {
      const page = this.pages[id];
      if (now - page.t > this.CRASH_THRESHOLD) {
        delete this.pages[id];
        // 用户行为栈
        const breadcrumb = [
          {
            eventId: id,
            type: BrowserBreadcrumbTypes.CRASH,
            level: BreadcrumbLevel.FATAL,
            message: `Crash on ${href}`,
            time: new Date().getTime()
          },
          ...this.stack
        ];
        // 上报 crash
        get(sendUrl, {
          id,
          time: formatDate(),
          type: EventTypes.ERROR,
          breadcrumb,
          ...clientInfo,
          data: {
            sub_type: BrowserErrorTypes.PAGECRASH,
            href
          }
        });
      }
    }
    if (Object.keys(this.pages).length == 0) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export default PageCrashWorker;
