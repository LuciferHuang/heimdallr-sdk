import { BaseOptionsType, BasePluginType, IAnyObject, ConsoleTypes, TAG } from '@heimdallr-sdk/types';
import { formateUrlPath, hasConsole } from '@heimdallr-sdk/utils';
import { Subscribe } from './lib/subscribe';
import { CoreContextType } from './types';

/**
 * 核心抽象类
 * @export
 * @class Core
 * @template O 配置信息
 * @template E 事件枚举
 */
export abstract class Core<O extends BaseOptionsType> {
  private readonly options: O;

  public context: CoreContextType;
  protected appID: string;
  protected readonly taskQueue: Array<IAnyObject>;
  private isReady: Boolean;

  constructor(options: O) {
    if (!this.isRightEnv()) {
      this.log('Client does not match the environment');
      return;
    }
    this.isReady = false;
    this.taskQueue = [];
    this.options = options;
    this.bindOptions();
    this.initAPP().then((id) => {
      // 处理应用id
      if (id && this.appID !== id) {
        this.appID = id;
      }
      // 开始执行上报
      this.isReady = true;
      this.executeTaskQueue();
    });
  }

  /**
   * 绑定配置
   */
  private bindOptions() {
    const { dsn, app, debug = false, enabled = true } = this.options;

    if (!app || !dsn) {
      this.log('Mising app or dsn in options');
      return;
    }

    const { host, init, upload = '' } = dsn;
    const initUrl = formateUrlPath(host, init);
    const uploadUrl = formateUrlPath(host, upload);

    this.context = {
      app,
      uploadUrl,
      initUrl,
      debug,
      enabled
    };
  }

  /**
   * 引用插件
   * @param {BasePluginType[]} plugins - 用户传入的应用信息
   */
  use(plugins: BasePluginType[]) {
    const { uploadUrl, enabled } = this.context;
    const sub = new Subscribe();
    const map = new Map<string, number>();
    for (const plugin of plugins) {
      const { name, monitor, transform } = plugin || {};
      if(!name || !monitor || !transform || map.has(name)) {
        this.log(`The plugin name [${name}] is duplicate, please modify it.`);
        return;
      }
      map.set(name, 1);
      monitor.call(this, sub.notify.bind(sub, name));
      const callback = (...args: any[]) => {
        const pluginDatas = transform.apply(this, args);
        const datas = this.transform(pluginDatas);
        if (!datas) {
          return;
        }
        if (!enabled) {
          return;
        }
        if (!this.isReady) {
          // 应用未初始化，暂存任务
          this.taskQueue.push(datas);
          return;
        }
        this.nextTick(this.report, this, uploadUrl, { app_id: this.appID, ...datas });
      };
      sub.watch(name, callback);
    }
  }

  /**
   * 执行任务队列
   */
  executeTaskQueue() {
    const { uploadUrl } = this.context;
    while (this.taskQueue.length) {
      const task = this.taskQueue.shift();
      this.nextTick(this.report, this, uploadUrl, { app_id: this.appID, ...task });
    }
  }

  /**
   * 获取客户端配置
   */
  getClientOptions() {
    return { ...this.options };
  }

  /**
   * 控制台输出
   * @param message
   * @param {ConsoleTypes} type
   */
  log(message: any, type: ConsoleTypes = ConsoleTypes.WARN): void {
    const { debug } = this.context;
    if (!hasConsole() || !debug) {
      return;
    }
    const func = console[type] as (...data: any[]) => void;
    if (typeof func !== 'function') {
      this.log('Type does not exist');
      return;
    }
    func(TAG, message);
  }

  /**
   * 抽象方法，判断当前环境
   */
  abstract isRightEnv(): boolean;

  /**
   * 抽象方法，nextTick
   */
  abstract nextTick(cb: Function, ctx: Object, ...args: any[]): void;

  /**
   * 抽象方法，注册/初始化应用
   * @return {string} 应用id
   */
  abstract initAPP(): Promise<string>;

  /**
   * 抽象方法，端的个性化数据，需子类自己实现
   * @param {IAnyObject} datas
   */
  abstract transform(datas: IAnyObject): IAnyObject;

  /**
   * 抽象方法，端的请求方式不一致，需子类自己实现
   * @param {string} url - 接口地址
   * @param {} type - 请求方式（枚举类型，各端有差异）
   * @param {IAnyObject} datas - 上传数据
   */
  abstract report(url: string, datas: IAnyObject, type?: any): void;
}
