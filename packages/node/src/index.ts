import fetch from 'node-fetch';
import { Core } from '@heimdallr-sdk/core';
import { IAnyObject, NodeOptionsType, StoreKeyType, NodeReportPayloadDataType, InterfaceResponseType } from '@heimdallr-sdk/types';
import { formatDate, generateUUID, isNodeEnv, obj2query } from '@heimdallr-sdk/utils';
// 基础插件
import errorPlugin from './plugins/uncaughtException';

class NodeClient extends Core<NodeOptionsType> {
  constructor(options: NodeOptionsType) {
    super(options);
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
      if (id && process.env[StoreKeyType.APP] !== id) {
        process.env[StoreKeyType.APP] = id;
      }
    });
  }

  async report(url: string, data: IAnyObject) {
    const { sendFunc } = this.getOptions();
    try {
      if (typeof sendFunc === 'function') {
        return await sendFunc(url, data);
      }
      // default get
      const res = await fetch(`${url}?${obj2query(data)}`);
      return await res.json();
    } catch (error) {
      console.error(error);
      return {
        code: -1,
        msg: error.message || '未知错误'
      };
    }
  }

  transform(datas: IAnyObject): NodeReportPayloadDataType {
    if (!datas) {
      return null;
    }
    const appID = process.env[StoreKeyType.APP];
    return {
      app_id: appID, // 应用id
      ...datas
    };
  }

  nextTick(cb: Function, ctx: Object, ...args: any[]) {
    process.nextTick(() => {
      cb.call(ctx, ...args);
    });
  }
}

const init = (options: NodeOptionsType) => {
  if (!isNodeEnv) {
    console.warn('[@heimdallr-sdk/node]: 当前不是Node环境');
    return;
  }
  const client = new NodeClient(options);
  const { plugins = [] } = options;
  client.use([errorPlugin, ...plugins]);
};

export default init;
