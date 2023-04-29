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
  RECORD = 'record'
}

export enum BrowserErrorTypes {
  CODEERROR = 'code',
  RESOURCEERROR = 'resource',
  UNHANDLEDREJECTION = 'unhandledrejection',
  PAGECRASH = 'pageCrash'
}

export enum BrowserReportType {
  BEACON = 'beacon',
  IMG = 'img',
  GET = 'get',
  POST = 'post'
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

export enum PageLifeType {
  LOAD = 'enter',
  UNLOAD = 'leave'
}

export enum DeviceType {
  MOBILE = 'mobile',
  PC = 'pc'
}

export enum PlatformTypes {
  BROWSER = 'browser',
  NODE = 'nodejs',
  WECHAT = 'wechat'
}

export enum BrowserBreadcrumbTypes {
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

export enum WxBreadcrumbTypes {
  API = 'Api',
  ROUTE = 'Route',
  CLICK = 'UI.Click',
  ERROR = 'Error',
  LIFECYCLE = 'LifeCycle',
  CUSTOMER = 'Customer'
}
