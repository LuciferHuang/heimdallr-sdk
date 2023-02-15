export enum StoreKeyType {
  SESSION = 'HEIMDALLR_SDK_SESSION_ID',
  APP = 'HEIMDALLR_SDK_APP_ID'
}

export enum MethodTypes {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
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
}

export enum NodeErrorTypes {
  UNCAUGHTEXCEPTION = 'uncaughtException'
}

export enum BrowserErrorTypes {
  CODEERROR = 'code',
  RESOURCEERROR = 'resource',
  UNHANDLEDREJECTION = 'unhandledrejection',
  PAGECRASH = 'pageCrash'
}

export enum DomTypes {
  CLICK = 'click'
}

export enum ConsoleTypes {
  LOG = 'log',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  ASSERT = 'assert'
}

export enum HttpTypes {
  FETCH = 'fetch',
  XHR = 'xhr'
}

export enum PerTypes {
  FMP = 'fmp',
  FPS = 'fps',
  BASIC = 'basic',
  VITALS = 'vitals',
  RESOURCE = 'resource'
}

export enum RouteTypes {
  HASH = 'hash',
  HISTORY = 'history'
}

export enum CustomerTypes {
  CUSTOMER = 'customer'
}

export type BrowserSubTypes = BrowserErrorTypes | DomTypes | HttpTypes | ConsoleTypes | PerTypes | RouteTypes | CustomerTypes;

export type StoreTypes = 'local' | 'session' | 'cookie' | 'global';

export enum StoreType {
  LOCAL = 'local',
  SESSION = 'session',
  COOKIE = 'cookie',
  GLOBAL = 'global'
}

export enum BrowserReportType {
  BEACON = 'beacon',
  IMG = 'img',
  GET = 'get'
}

export enum PageLifeType {
  LOAD = 'enter',
  UNLOAD = 'leave'
}

export enum DeviceType {
  MOBILE = 'mobile',
  PC = 'pc'
}

export enum VueTypes {
  ERROR = 'error'
}
