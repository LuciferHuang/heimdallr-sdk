import { BreadcrumbPushData } from './breadcrumb';
import { BrowserSubTypes, EventTypes, PlatformTypes } from './constant';

export interface AppInfoType {
  name: string;
  leader: string;
  desc?: string;
}

export interface Dsn {
  /**
   * 上报的域名地址
   */
  host: string;
  /**
   * 应用初始化接口地址
   */
  init: string;
  /**
   * 信息上报接口地址
   */
  upload: string;
}

export interface ReportDataType<T> {
  id: string;
  time: string;
  type: EventTypes;
  data: T;
  breadcrumb?: BreadcrumbPushData[];
}

export interface ReportDataMsgType {
  sub_type: BrowserSubTypes | string;
}

export interface ClientInfoType {
  platform: PlatformTypes;
  app_id?: string;
  session_id?: string;
  page_title?: string;
  path?: string;
  language?: string;
  user_agent?: string
}
