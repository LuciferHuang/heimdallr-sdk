import { VueInstance } from "@heimdallr-sdk/types"

export enum VueTypes {
  ERROR = 'error'
}

export interface VueOptions {
  /**
   * vue实例
   */
  vue?: VueInstance
}
