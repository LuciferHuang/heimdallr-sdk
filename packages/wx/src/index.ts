import { Core } from '@heimdallr-sdk/core';
import { IAnyObject, StoreKeyType, InterfaceResponseType, PageLifeType, EventTypes, voidFun } from '@heimdallr-sdk/types';
import { formatDate, generateUUID, objDeepCopy, replaceOld } from '@heimdallr-sdk/utils';
import { WxContext, WxOptionsType, WxTrackTypes } from './types';
import { getStorageSync, setStorageSync } from './utils';
import errorPlugin from './plugins/onerror';

class WxClient extends Core<WxOptionsType> {
  private wxContext: WxContext;
  constructor(options: WxOptionsType) {
    super(options);
    this.wxContext = {};
  }

  setWxContext(context: WxContext) {
    this.wxContext = Object.assign(this.wxContext, context);
  }

  clearWxContext() {
    this.wxContext = {};
  }

  getWxContext(): WxContext {
    return objDeepCopy(this.wxContext);
  }

  initAPP(): void {
    const { initUrl, app } = this.context;
    const id = generateUUID();
    const ctime = formatDate();
    const params = {
      id,
      ...app,
      ctime
    };
    this.report(initUrl, params).then((res: InterfaceResponseType<any>) => {
      const { data: { id = '' } = {} } = res;
      if (id && getStorageSync(StoreKeyType.APP) !== id) {
        setStorageSync(StoreKeyType.APP, id);
      }
    });
  }

  isRightEnv() {
    return typeof wx !== 'undefined' && typeof App !== 'undefined';
  }

  report(url: string, data: IAnyObject) {
    const { reqOption = {} } = this.getOptions();
    return new Promise((rs, rj) => {
      wx.request({
        success: (result) => {
          rs(result);
        },
        fail: (res) => rj(res),
        url,
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
    const appID = getStorageSync(StoreKeyType.APP);
    const preDatas = this.getWxContext();
    return {
      app_id: appID, // 应用id
      time: formatDate(),
      ...preDatas,
      ...datas
    };
  }

  nextTick(cb: Function, ctx: Object, ...args: any[]) {
    wx.nextTick(() => {
      cb.call(ctx, ...args);
    });
  }

  // lifecycle

  cusOnShow(oriOnShow: (query: Record<string, string>) => void | Promise<void>) {
    return (original: (e: any) => void): ((e: any) => void) => {
      const { uploadUrl, enabled } = this.context;
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
        const datas = client.transform({
          id: generateUUID(),
          type: EventTypes.LIFECYCLE,
          data: {
            sub_type: PageLifeType.LOAD
          }
        });
        if (datas && enabled) {
          client.nextTick(client.report, client, uploadUrl, datas);
        }
        if (oriOnShow && typeof oriOnShow === 'function') {
          oriOnShow.apply(this, e);
        }
      };
    };
  }
  cusOnHide(oriOnHide: () => void | Promise<void>) {
    return (original: voidFun): voidFun => {
      const { uploadUrl, enabled } = this.context;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const client = this;
      return function () {
        if (original) {
          original.apply(this);
        }
        const datas = client.transform({
          id: generateUUID(),
          type: EventTypes.LIFECYCLE,
          data: {
            sub_type: PageLifeType.UNLOAD
          }
        });
        if (datas && enabled) {
          client.nextTick(client.report, client, uploadUrl, datas);
        }
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
  client.use([errorPlugin,...plugins]);
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
      const { uploadUrl, enabled } = client.context;
      const { userStoreKey } = client.getOptions();
      switch (type) {
        case 'show':
          {
            // 页面显示
            const sessionId = generateUUID();
            const userInfo = getStorageSync(userStoreKey);
            client.setWxContext({ session_id: sessionId, user_info: userInfo, path });
            const datas = client.transform({
              id: generateUUID(),
              type: EventTypes.LIFECYCLE,
              data: {
                sub_type: PageLifeType.LOAD
              }
            });
            if (enabled && datas) {
              client.nextTick(client.report, client, uploadUrl, datas);
            }
          }
          break;
        case 'hide':
          {
            // 页面隐藏
            const datas = client.transform({
              id: generateUUID(),
              type: EventTypes.LIFECYCLE,
              data: {
                sub_type: PageLifeType.UNLOAD
              }
            });
            if (enabled && datas) {
              client.nextTick(client.report, client, uploadUrl, datas);
            }
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
