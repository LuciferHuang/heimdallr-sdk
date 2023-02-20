import { failResponse, successResponse } from '../lib/utils';
import { IPInfo } from '../types';
import Rabbit from '../lib/rabbitMQ';
import { add as logAdd, list as logList, detail as logDetail } from '../lib/logBus';

const mq = new Rabbit();

/**
 * post上报
 * @param req
 * @param res
 */
export function uploadPost(req, res) {
  const param = (req as any).fields;
  const { ipInfo } = req;
  uploadCtrl(res, param, ipInfo);
}
/**
 * get上报
 * @param req
 * @param res
 */
export function uploadGet(req, res) {
  const param = (req as any).query;
  const { ipInfo } = req;
  uploadCtrl(res, param, ipInfo);
}

/**
 * 上报主逻辑
 * @param res
 * @param param 请求参数
 */
async function uploadCtrl(res, param, ipInfo: IPInfo) {
  const { app_id, id } = param;
  if (!id || !app_id) {
    res.send(failResponse('missing id or app_id'));
    return;
  }
  // 入队
  mq.sendQueueMsg(
    'logQueue',
    JSON.stringify({ param, ipInfo }),
    (msg) => {
      res.send(successResponse(null, msg));
    },
    (err) => res.send(failResponse(err))
  );
}

/**
 * 列表
 * @param req
 * @param res
 */
export async function list(req, res) {
  const query = { ...req.query };
  res(await logList(query));
}

/**
 * 详情
 * @param req
 * @param res
 */
export async function detail(req, res) {
  const query = { ...req.query };
  res(await logDetail(query));
}

setInterval(() => {
  mq.receiveQueueMsg(
    'logQueue',
    function (msg) {
      // 入库
      logAdd(msg);
    },
    function (error) {
      console.error('消费失败', error);
    }
  );
}, 1000);
