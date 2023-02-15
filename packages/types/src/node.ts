import { ReportDataMsgType } from "./base";

export interface UncaughtExceptionDataType extends ReportDataMsgType {
  message: string;
  name: string;
  stack?: string;
}
export interface NodeReportPayloadDataType {
  app_id: string;
  [key: string]: any;
}
