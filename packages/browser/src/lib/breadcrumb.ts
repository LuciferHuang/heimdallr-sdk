import { BrowserOptionsType, BreadcrumbPushData } from '@heimdallr-sdk/types';
/**
 * 用户行为栈存储类
 * @export
 * @class Breadcrumb
 * @template O
 */
export class Breadcrumb<O extends BrowserOptionsType> {
  private readonly maxBreadcrumbs: number;
  private stack: BreadcrumbPushData[];
  constructor(options: Partial<O> = {}) {
    this.maxBreadcrumbs = options.maxBreadcrumbs || 5;
    this.stack = [];
  }
  /**
   * 添加用户行为栈
   *
   * @param {BreadcrumbPushData} data
   */
  unshift(data: BreadcrumbPushData): BreadcrumbPushData[] {
    if (!data.time) {
      data.time = new Date().getTime();
    }
    if (this.stack.length >= this.maxBreadcrumbs) {
      this.pop();
    }
    this.stack.unshift(data);
    // make sure xhr fetch is behind button click
    this.stack.sort((a, b) => b.time - a.time);
    return this.stack;
  }

  private pop(): boolean {
    return this.stack.pop() !== undefined;
  }

  clear(): void {
    this.stack = [];
  }

  getStack(): BreadcrumbPushData[] {
    return this.stack.slice(0);
  }
}
