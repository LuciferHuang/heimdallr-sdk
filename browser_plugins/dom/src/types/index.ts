import { ReportDataMsgType } from '@heimdallr-sdk/types';

export enum DomTypes {
  CLICK = 51
}

export interface DomDataMsgType {
  ele: string;
  x: number;
  y: number;
}

export interface DomMsgType extends ReportDataMsgType, DomDataMsgType {}

export interface DomOptions {
  throttleDelayTime?: number;
  sensitiveClasses?: string[];
  sensitiveTags?: string[];
}
