export interface InterfaceResponseType<T> {
  code: number;
  msg: string;
  data?: T;
}

export interface ModelResponseType<O> {
  status: boolean;
  msg: string;
  data?: O;
}

export interface IAnyObject {
  [key: string]: any;
}

export interface ConditionType {
  skip?: number;
  take?: number;
  orderBy?: IAnyObject[];
  where?: IAnyObject;
}

export interface IPInfo {
  ip: string;
  error?: string;
  region?: string;
}

export enum DeviceType {
  MOBILE = 'mobile',
  PC = 'pc'
}
export enum EventTypes {
  API = 'api',
  DOM = 'dom',
  PERFORMANCE = 'performance',
  ROUTE = 'route',
  ERROR = 'error',
  CONSOLE = 'console',
  CUSTOMER = 'customer',
  VUE = 'vue',
  LIFECYCLE = 'lifeCycle',
  EXTEND = 'extend',
  RECORD = 'record'
}
export enum PageLifeType {
  LOAD = 'enter',
  UNLOAD = 'leave'
}
export enum RecordTypes {
  SESSION = 'session'
}
