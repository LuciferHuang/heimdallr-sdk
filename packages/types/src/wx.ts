import { ReportDataMsgType } from './base';
import { IAnyObject } from './common';
import { WxRouteEvents } from './constant';

export interface WxContextType {
  session_id?: string;
  path?: string;
  user_info?: IAnyObject | string;
}

export interface WxSettingType {
  user_agent: string;
  language: string;
}

export interface WxErrorDataType {
  error: string;
}

export interface WxDomDataType {
  method: string;
  sub_type: string;
  detail?: IAnyObject;
  currentTarget?: IAnyObject;
}

export interface WxRouteDataType {
  from: string;
  to: string;
  sub_type: WxRouteEvents | string;
  isFail?: boolean;
  message?: string;
}

export interface WxErrorMsgType extends ReportDataMsgType, WxErrorDataType {}

export interface WxDomMsgType extends ReportDataMsgType, WxDomDataType {}

export interface WxRouteMsgType extends ReportDataMsgType, WxRouteDataType {}
