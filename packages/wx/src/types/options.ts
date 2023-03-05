import { BaseOptionsType } from '@heimdallr-sdk/types';

export interface WxOptionsType extends BaseOptionsType {
  // wx.request配置项
  reqOption?: WechatMiniprogram.RequestOption;
  // 用户信息存储key
  userStoreKey: string;
}

export type WxTrackTypes = 'show' | 'hide';
