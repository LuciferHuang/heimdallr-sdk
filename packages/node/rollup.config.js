import { umdPackage } from '../../rollup.base.config';

umdPackage.output.inlineDynamicImports = true;

export default [umdPackage];
