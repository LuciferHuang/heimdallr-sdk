import { BaseOptionsType, ClientInfoType, CustomerOptionType, LinkMsgDataType, PageLifeType, ReportDataMsgType, VueInstance } from "@heimdallr-sdk/types";

export interface BrowserReportPayloadDataType extends ClientInfoType {
  [key: string]: any;
}

export interface PromiseErrorDataType {
  message?: string;
}

export interface PromiseErrorType extends ReportDataMsgType, PromiseErrorDataType {}

export interface LifecycleDataType extends LinkMsgDataType {
  type: PageLifeType;
  session_id: string;
  user_id: string;
}

export interface LifeCycleMsgType extends ReportDataMsgType, LinkMsgDataType {}

export interface ResourceErrorType extends ReportDataMsgType, LinkMsgDataType {}

export interface CodeErrorDataType {
  message: string;
  lineno: number;
  colno: number;
  filename: string;
}

export interface CodeErrorType extends ReportDataMsgType,CodeErrorDataType {}

export interface BrowserOptionsType extends BaseOptionsType {
  /**
   * 过滤请求url
   */
  ignoreUrls?: string[];
  /**
   * 用户标识（已登录用户）
   */
  userIdentify?: CustomerOptionType;
  /**
   * 节流阈值
   */
  throttleDelayTime?: number;
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
  /**
   * 是否上报接口返回值
   */
   reportResponds?: Boolean;
}

export enum PerformanceFeat {
  BASIC = 'basic',
  RESOURCE = 'resource',
  FMP = 'fmp',
  FPS = 'fps',
  VITALS = 'vitals'
}
