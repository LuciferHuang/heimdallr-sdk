import fs from 'fs';
import path from 'path';
import { SourceMapConsumer } from 'source-map';

interface UploadOptionType {
  lineno: number;
  colno: number;
  filename: string;
  folder: string;
}

export interface SourcemapReturnType {
  status: boolean;
  msg: string;
  data?: any;
}

class TrySourceMap {
  options: UploadOptionType;

  constructor(options: UploadOptionType) {
    this.options = options;
  }

  async find(): Promise<SourcemapReturnType> {
    try {
      const { lineno, colno, filename, folder } = this.options;
      if (!folder || !filename) {
        throw new Error('missing filename or folder');
      }

      const rawSourceMapText = fs.readFileSync(path.join(__dirname, '../', `tempSourceMap/${folder}/${filename}.map`), {
        encoding: 'utf8'
      });

      const rawSourceMap = JSON.parse(rawSourceMapText);

      // @ts-ignore
      const position = await SourceMapConsumer.with(rawSourceMap, null, (consumer) => {
        return consumer.originalPositionFor({
          line: lineno,
          column: colno
        });
      });
      const { source, line } = position;
      if (!source) {
        return {
          status: true,
          msg: 'success',
          data: position
        };
      }
      const index = rawSourceMap.sources.findIndex((i) => path.join(i) === path.join(source));
      if (index <= -1) {
        return {
          status: true,
          msg: 'success',
          data: position
        };
      }
      const lines = rawSourceMap.sourcesContent[index].split('\n');
      if (line) {
        return {
          status: true,
          msg: 'success',
          data: lines.slice(line - 2, line + 1)
        };
      }
      return {
        status: true,
        msg: 'success',
        data: lines
      };
    } catch (error) {
      return {
        status: false,
        msg: error.message || JSON.stringify(error)
      };
    }
  }
}

export default TrySourceMap;
