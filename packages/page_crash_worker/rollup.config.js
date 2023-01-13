import { umdPackage, iifePackage } from '../../rollup.base.config';

const footer = `if (HEIMDALLR_PAGE_CRASH_WORKER) {new HEIMDALLR_PAGE_CRASH_WORKER();}\n${iifePackage.output.footer}`;

export default [
  umdPackage,
  {
    ...iifePackage,
    output: {
      ...iifePackage.output,
      footer
    }
  }
];
