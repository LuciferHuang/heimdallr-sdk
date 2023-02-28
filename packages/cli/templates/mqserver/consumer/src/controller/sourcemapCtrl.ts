import TrySourceMap, { SourcemapReturnType } from '../lib/sourcemap';

/**
 * 查找源文件位置
 * @param req
 * @param res
 */
export function search(req, res) {
  const query = { ...req.query };
  const { lineno: line, colno: col, filename, appname } = query;
  if (!line || !col) {
    res.send({ ret: -1, msg: 'missing lineno or colno' });
    return;
  }
  if (!filename || !appname) {
    res.send({ ret: -1, msg: 'missing filename or appname' });
    return;
  }
  const sourceMap = new TrySourceMap({
    lineno: Number(line),
    colno: Number(col),
    folder: appname,
    filename
  });
  sourceMap.find().then((response: SourcemapReturnType) => {
    const { status, data, msg } = response;
    if (!status) {
      res.send({
        code: -1,
        msg
      });
      return;
    }
    res.send({
      code: 0,
      msg: 'success',
      data
    });
  });
}
