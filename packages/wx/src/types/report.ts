import { EventTypes, IAnyObject, ReportDataMsgType } from '@heimdallr-sdk/types';

export interface WxContext {
  app_id?: string;
  session_id?: string;
  path?: string;
  user_info?: IAnyObject | string;
}

export interface WxErrorDataType {
  error: string;
}

export interface WxCollectType {
  category: EventTypes;
  data: WxErrorDataType;
}

export interface WxErrorType extends ReportDataMsgType, WxErrorDataType {}
