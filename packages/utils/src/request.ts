import { MethodTypes, XhrResponse, HttpCommonRes } from '@heimdallr-sdk/types';
import { obj2query } from './base';

/**
 * 解析响应头为对象
 * @param {string} headers - 原始响应头字符串
 * @return {Record<string, string>} 解析后的响应头对象
 */
 const parseHeaders = (headers: string): Record<string, string> => {
  const headerObj: Record<string, string> = {};
  headers.trim().split(/[\r\n]+/).forEach(line => {
    const [key, value] = line.split(': ');
    headerObj[key] = value;
  });
  return headerObj;
};

/**
 * 通过 sendBeacon 上传数据
 * @param {string} url - 接口地址
 * @param {Record<string, any>} data - 请求参数
 * @return {boolean} 是否成功发送
 */
export const beacon = (url: string, data: Record<string, any>): boolean => {
  if (!url || typeof url !== 'string') {
    console.error('Invalid URL');
    return false;
  }
  if (!data || typeof data !== 'object') {
    console.error('Invalid data');
    return false;
  }
  const formData = new FormData();
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      let value = data[key];
      if (typeof value !== 'string' && !(value instanceof Blob)) {
        value = JSON.stringify(value);
      }
      formData.append(key, value);
    }
  }
  return navigator.sendBeacon(url, formData);
};

/**
 * 通过 XMLHttpRequest 发送 GET 请求
 * @param {string} url - 接口地址
 * @param {Record<string, any>} data - 请求参数
 * @return {Promise<XhrResponse>} 请求结果
 */
export const get = (url: string, data: Record<string, any>) => {
  const queryString = obj2query(data);
  const separator = url.includes('?') ? '&' : '?';
  return xhr(MethodTypes.GET, `${url}${separator}${queryString}`, null);
};

/**
 * 通过 XMLHttpRequest 发送 POST 请求
 * @param {string} url - 接口地址
 * @param {Record<string, any>} data - 请求参数
 * @return {Promise<XhrResponse>} 请求结果
 */
export const post = (url: string, data: Record<string, any>) => xhr(MethodTypes.POST, url, data);


/**
 * 基于 XMLHttpRequest 发送 HTTP 请求
 * @param {MethodTypes} method - HTTP 方法
 * @param {string} url - 接口地址
 * @param {any} data - 请求参数
 * @return {Promise<XhrResponse>} 响应数据，包含状态、请求头、响应数据
 */
export const xhr = (method: MethodTypes, url: string, data: any): Promise<XhrResponse<HttpCommonRes>> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url, true);

    // 设置请求头
    if (method === MethodTypes.POST) {
      if (typeof data === 'string' || data instanceof URLSearchParams) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      }
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const responseHeaders = parseHeaders(xhr.getAllResponseHeaders());
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const responseData = xhr.responseText ? JSON.parse(xhr.responseText) : null;
            resolve({
              status: xhr.status,
              statusText: xhr.statusText,
              headers: responseHeaders,
              data: responseData,
            });
          } catch (error) {
            reject(new Error(`Failed to parse response: ${xhr.responseText}`));
          }
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
            headers: responseHeaders,
            data: xhr.responseText,
          });
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error'));
    };

    try {
      // 发送数据
      if (method === MethodTypes.POST) {
        if (typeof data === 'string' || data instanceof URLSearchParams) {
          xhr.send(data);
        } else {
          xhr.send(JSON.stringify(data));
        }
      } else {
        xhr.send();
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 图片方式上传数据
 * @param {string} url - 接口地址
 * @param {Record<string, any>} data - 请求参数
 */
export const imgRequest = (url: string, data: Record<string, any>): void => {
  // 构建查询字符串
  const queryString = obj2query(data);
  const separator = url.includes('?') ? '&' : '?';
  const fullUrl = `${url}${separator}${queryString}`;
  // 创建并发送请求
  const img = new Image();
  img.src = fullUrl;
  // 使用 setTimeout 清理 img 对象，确保内存释放
  setTimeout(() => {
    img.src = ''; // 清空 src
  }, 0);
};
