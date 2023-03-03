import {
  BasePluginType,
  NodeErrorTypes,
  EventTypes,
  ReportDataType,
  UncaughtExceptionDataType,
  ConsoleTypes
} from '@heimdallr-sdk/types';
import { generateUUID, formatDate } from '@heimdallr-sdk/utils';
interface CollectedType {
  category: EventTypes;
  data: Error;
}

const uncaughtExceptionPlugin: BasePluginType = {
  name: 'uncaughtExceptionPlugin',
  monitor(notify: (data: CollectedType) => void) {
    process.on('uncaughtException', (e) => {
      this.log(e, ConsoleTypes.ERROR);
      notify({
        category: EventTypes.ERROR,
        data: e
      });
    });
  },
  transform(collectedData: CollectedType): ReportDataType<UncaughtExceptionDataType> {
    const { category, data } = collectedData;
    const id = generateUUID();
    const time = formatDate();
    const { message, name, stack = '' } = data;
    return {
      id,
      time,
      type: category,
      data: {
        sub_type: NodeErrorTypes.UNCAUGHTEXCEPTION,
        name,
        message,
        stack
      }
    };
  }
};

export default uncaughtExceptionPlugin;
