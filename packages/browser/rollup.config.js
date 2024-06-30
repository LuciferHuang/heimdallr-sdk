import { umdPackage, iifePackage } from '../../rollup.base.config';

// iife 增加自调用逻辑
const footer = `if (window.__HEIMDALLR_OPTIONS__ && HEIMDALLR_BROWSER) {HEIMDALLR_BROWSER(window.__HEIMDALLR_OPTIONS__);}\n${iifePackage.output.footer}`;

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
