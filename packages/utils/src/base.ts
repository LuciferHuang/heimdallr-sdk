/**
 * 判断当前环境是否支持console
 * @return {boolean} {boolean}
 */
export const hasConsole = (): boolean => typeof console !== 'undefined';

/**
 * 格式化url地址
 * @param {string} host - 域名地址
 * @param {string} path - 接口路径
 * @return {string}
 */
export const formateUrlPath = (host: string, path: string): string =>
  `${/^http(s|):\/\//.test((host || '')) ? host : `//${(host || '').replace(/^http(s|):\/\//, '')}`}/${(path || '')[0] === '/' ? path.substring(1) : path}`;

/**
 * 获取url路径地址
 * @param {string} url - 域名地址
 * @return {string}
 */
export const getUrlPath = (url: string): string => {
  const path = `${(url || '').replace(/^http(s|):/, '').split('?')[0]}`;
  const endIndex = path.length - 1;
  return path[endIndex] === '/' ? path.substring(0, endIndex) : path;
};

/**
 * 获取url指定参数
 * @param {string} name - 参数名
 * @return {string}
 */
export function getUrlParam(name: string): string {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  if (!isBrowserEnv) {
    return '';
  }
  const result = window.location.search.substring(1).match(reg);
  if (result != null) {
    return result[2];
  }
  return '';
}

export const isNodeEnv = typeof process !== 'undefined' ? process : 0;

export const isBrowserEnv = typeof window !== 'undefined' ? window : 0;

/**
 * 获取全局变量
 */
export function getGlobal() {
  if (isBrowserEnv) return window;
  if (isNodeEnv) return process;
}
