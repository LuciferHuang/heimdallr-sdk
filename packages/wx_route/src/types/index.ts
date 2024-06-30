import { ReportDataMsgType } from "@heimdallr-sdk/types";

export enum WxRouteEvents {
  SWITCHTAB = 'switchTab',
  RELAUNCH = 'reLaunch',
  REDIRECTTO = 'redirectTo',
  NAVIGATETO = 'navigateTo',
  NAVIGATEBACK = 'navigateBack',
  NAVIGATETOMINIPROGRAM = 'navigateToMiniProgram',
  ROUTEFAIL = 'routeFail'
}

export interface WxRouteDataType {
  from: string;
  to: string;
  wt: WxRouteEvents | string;
  fail?: boolean;
  msg?: string;
}

export interface WxRouteMsgType extends ReportDataMsgType, WxRouteDataType {}
