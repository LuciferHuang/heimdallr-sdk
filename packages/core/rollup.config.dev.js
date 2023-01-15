import { iifePackage } from '../../rollup.base.config';

// 本地调试开启sourcemap
iifePackage.output = {
  ...iifePackage.output,
  sourcemap: true
};

export default [iifePackage];
