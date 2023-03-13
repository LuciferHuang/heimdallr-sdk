import { SourcemapOptionType, ResponseType } from '@heimdallr-sdk/types';
import path from 'path';
import fs from 'fs';
import request from 'request';

const TAG = '[webpack-plugin-sourcemap-upload]: ';

class UploadSourceMapPlugin<O extends SourcemapOptionType> {
  private readonly options: O;

  constructor(options: O) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.done.tapAsync('upload-sourcemap-plugin', async (status: { compilation: { outputOptions: { path: string } } }) => {
      const outputPath = status.compilation.outputOptions.path;
      const files = fs.readdirSync(outputPath);
      const list = files.filter((filename) => filename.endsWith('.js.map'));
      if (!list.length) {
        console.warn(TAG, 'map files not found');
        return;
      }
      for (const file of list) {
        try {
          const { code, msg } = await this.upload(path.join(outputPath, file));
          if (code !== 0) {
            console.error(TAG, msg);
          }
        } catch (err) {
          console.error(TAG, err);
        }
      }
      console.log(TAG, 'upload finished');
      process.exit();
    });
  }

  upload(filePath: string): Promise<ResponseType> {
    return new Promise((resolve, rejected) => {
      const { url, appname, errcode = 'code', errmsg = 'msg' } = this.options;
      if (!url || !appname) {
        rejected({ code: -1, msg: 'missing url or appname in options' });
      }

      const fileStream = fs.createReadStream(filePath);
      const filename = path.basename(filePath);

      const config = {
        method: 'POST',
        url,
        headers: {},
        formData: {
          file: {
            value: fileStream,
            options: {
              filename: filePath,
              contentType: null
            }
          },
          dirname: appname,
          filename
        }
      };

      request(config, function (err, { body }) {
        if (err) {
          rejected({
            code: -1,
            msg: err.message || err
          });
          return;
        }
        try {
          const data = JSON.parse(body);
          const code = data[errcode];
          const result = {
            code: code || code === 0 ? code : -1,
            msg: data[errmsg] || '未知错误'
          };
          if (result.code === 0) {
            resolve(result);
          } else {
            rejected(result);
          }
        } catch (error) {
          rejected({
            code: -1,
            msg: error.message || error
          });
        }
      });
    });
  }
}

export default UploadSourceMapPlugin;
