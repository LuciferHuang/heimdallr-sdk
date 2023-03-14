import { BaseOptionsType, IAnyObject } from '@heimdallr-sdk/types';

export interface WxOptionsType extends BaseOptionsType {
  /**
   * wx.request配置项
   */
  reqOption?: WechatMiniprogram.RequestOption;
  /**
   *
   */
  userStoreKey: string;
  /**
   * 过滤请求url（wx_request）
   */
  ignoreUrls?: string[];
  /**
   * 是否上报返回值，开启后将使用 post 上报（wx_request）
   */
  reportResponds?: boolean;
}

export type WxTrackTypes = 'show' | 'hide';

export interface WxContextType {
  session_id?: string;
  path?: string;
  user_info?: IAnyObject | string;
}

export interface WxSettingType {
  user_agent: string;
  language: string;
}
