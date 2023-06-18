import {
  BaseOptionsType,
  ClientInfoType,
  CustomerOptionType,
  LinkMsgDataType,
  PageLifeType,
  ReportDataMsgType,
} from '@heimdallr-sdk/types';

export interface BrowserReportPayloadDataType extends ClientInfoType {
  [key: string]: any;
}

export interface PromiseErrorDataType {
  message?: string;
}

export interface PromiseErrorType extends ReportDataMsgType, PromiseErrorDataType {}

export interface LifecycleOptions {
  /**
   * 用户标识（已登录用户）
   */
  userIdentify?: CustomerOptionType;
}

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

export interface CodeErrorType extends ReportDataMsgType, CodeErrorDataType {}

export interface BrowserOptionsType extends BaseOptionsType, LifecycleOptions {}
