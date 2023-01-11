import { failResponse, successResponse } from '../lib/utils';
import ProjModel from '../models/projModel';

const projModel = new ProjModel();

export async function init(req, res) {
  const appInfo = { ...req.query };
  const { id, name } = appInfo;
  if (!id && !name) {
    res.send(failResponse('missing id or name'));
    return;
  }
  const { data: count } = await projModel.count({ name });
  if (count) {
    res.send(successResponse(appInfo, 'already exist'));
    return;
  }
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
