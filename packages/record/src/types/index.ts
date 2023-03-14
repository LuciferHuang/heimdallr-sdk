import { ReportDataMsgType } from "@heimdallr-sdk/types";

export enum RecordTypes {
  SESSION = 'session'
}

export interface RecordDataType {
  events: any[];
}

export interface RecordMsgType extends ReportDataMsgType, RecordDataType {}
