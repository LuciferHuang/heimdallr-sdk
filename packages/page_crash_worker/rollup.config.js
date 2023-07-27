import { iifePackage } from '../../rollup.base.config';

const footer = `if (HEIMDALLR_PAGE_CRASH_WORKER) {new HEIMDALLR_PAGE_CRASH_WORKER();}\n${iifePackage.output.footer}`;

export default [
  {
    ...iifePackage,
    output: {
      ...iifePackage.output,
      footer
    }
  }
];
