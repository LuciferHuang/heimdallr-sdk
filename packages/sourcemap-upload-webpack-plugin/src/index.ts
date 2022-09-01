import { SourcemapOptionType, ResponseType } from '@heimdallr-sdk/types';
import path from 'path';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

const TAG = '[sourcemap-upload-webpack-plugin]: ';

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
          const { ret, msg } = await this.upload(path.join(outputPath, file));
          if (ret !== 0) {
            console.error(TAG, msg);
          }
        } catch (err) {
          console.error(TAG, err);
        }
      }
      process.exit();
    });
  }

  upload(file: string): Promise<ResponseType> {
    return new Promise((resolve, rejected) => {
      const { url, folder, errcode = 'ret', errmsg = 'msg' } = this.options;
      if (!url || !folder) {
        rejected({ ret: -1, msg: 'missing url or folder in options' });
      }

      const contentText = fs.createReadStream(file);
      const filename = path.basename(file);

      const formData = new FormData();
      formData.append('dirname', folder);
      formData.append('filename', filename);
      formData.append('file', contentText);

      axios
        .post(url, formData, {
          headers: formData.getHeaders()
        })
        .then(({ data }) => {
          const code = data[errcode];
          const result = {
            ret: (code || code === 0) ? code : -1,
            msg: data[errmsg] || '未知错误'
          };
          if (result.ret === 0) {
            resolve(result);
          } else {
            rejected(result);
          }
        })
        .catch((err) => {
          rejected({
            ret: -1,
            msg: err.message || err
          });
        });
    });
  }
}

export default UploadSourceMapPlugin;
