import { BrowserBreadcrumbTypes, WxBreadcrumbTypes } from './constant';

export enum BreadcrumbLevel {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export type BreadcrumbTypes = WxBreadcrumbTypes | BrowserBreadcrumbTypes | string;

export interface BreadcrumbPushData {
  eventId: string;
  type: BreadcrumbTypes;
  message: string;
  level?: BreadcrumbLevel;
  time?: number;
}
