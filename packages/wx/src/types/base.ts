import { BaseOptionsType, IAnyObject } from '@heimdallr-sdk/types';

export interface WxOptionsType extends BaseOptionsType {
  /**
   * wx.request配置项
   */
  reqOption?: WechatMiniprogram.RequestOption;
  /**
   * 用户信息
   */
  userStoreKey: string;
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
