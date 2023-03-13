import { BasePluginType, EventTypes, ReportDataType, RecordDataType, RecordMsgType, RecordTypes } from '@heimdallr-sdk/types';
import { formatDate, generateUUID } from '@heimdallr-sdk/utils';
import { record } from 'rrweb';

const recordPlugin: BasePluginType = {
  name: 'recordPlugin',
  monitor(notify: (data: RecordDataType) => void) {
    let stopFnc = null;
    const events = [];
    window.addEventListener('load', () => {
      stopFnc = record({
        emit(event) {
          events.push(event);
        }
      });
    });
    window.addEventListener('unload', () => {
      if (!stopFnc) {
        return;
      }
      stopFnc();
      notify({
        events
      });
    });
  },
  transform(collectedData: RecordDataType): ReportDataType<RecordMsgType> {
    return {
      id: generateUUID(),
      time: formatDate(),
      type: EventTypes.RECORD,
      data: {
        sub_type: RecordTypes.SESSION,
        ...collectedData
      }
    };
  }
};
export default recordPlugin;
