import { IAnyObject, ReportDataMsgType } from "@heimdallr-sdk/types";

export interface WxDomDataType {
  method: string;
  sub_type: string;
  detail?: IAnyObject;
  currentTarget?: IAnyObject;
}

export interface WxDomMsgType extends ReportDataMsgType, WxDomDataType {}
