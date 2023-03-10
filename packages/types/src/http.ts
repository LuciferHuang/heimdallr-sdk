import { ReportDataMsgType } from './base';
import { IAnyObject } from './common';
import { MethodTypes } from './constant';

export interface HttpRequest {
  method: MethodTypes | string;
  url: string;
  data?: IAnyObject;
}

export interface HttpResponse {
  status?: number;
  data?: IAnyObject | string;
  msg?: string;
}

export interface HttpCollectDataType {
  request: HttpRequest;
  response: HttpResponse;
  time: number;
  elapsedTime?: number;
}

export interface HttpCollectType extends ReportDataMsgType, HttpCollectDataType {}
