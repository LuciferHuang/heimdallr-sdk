
export interface BasePluginType {
  name: string;
  // 监控事件
  monitor: (notify: (eventName: string, data: any) => void) => void;
  // 数据格式转换
  transform?: (collectedData: any) => any;
  [key: string]: any
}
