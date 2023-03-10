import { ClientInfoType, ReportDataMsgType } from "./base";

export interface UncaughtExceptionDataType extends ReportDataMsgType {
  message: string;
  name: string;
  stack?: string;
}
export interface NodeReportPayloadDataType extends ClientInfoType {
  [key: string]: any;
}
