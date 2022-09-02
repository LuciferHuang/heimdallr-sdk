import fs from 'fs';
import path from 'path';
import { SourceMapConsumer } from 'source-map';

type uploadOptions = {
  lineno: number;
  colno: number;
};

class TrySourceMap {
  options: uploadOptions;

  constructor(options: uploadOptions) {
    this.options = options;
  }

  async find() {
    try {
      const rawSourceMapText = fs.readFileSync(path.join(__dirname, `__test__/main.bundle.js.map`), {
        encoding: 'utf8'
      });

      const rawSourceMap = JSON.parse(rawSourceMapText);

      // @ts-ignore
      const position = await SourceMapConsumer.with(rawSourceMap, null, (consumer) => {
        const { lineno, colno } = this.options;
        return consumer.originalPositionFor({
          line: lineno,
          column: colno
        });
      });
      console.log('position=================');
      console.log(position);
      const { source, line, column, name } = position;
      if (source) {
        const index = rawSourceMap.sources.findIndex((i) => path.join(i) === path.join(source));
        if (index > -1) {
          const lines = rawSourceMap.sourcesContent[index].split('\n');
          if (line) {
            return {
              ret: 0,
              msg: 'success',
              data: lines[line - 1]
            };
          }
        }
      }
    } catch (error) {
      return {
        ret: -1,
        msg: 'failed',
        error
      };
    }
  }
}

export default TrySourceMap;
