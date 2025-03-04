import { nanoid } from 'nanoid';
import { failResponse, successResponse } from '../lib/utils';
import ProjModel from '../models/projModel';

const projModel = new ProjModel();

 export function initPost(req, res) {
  const param = (req as any).fields;
  init(res, param);
}

export function initGet(req, res) {
  const param = (req as any).query;
  init(res, param);
}

export async function init(res, appInfo) {
  const { name } = appInfo;
  if (!name) {
    res.send(failResponse('missing name'));
    return;
  }
  const { data: projects } = await projModel.find(1, 1, { name });
  if (projects && projects.length) {
    res.send(successResponse(projects[0], 'already exist'));
    return;
  }
  appInfo.id = nanoid();
  appInfo.ctime = new Date();
  const { status, msg } = await projModel.add([appInfo]);
  if (status) {
    res.send(successResponse(appInfo, msg));
    return;
  }
  res.send(failResponse(msg));
}

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
  const { data: total } = await projModel.count(query);
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
  const { status, data, msg } = await projModel.find(pindex, psize, query, orderBy);
  if (status) {
    res.send(
      successResponse(
        {
          list: data,
          total
        },
        msg
      )
    );
    return;
  }
  res.send(failResponse(msg));
}
