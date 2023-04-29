import { record } from 'rrweb';
import { BasePluginType, EventTypes, ReportDataType, BrowserReportType } from '@heimdallr-sdk/types';
import { formatDate, generateUUID, countBytes } from '@heimdallr-sdk/utils';
import { RecordDataType, RecordMsgType, RecordTypes } from './types';

const MIN_EVENTSIZE = 50176;
const MAX_EVENTSIZE = 55296;

function encodeRecordNodes(node) {
  const { childNodes = [] } = node || {};
  for (const child of childNodes) {
    if (child.textContent) {
      child.textContent = encodeURIComponent(child.textContent);
    } else {
      encodeRecordNodes(child);
    }      
  }
}

const recordPlugin: BasePluginType = {
  name: 'recordPlugin',
  monitor(notify: (data: RecordDataType) => void) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const client = this;
    const { uploadUrl } = this.context;
    let stopFnc = null;
    let events = [];
    window.addEventListener('load', () => {
      stopFnc = record({
        sampling: {
          // set the interval of media interaction event
          media: 800,
          input: 'last' // 连续输入时，只录制最终值
        },
        emit(event) {
          encodeRecordNodes((event.data as any).node);
          const eventCurrentSize = countBytes(JSON.stringify(events));
          if (!client.appID) {
            events.push(event);
            return;
          }
          // sendBeacon 最大支持 64KB，预留 10KB ~ 15KB
          if (eventCurrentSize >= MIN_EVENTSIZE && eventCurrentSize <= MAX_EVENTSIZE) {
            notify({ events });
            events = [];
          } else if (eventCurrentSize > MAX_EVENTSIZE) {
            client.report(
              uploadUrl,
              client.transform({
                app_id: client.appID,
                id: generateUUID(),
                time: formatDate(),
                type: EventTypes.RECORD,
                data: {
                  sub_type: RecordTypes.SESSION,
                  events
                }
              }),
              BrowserReportType.POST
            );
            events = [];
          }
          events.push(event);
        }
      });
    });
    window.addEventListener('unload', () => {
      if (!stopFnc) {
        return;
      }
      stopFnc();
      if (!events.length) {
        return;
      }
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
