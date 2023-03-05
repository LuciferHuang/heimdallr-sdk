/**
 * 是否支持historyAPI
 * @return {boolean}
 */
export function supportsHistory(): boolean {
  return window && !!window.history.pushState && !!window.history.replaceState;
}
