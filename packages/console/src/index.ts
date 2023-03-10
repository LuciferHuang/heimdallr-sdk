import {
  BasePluginType,
  BrowserBreadcrumbTypes,
  ConsoleDataMsgType,
  ConsoleMsgType,
  ConsoleTypes,
  EventTypes,
  ReportDataType
} from '@heimdallr-sdk/types';
import { formatDate, generateUUID, replaceOld } from '@heimdallr-sdk/utils';

const consolePlugin: BasePluginType = {
  name: 'consolePlugin',
  monitor(notify: (data: ConsoleDataMsgType) => void) {
    const logType = ['log', 'info', 'warn', 'error', 'assert'];
    if (!window.console) {
      return;
    }
    const { debug } = this.context;
    logType.forEach((level: ConsoleTypes) => {
      replaceOld(window.console, level, function (originalConsole: () => any): Function {
        return function (...args: any[]): void {
          if (originalConsole) {
            notify({
              args,
              level
            });
            if (debug) {
              originalConsole.apply(window.console, args);
            }
          }
        };
      });
    });
  },
  transform(collectedData: ConsoleDataMsgType): ReportDataType<ConsoleMsgType> {
    const id = generateUUID();
    const { args, level } = collectedData;
    // 添加用户行为栈
    this.breadcrumb.unshift({
      eventId: id,
      type: BrowserBreadcrumbTypes.CONSOLE,
      message: `Console output "${args.join(',')}" "${level}"`
    });
    return {
      id,
      time: formatDate(),
      type: EventTypes.CONSOLE,
      data: {
        sub_type: collectedData.level,
        ...collectedData
      }
    };
  }
};

export default consolePlugin;
