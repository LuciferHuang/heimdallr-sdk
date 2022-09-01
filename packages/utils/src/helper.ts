import { IAnyObject } from '@heimdallr-sdk/types';

/**
 * 生成UUID
 * @return {string}  {string}
 */
export function generateUUID(): string {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

/**
 * 格式化日期时间
 * @param {string} format
 * @param {number} timestamp - 时间戳
 * @return {string}
 */
export const formatDate = (format = 'Y-M-D h:m:s', timestamp: number = Date.now()): string => {
  const date = new Date(timestamp);
  const dateInfo = {
    Y: `${date.getFullYear()}`,
    M: `${date.getMonth() + 1}`,
    D: `${date.getDate()}`,
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };
  const formatNumber = (n) => (n > 10 ? n : '0' + n);
  const res = format
    .replace('Y', dateInfo.Y)
    .replace('M', dateInfo.M)
    .replace('D', dateInfo.D)
    .replace('h', formatNumber(dateInfo.h))
    .replace('m', formatNumber(dateInfo.m))
    .replace('s', formatNumber(dateInfo.s));
  return res;
};

/**
 * 函数节流
 *
 * @export
 * @param {Function} fn 需要节流的函数
 * @param {number} delay 节流的时间间隔
 * @return {*}  {Function} 返回一个包含节流功能的函数
 */
export function throttle(fn: Function, delay: number): Function {
  let canRun = true;
  return function (...args: any) {
    if (!canRun) return;
    fn.apply(this, args);
    canRun = false;
    setTimeout(() => {
      canRun = true;
    }, delay);
  };
}

/**
 * 重写对象上面的某个属性
 *
 * @export
 * @param {IAnyObject} source 需要被重写的对象
 * @param {string} name 需要被重写对象的key
 * @param {(...args: any[]) => any} replacement 以原有的函数作为参数，执行并重写原有函数
 * @param {boolean} isForced 是否强制重写（可能原先没有该属性）
 */
export function replaceOld(source: IAnyObject, name: string, replacement: (...args: any[]) => any, isForced?: boolean): void {
  if (source === undefined) return;
  if (name in source || isForced) {
    const original = source[name];
    const wrapped = replacement(original);
    if (typeof wrapped === 'function') {
      source[name] = wrapped;
    }
  }
}

export function objDeepCopy(obj: any) {
  // 对null进行处理
  if (obj === null) return null;
  // 如果是值类型，直接返回值
  if (typeof obj !== 'object') return obj;
  // 对Date对象进行处理
  if (obj.constructor === Date) return new Date(obj);
  // 对RegExp对象进行处理
  if (obj.constructor === RegExp) return new RegExp(obj);
  // 拷贝其构造器，获取该对象的原型，使原型也继承下来
  const newObj = new obj.constructor();
  for (const key in obj) {
    // 防止遍历时,拷贝到__proto__的可见属性
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      const val = obj[key];
      newObj[key] = typeof val === 'object' ? this.objDeepCopy(val) : val;
    }
  }
  return newObj;
}