import { generateUUID, getStore, setStore } from '@heimdallr-sdk/utils';
import {
  UnknownFunc,
  BasePluginType,
  ViewModel,
  VueReportDataType,
  ReportDataType,
  EventTypes,
  BrowserBreadcrumbTypes,
  ConsoleTypes,
  BreadcrumbLevel,
  IAnyObject,
  StoreType
} from '@heimdallr-sdk/types';
import { VueOptions, VueTypes } from './types';

const ERROR_CACHE = 'HEIMDALLR_SDK_VUE_ERROR_CACHE';

const getErrorUid = (input: IAnyObject) => window.btoa(encodeURIComponent(JSON.stringify(input)));

function vuePlugin(options: VueOptions = {}): BasePluginType {
  function parseStack(stack: string) {
    const REG_EXP = /([a-z|0-9|-]*).js:[0-9]*:[0-9]*/;
    const [, sourceFile] = stack.split('\n');
    const [matched = ''] = REG_EXP.exec(sourceFile) || [];
    const [fileName, lineCol = ''] = matched.split('.js:');
    const [line, col] = lineCol.split(':');
    const lineno = Number(line);
    const colno = Number(col);
    if (!fileName || lineno !== lineno || colno !== colno) {
      return {};
    }
    return {
      lineno,
      colno,
      filename: `${fileName}.js`
    };
  }
  return {
    name: 'vuePlugin',
    monitor(notify: (data: VueReportDataType) => void) {
      const { vue: vm } = options;
      const { debug } = this.context;
      if (!vm) {
        this.log('Missing Vue in options');
        return;
      }
      const { errorHandler, silent } = vm.config;
      vm.config.errorHandler = (error: any, vm: ViewModel, lifecycleHook: string) => {
        const { name, message, stack = '' } = error;
        notify({
          name,
          msg: message,
          hook: lifecycleHook,
          stk: stack,
          st: VueTypes.ERROR,
          ...parseStack(stack)
        });
        if (debug) {
          if (typeof errorHandler === 'function') {
            (errorHandler as UnknownFunc).call(this.vm, error, vm, lifecycleHook);
          } else if (!silent) {
            const message = `Error in ${lifecycleHook}: "${stack && stack.toString()}"`;
            this.log(message, ConsoleTypes.ERROR);
          }
        }
      };
    },
    transform(dat: VueReportDataType): ReportDataType<VueReportDataType> {
      const lid = generateUUID();
      // 添加用户行为栈
      const { hook, msg } = dat;
      this.breadcrumb.unshift({
        lid,
        bt: BrowserBreadcrumbTypes.FRAMEWORK,
        l: BreadcrumbLevel.FATAL,
        msg: `Error in Vue/${hook}: "${msg}"`,
        t: this.getTime()
      });
      let errorCaches = getStore<Array<string>>(StoreType.SESSION, ERROR_CACHE);
      if (!Array.isArray(errorCaches)) {
        errorCaches = [];
      }
      const errorUid = getErrorUid(dat);
      if (errorCaches.includes(errorUid)) {
        return null;
      }
      errorCaches.push(errorUid);
      setStore(StoreType.SESSION, ERROR_CACHE, errorCaches);
      return {
        lid,
        t: this.getTime(),
        e: EventTypes.VUE,
        dat
      };
    }
  };
}

export default vuePlugin;
