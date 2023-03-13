import { ReportDataMsgType } from './base';
import { IAnyObject } from './common';

export interface VueInstance {
  [key: string]: any;
  config?: VueConfiguration;
  version: string;
}

export interface ViewModel {
  [key: string]: any;
  $root?: Record<string, unknown>;
  $options?: {
    [key: string]: any;
    name?: string;
    props?: IAnyObject;
  };
  $props?: Record<string, unknown>;
}

export interface VueConfiguration {
  errorHandler?(err: Error, vm: ViewModel | any, info: string): void;
  warnHandler?(msg: string, vm: ViewModel | any, trace: string): void;
  [key: string]: any;
}

export interface VueReportDataType extends ReportDataMsgType {
  name: string;
  message: string;
  hook: string;
  stack: string;
  lineno?: number;
  colno?: number;
  filename?: string;
}
