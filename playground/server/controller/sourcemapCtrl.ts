import path from 'path';
import fs from 'fs';
import TrySourceMap, { SourcemapReturnType } from '../lib/sourcemap';
/**
 * 接收上传文件
 * @param req
 * @param res
 */
export function upload(req, res) {
  const sourceMapDir = path.join(__dirname, '../', 'tempSourceMap');
  if (!fs.existsSync(sourceMapDir)) {
    fs.mkdirSync(sourceMapDir);
  }
  try {
    const { fields = {}, files = {} } = req;
    const { dirname = 'unknown', filename = 'unknown' } = fields;
    const { file } = files;
    if (!file) {
      throw new Error('请上传文件');
    }
    let dirnameNew = path.resolve(sourceMapDir, dirname);
    if (!fs.existsSync(dirnameNew)) {
      fs.mkdirSync(dirnameNew);
    }
    const rs = fs.createReadStream(file.path);
    const ws = fs.createWriteStream(path.join(dirnameNew, filename));
    rs.pipe(ws);
    rs.on('end', function () {
      res.send({ code: 0, msg: 'success' });
    });
  } catch (error) {
    res.send({ code: -1, msg: error.message || JSON.stringify(error) });
  }
}
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
  let sourceMap = new TrySourceMap({
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
