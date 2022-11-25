import { failResponse, successResponse } from '../lib/utils';
import ProjModel from '../models/projModel';
import LogModel from '../models/logModel';
import BreadCrumbModel from '../models/breadcrumbModel';
import { BreadCrumb } from '../types';

const projModel = new ProjModel();
const logModel = new LogModel();
const bcModel = new BreadCrumbModel();

/**
 * 生成UUID
 * @return {string}  {string}
 */
export function generateUUID(): string {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

/**
 * post上报
 * @param req
 * @param res
 */
export function uploadPost(req, res) {
  const param = (req as any).fields;
  uploadCtrl(res, param);
}
/**
 * get上报
 * @param req
 * @param res
 */
export function uploadGet(req, res) {
  const param = (req as any).query;
  uploadCtrl(res, param);
}

/**
 * 上报主逻辑
 * @param res
 * @param param 请求参数
 */
async function uploadCtrl(res, param) {
  const { appID, id, time, type, data: paramData, breadcrumb: breadcrumbJson = '[]', path, language, userAgent, pageTitle } = param;
  if (!id || !appID) {
    res.send(failResponse('missing id or appID'));
    return;
  }
  try {
    // 面包屑
    let bcIds = [];
    const breadcrumb = JSON.parse(breadcrumbJson);
    if (breadcrumb.length) {
      const bcs = breadcrumb.map((ele: BreadCrumb) => ({
        type: ele.type,
        time: `${ele.time}`,
        event_id: ele.eventId,
        data: JSON.stringify(ele.data),
        id: generateUUID()
      }));
      const { status: bcStatus } = await bcModel.add(bcs);
      if (bcStatus) {
        bcIds = bcs.map(({ id }) => id);
      }
    }
    // 将入参转为数据库存储结构
    const paramObj = JSON.parse(paramData);
    const { sub_type } = paramObj;
    delete paramObj.sub_type;
    const logInfo = {
      ascription_id: appID,
      otime: time,
      type,
      sub_type,
      breadcrumb: JSON.stringify(bcIds),
      data: JSON.stringify(paramObj),
      path,
      language,
      user_agent: userAgent,
      page_title: pageTitle
    };
    const { data: count } = await logModel.count({ id });
    if (count) {
      // 记录已存在，直接更新
      const { status, msg } = await logModel.modify({ id }, logInfo);
      if (status) {
        res.send(successResponse(null, msg));
        return;
      }
      res.send(failResponse(msg));
      return;
    }
    // 新增
    const { status, msg } = await logModel.add([
      {
        id,
        ...logInfo
      }
    ]);
    if (status) {
      res.send(successResponse(null, msg));
      return;
    }
    res.send(failResponse(msg));
  } catch (err) {
    res.send(failResponse(err.message || JSON.stringify(err)));
  }
}

/**
 * 列表
 * @param req
 * @param res
 */
export async function list(req, res) {
  const query = { ...req.query };
  const { psize, pindex, order, sort } = query;
  if (!psize || !pindex) {
    res.send(failResponse('missing psize or pindex'));
    return;
  }
  delete query.psize;
  delete query.pindex;
  delete query.order;
  delete query.sort;
  const { data: total } = await logModel.count(query);
  if (!total) {
    res.send(
      successResponse(
        {
          list: [],
          total: 0
        },
        'empty'
      )
    );
    return;
  }
  let orderBy: any = null;
  if (sort && order) {
    orderBy = {};
    orderBy[sort] = order;
  }
  const { status, data, msg } = await logModel.find(pindex, psize, query, orderBy);
  if (status) {
    const proj_ids = data?.map(({ ascription_id }) => ({ id: ascription_id }));
    const {
      status: proj_status,
      data: proj_datas = [],
      msg: proj_msg
    } = await projModel.find(0, 0, {
      OR: proj_ids
    });
    if (!proj_status) {
      console.error(proj_msg);
    }
    const projMap = proj_datas.reduce((pre, cur) => {
      const { id, name } = cur;
      pre[id] = name;
      return pre;
    }, {});
    res.send(
      successResponse(
        {
          list: data?.map((ele) => ({
            ...ele,
            ascription: projMap[ele.ascription_id] || ele.ascription_id
          })),
          total
        },
        msg
      )
    );
    return;
  }
  res.send(failResponse(msg));
}

/**
 * 详情
 * @param req
 * @param res
 */
export async function detail(req, res) {
  const query = { ...req.query };
  const { id } = query;
  if (!id) {
    res.send(failResponse('missing id'));
    return;
  }
  try {
    const { status, data = [], msg } = await logModel.find(1, 1, { id });
    if (!status) {
      throw new Error(msg);
    }
    // 面包屑
    let breadcrumb: BreadCrumb[] = [];
    const [{ breadcrumb: bcJson = '[]' } = {}] = data || [];
    const bcIds = JSON.parse(bcJson);
    if (bcIds.length) {
      const bcQuery = bcIds.map((id: string) => ({ id }));
      const {
        status,
        data = [],
        msg
      } = await bcModel.find({
        OR: bcQuery
      });
      if (!status) {
        throw new Error(msg);
      }
      breadcrumb = data.sort((a, b) => bcIds.indexOf(a.id) - bcIds.indexOf(b.id));
    }
    // 归属应用名称
    let ascription_name = '';
    const [{ ascription_id }] = data || [];
    if (ascription_id) {
      const { status: prStatus, data: prData = [], msg: prMsg } = await projModel.find(1, 1, { id: ascription_id });
      if (!prStatus) {
        throw new Error(prMsg);
      }
      const [{ name = '' } = {}] = prData;
      ascription_name = name;
    }
    res.send(
      successResponse(
        {
          ...data[0],
          breadcrumb,
          ascription_name
        },
        msg
      )
    );
  } catch (err) {
    res.send(failResponse(err.message || JSON.stringify(err)));
  }
}
