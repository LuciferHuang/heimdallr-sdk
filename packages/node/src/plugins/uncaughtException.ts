import {
  BasePluginType,
  NodeErrorTypes,
  EventTypes,
  ReportDataType,
  UncaughtExceptionDataType
} from '@heimdallr-sdk/types';
import { generateUUID, formatDate } from '@heimdallr-sdk/utils';

const PLUGIN_NAME = 'uncaughtExceptionPlugin';
const TAG = '[@heimdallr-sdk/node/uncaughtException]：';

interface CollectedType {
  category: EventTypes;
  data: Error;
}

const uncaughtExceptionPlugin: BasePluginType = {
  name: PLUGIN_NAME,
  monitor(notify: (eventName: string, data: CollectedType) => void) {
    const { debug } = this.context;
    process.on('uncaughtException', function(e){
      if (debug) {
        console.error(TAG, e);
      }
      notify(PLUGIN_NAME, {
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
