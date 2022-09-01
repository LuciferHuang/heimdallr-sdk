import {
  BrowserBreadcrumbTypes,
  CodeErrorDataType,
  ConsoleDataMsgType,
  LinkMsgDataType,
  DomDataMsgType,
  PromiseErrorDataType,
  RouteDataMsgType,
} from './browser';
import { VueReportDataType } from './vue';

enum BaseBreadcrumbTypes {
  VUE = 'Vue'
}

export type BreadcrumbTypes = BrowserBreadcrumbTypes | BaseBreadcrumbTypes;

export interface BreadcrumbPushData {
  eventId: string;
  /**
   * 事件类型
   */
  type: BreadcrumbTypes;
  // string for click dom
  data:
    | CodeErrorDataType
    | LinkMsgDataType
    | PromiseErrorDataType
    | LinkMsgDataType
    | VueReportDataType
    | DomDataMsgType
    | RouteDataMsgType
    | ConsoleDataMsgType;
  time?: number;
}
