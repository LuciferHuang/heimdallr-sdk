import { ReportDataMsgType } from './base';
import { BreadcrumbPushData } from './breadcrumb';
import { PageLifeType } from './constant';

export interface CodeErrorDataType {
  message: string;
  lineno: number;
  colno: number;
  filename: string;
}

export interface CodeErrorType extends ReportDataMsgType,CodeErrorDataType {}

export interface LinkMsgDataType {
  href?: string;
}

export interface ResourceErrorType extends ReportDataMsgType, LinkMsgDataType {}

export interface LifecycleDataType extends LinkMsgDataType {
  type: PageLifeType
}

export interface PromiseErrorDataType {
  message?: string;
}

export interface PromiseErrorType extends ReportDataMsgType, PromiseErrorDataType {}

export interface CrashErrorType extends ReportDataMsgType, LinkMsgDataType {
  sendUrl: string;
  stack: BreadcrumbPushData[];
}

export interface DomDataMsgType {
  ele: string;
}

export interface DomMsgType extends ReportDataMsgType, DomDataMsgType {}

export interface ConsoleDataMsgType {
  args: any[];
  level: string;
}

export interface ConsoleMsgType extends ReportDataMsgType, ConsoleDataMsgType {}

export interface RouteDataMsgType {
  from: string;
  to: string;
}

export interface RouteMsgType extends ReportDataMsgType, RouteDataMsgType {}

export interface PerformanceBasicMsgType extends ReportDataMsgType {
  dnsSearch: number; // DNS 解析耗时
  tcpConnect: number; // TCP 连接耗时
  sslConnect: number; // SSL安全连接耗时
  request: number; // TTFB 网络请求耗时
  response: number; // 数据传输耗时
  parseDomTree: number; // DOM 解析耗时
  resource: number; // 资源加载耗时
  domReady: number; // DOM Ready
  httpHead: number; // http 头部大小
  interactive: number; // 首次可交互时间
  complete: number; // 页面完全加载
  redirect: number; // 重定向次数
  redirectTime: number; // 重定向耗时
  duration: number;
  fp: number; // 渲染出第一个像素点，白屏时间
  fcp: number; // 渲染出第一个内容，首屏结束时间
}
interface ResourceType {
  name: string;
  time: number;
}

export interface PerformanceSingleMsgType extends ReportDataMsgType {
  value: number | ResourceType[];
}

export interface PerformanceVitalsMsgType extends ReportDataMsgType {
  lcp: number;
  fid: number;
  cls: number;
}

// 通用上报结构
export interface IAnyMsgType extends ReportDataMsgType {
  [key: string]: any;
}

export const enum BrowserBreadcrumbTypes {
  ROUTE = 'Route',
  CLICK = 'UI.Click',
  CONSOLE = 'Console',
  XHR = 'Xhr',
  FETCH = 'Fetch',
  UNHANDLEDREJECTION = 'Unhandledrejection',
  RESOURCE = 'Resource',
  CODE_ERROR = 'CodeError',
  CUSTOMER = 'Customer',
  FRAMEWORK = 'Framework',
  LIFECYCLE = 'LifeCycle',
  CRASH = 'Crash'
}
