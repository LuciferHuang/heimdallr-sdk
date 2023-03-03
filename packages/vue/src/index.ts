import { formatDate, generateUUID } from '@heimdallr-sdk/utils';
import {
  UnknownFunc,
  BasePluginType,
  ViewModel,
  VueReportDataType,
  ReportDataType,
  EventTypes,
  BrowserBreadcrumbTypes,
  VueTypes,
  ConsoleTypes
} from '@heimdallr-sdk/types';

const VuePlugin: BasePluginType = {
  name: 'vuePlugin',
  monitor(notify: (data: VueReportDataType) => void) {
    const { vue: vm } = this.getOptions();
    const { debug } = this.context;
    if (!vm) {
      this.log('Missing Vue in options');
      return;
    }
    const { errorHandler, silent } = vm.config;
    vm.config.errorHandler = (error: Error, vm: ViewModel, lifecycleHook: string) => {
      const { name, message, stack } = error;
      notify({
        name,
        message,
        hook: lifecycleHook,
        stack,
        sub_type: VueTypes.ERROR
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
  transform(data: VueReportDataType): ReportDataType<VueReportDataType> {
    // 添加用户行为栈
    const id = generateUUID();
    this.breadcrumb.unshift({
      eventId: id,
      type: BrowserBreadcrumbTypes.FRAMEWORK,
      data
    });
    const breadcrumb = this.breadcrumb.getStack();
    this.breadcrumb.clear();
    return {
      id,
      time: formatDate(),
      type: EventTypes.VUE,
      breadcrumb,
      data
    };
  }
};

export default VuePlugin;
