import { ReportDataMsgType } from "@heimdallr-sdk/types";

export interface DomDataMsgType {
  ele: string;
}

export interface DomMsgType extends ReportDataMsgType, DomDataMsgType {}

export interface DomOptions {
  throttleDelayTime?: number;
}