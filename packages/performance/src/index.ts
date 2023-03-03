import {
  BasePluginType,
  EventTypes,
  PerformanceSingleMsgType,
  PerformanceBasicMsgType,
  PerformanceVitalsMsgType,
  PerTypes,
  ReportDataType,
  PerformanceFeat
} from '@heimdallr-sdk/types';
import { formatDate, generateUUID } from '@heimdallr-sdk/utils';
import getBasic from './lib/basic';
import getVitals from './lib/vitals';
import getResources from './lib/resources';
import FPSTool from './lib/fps';
import FMPTiming from './lib/fmp';

type CollectedData = PerformanceSingleMsgType | PerformanceBasicMsgType | PerformanceVitalsMsgType;

const perPlugin: BasePluginType = {
  name: 'perPlugin',
  monitor(notify: (data: CollectedData) => void) {
    // 禁用标识
    const { performancOff = [] } = this.getOptions();

    let fpsTool = new FPSTool();
    if (!performancOff.includes(PerformanceFeat.FPS)) {
      fpsTool = new FPSTool();
    }
    // fmp
    if (!performancOff.includes(PerformanceFeat.FMP)) {
      const fmpTiming = new FMPTiming();
      fmpTiming.initObserver().then((fmp) => {
        notify({
          sub_type: PerTypes.FMP,
          value: fmp
        });
      });
    }
    // vitals
    if (!performancOff.includes(PerformanceFeat.VITALS)) {
      getVitals().then((vitals) => {
        notify({
          sub_type: PerTypes.VITALS,
          ...vitals
        });
      });
    }
    window.addEventListener(
      'load',
      () => {
        // 基础参数
        if (!performancOff.includes(PerformanceFeat.BASIC)) {
          notify({
            sub_type: PerTypes.BASIC,
            ...getBasic()
          });
        }
        // 资源耗时
        if (!performancOff.includes(PerformanceFeat.RESOURCE)) {
          notify({
            sub_type: PerTypes.RESOURCE,
            value: getResources()
          });
        }
        // fps
        if (!performancOff.includes(PerformanceFeat.FPS)) {
          fpsTool.run();
          setTimeout(() => {
            notify({
              sub_type: PerTypes.FPS,
              value: fpsTool.get()
            });
            fpsTool.destroy();
          }, 500);
        }
      },
      true
    );
  },
  transform(collectedData: CollectedData): ReportDataType<CollectedData> {
    return {
      id: generateUUID(),
      time: formatDate(),
      type: EventTypes.PERFORMANCE,
      data: {
        ...collectedData
      }
    };
  }
};

export default perPlugin;
