import path from 'path';
import { common, iifePackage } from '../../rollup.base.config';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import rimraf from 'rimraf';

const utilsPath = path.join(__dirname, '../utils');
rimraf(path.join(utilsPath, 'esm'), () => undefined);

const typePath = path.join(__dirname, '../types');
rimraf(path.join(typePath, 'esm'), () => undefined);

iifePackage.plugins = [
  ...common.plugins,
  alias({
    entries: [
      {
        find: '@heimdallr-sdk/utils',
        replacement: path.join(utilsPath, 'src')
      },
      {
        find: '@heimdallr-sdk/types',
        replacement: path.join(typePath, 'src')
      }
    ],
    customResolver: nodeResolve({ extensions: ['.tsx', '.ts'] })
  })
];

// 本地调试开启sourcemap
iifePackage.output = {
  ...iifePackage.output,
  sourcemap: true
};

export default [iifePackage];
