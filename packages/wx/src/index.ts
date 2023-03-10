import { Core } from '@heimdallr-sdk/core';
import {
  IAnyObject,
  PageLifeType,
  EventTypes,
  voidFun,
  WxContextType,
  WxSettingType,
  WxBreadcrumbTypes,
  PlatformTypes
} from '@heimdallr-sdk/types';
import { formatDate, generateUUID, objDeepCopy, replaceOld } from '@heimdallr-sdk/utils';
import { Breadcrumb } from '@heimdallr-sdk/core';
import { WxOptionsType, WxTrackTypes } from './types';
import { getStorageSync } from './utils';
import errorPlugin from './plugins/onerror';

class WxClient extends Core<WxOptionsType> {
  private wxContext: WxContextType;
  private wxSettings: WxSettingType;
  public readonly breadcrumb: Breadcrumb<WxOptionsType>;
  constructor(options: WxOptionsType) {
    super(options);
    this.wxContext = {};
    this.breadcrumb = new Breadcrumb(options);
  }

  setWxContext(context: WxContextType) {
    this.wxContext = { ...this.wxContext, ...context };
  }

  clearWxContext() {
    this.wxContext = {};
  }

  getWxContext(): WxContextType {
    return objDeepCopy(this.wxContext);
  }

  async initAPP() {
    await this.getWxSettings();
    const { initUrl, app } = this.context;
    const ctime = formatDate();
    const params = {
      id: generateUUID(),
      ...app,
      ctime
    };
    const res = await this.report(initUrl, params);
    const { data: { data = {} } = {} } = res as any;
    const { id = '' } = data || {};
    return id;
  }

  getWxSettings() {
    return Promise.all([(wx as any).getRendererUserAgent(), wx.getSystemInfo()]).then(([userAgent, info]) => {
      this.wxSettings = {
        user_agent: userAgent,
        language: info.language
      };
    });
  }

  isRightEnv() {
    return typeof wx !== 'undefined' && typeof App !== 'undefined';
  }

  report(url: string, data: IAnyObject): Promise<WechatMiniprogram.GeneralCallbackResult> {
    const { reqOption = {}, reportResponds = false } = this.getOptions();
    return new Promise((rs, rj) => {
      wx.request({
        success: (result) => {
          rs(result);
        },
        fail: (res) => rj(res),
        url,
        method: reportResponds ? 'POST' : 'GET',
        ...reqOption,
        data,
        dataType: 'json'
      });
    });
  }

  transform(datas: IAnyObject): IAnyObject {
    if (!datas) {
      return null;
    }
    const preDatas = this.getWxContext();
    return {
      time: formatDate(),
      platform: PlatformTypes.WECHAT,
      ...preDatas,
      ...this.wxSettings,
      ...datas
    };
  }

  nextTick(cb: Function, ctx: Object, ...args: any[]) {
    wx.nextTick(() => {
      cb.call(ctx, ...args);
    });
  }

  // lifecycle

  lifecycleReport(datas: IAnyObject) {
    const { uploadUrl, enabled } = this.context;
    if (!datas) {
      return;
    }
    if (!enabled) {
      return;
    }
    if (!this.appID) {
      this.taskQueue.push(datas);
      return;
    }
    this.nextTick(this.report, this, uploadUrl, { app_id: this.appID, ...datas });
  }

  cusOnShow(oriOnShow: (query: Record<string, string>) => void | Promise<void>) {
    return (original: (e: any) => void): ((e: any) => void) => {
      const { userStoreKey } = this.getOptions();
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const client = this;
      return function (e) {
        if (original) {
          original.apply(this, e);
        }
        const sessionId = generateUUID();
        const userInfo = getStorageSync(userStoreKey);
        client.setWxContext({ session_id: sessionId, user_info: userInfo, path: this.route });
        const id = generateUUID();
        const datas = client.transform({
          id,
          type: EventTypes.LIFECYCLE,
          data: {
            sub_type: PageLifeType.LOAD,
            href: this.route
          }
        });
        client.breadcrumb.unshift({
          eventId: id,
          type: WxBreadcrumbTypes.LIFECYCLE,
          message: `Enter "${this.route}"`
        });
        client.lifecycleReport.call(client, datas);
        if (oriOnShow && typeof oriOnShow === 'function') {
          oriOnShow.apply(this, e);
        }
      };
    };
  }
  cusOnHide(oriOnHide: () => void | Promise<void>) {
    return (original: voidFun): voidFun => {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const client = this;
      return function () {
        if (original) {
          original.apply(this);
        }
        const id = generateUUID();
        const datas = client.transform({
          id,
          type: EventTypes.LIFECYCLE,
          data: {
            sub_type: PageLifeType.UNLOAD,
            href: this.route
          }
        });
        client.breadcrumb.unshift({
          eventId: id,
          type: WxBreadcrumbTypes.LIFECYCLE,
          message: `Leave "${this.route}"`
        });
        client.lifecycleReport.call(client, datas);
        client.clearWxContext();
        if (oriOnHide && typeof oriOnHide === 'function') {
          oriOnHide.apply(this);
        }
      };
    };
  }
}

const init = (options: WxOptionsType) => {
  const client = new WxClient(options);
  const { plugins = [] } = options;
  client.use([errorPlugin, ...plugins]);
  return {
    // 代替 Page 函数
    heimdallrPage: (
      pageOptions: WechatMiniprogram.Page.Options<WechatMiniprogram.Page.DataOption, WechatMiniprogram.Page.CustomOption>
    ) => {
      const { onShow, onHide } = pageOptions;
      replaceOld(pageOptions, 'onShow', client.cusOnShow(onShow), true);
      replaceOld(pageOptions, 'onHide', client.cusOnHide(onHide), true);
      Page(pageOptions);
    },
    // 手动在页面 onShow/onHide 添加埋点
    track: (type: WxTrackTypes, path: string) => {
      const { userStoreKey } = client.getOptions();
      const id = generateUUID();
      switch (type) {
        case 'show':
          {
            // 页面显示
            const sessionId = generateUUID();
            const userInfo = getStorageSync(userStoreKey);
            client.setWxContext({ session_id: sessionId, user_info: userInfo, path });
            const datas = client.transform({
              id,
              type: EventTypes.LIFECYCLE,
              data: {
                sub_type: PageLifeType.LOAD,
                href: path
              }
            });
            client.breadcrumb.unshift({
              eventId: id,
              type: WxBreadcrumbTypes.LIFECYCLE,
              message: `Enter "${path}"`
            });
            client.lifecycleReport.call(client, datas);
          }
          break;
        case 'hide':
          {
            // 页面隐藏
            const datas = client.transform({
              id,
              type: EventTypes.LIFECYCLE,
              data: {
                sub_type: PageLifeType.UNLOAD,
                href: path
              }
            });
            client.breadcrumb.unshift({
              eventId: id,
              type: WxBreadcrumbTypes.LIFECYCLE,
              message: `Leave "${path}"`
            });
            client.lifecycleReport.call(client, datas);
            client.clearWxContext();
          }
          break;

        default:
          client.log('Unknown type');
          break;
      }
    }
  };
};

export default init;
