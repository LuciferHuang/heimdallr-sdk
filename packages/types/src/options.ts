import { AppInfoType, Dsn } from './base';
import { StoreType } from './constant';
import { BasePluginType } from './plugin';
import { VueInstance } from './vue';

export interface BaseOptionsType {
  /**
   * 上报接口配置信息
   */
  dsn: Dsn;
  /**
   * 应用信息
   */
  app: AppInfoType;
  /**
   * 为 true 则允许在控制台输出 console，需配合console插件使用
   */
  debug?: boolean;
  /**
   * 指定此 SDK 是否应激活并向后台发送事件
   */
  enabled?: boolean;
  /**
   * 节流阈值
   */
  throttleDelayTime?: number;
  /**
   * 插件
   */
  plugins?: BasePluginType[];
  /**
   * 过滤请求url
   */
  ignoreUrls?: string[];
  /**
   * 面包屑最大层级
   */
  maxBreadcrumbs?: number;
}

export enum PerformanceFeat {
  BASIC = 'basic',
  RESOURCE = 'resource',
  FMP = 'fmp',
  FPS = 'fps',
  VITALS = 'vitals'
}

export interface CustomerOptionType {
  name: string;
  postion: StoreType;
}

export interface BrowserOptionsType extends BaseOptionsType {
  /**
   * vue 实例
   */
  vue?: VueInstance;
  /**
   * serviceWorker地址（pageCrash）
   */
  pageCrashWorkerUrl?: string;
  /**
   * 关闭 performance 个别功能
   */
  performancOff?: PerformanceFeat[];
  /**
   * 客户端上报数据（页面加载完成时收集）
   */
  customers?: CustomerOptionType[];
}
