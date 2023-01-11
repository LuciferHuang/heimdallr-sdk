import { failResponse, successResponse } from '../lib/utils';
import SessionModel from '../models/sessionModel';

const sessionModel = new SessionModel();

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
  const { data: total } = await sessionModel.count(query);
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
  const { status, data, msg } = await sessionModel.find(pindex, psize, query, orderBy);
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
