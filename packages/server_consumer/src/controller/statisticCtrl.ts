import { failResponse, successResponse } from '../lib/utils';
import ProjModel from '../models/projModel';
import LogModel from '../models/logModel';

const projModel = new ProjModel();
const logModel = new LogModel();

interface WhereConditionType {
  type: string;
  sub_type?: string;
  ascription_id?: string;
}

interface TotalResultType {
  proj: string;
  api: number;
  err: number;
  fmp: number;
}

async function totalGet(projId?: string): Promise<TotalResultType> {
  const errWhere: WhereConditionType = {
    type: 'error'
  };
  const perWhere: WhereConditionType = {
    type: 'performance',
    sub_type: 'fmp'
  };
  const apiWhere: WhereConditionType = {
    type: 'api'
  };
  if (projId) {
    errWhere.ascription_id = projId;
    perWhere.ascription_id = projId;
    apiWhere.ascription_id = projId;
  }
  try {
    const [{ data: errorCount = 0 }, { data: fmpList }, { data: apiList }] = await Promise.all([
      logModel.count(errWhere),
      logModel.find(0, 0, perWhere),
      logModel.find(0, 0, apiWhere)
    ]);
    const fmpCount = fmpList?.reduce((total, fmp) => {
      if (fmp && fmp.data) {
        const obj = JSON.parse(fmp.data);
        // 大于3000毫秒
        if (obj.value > 3000) {
          total += 1;
        }
      }
      return total;
    }, 0);
    const apiCount = apiList?.reduce((total, api) => {
      if (api && api.data) {
        const obj = JSON.parse(api.data);
        // 大于3000毫秒
        if (obj.time > 3000) {
          total += 1;
        }
      }
      return total;
    }, 0);
    return {
      proj: projId || '',
      api: apiCount,
      err: errorCount,
      fmp: fmpCount
    };
  } catch (error) {
    console.error('[server/statisticCtrl]: ', error);
    return {
      proj: projId || '',
      api: -1,
      err: -1,
      fmp: -1
    };
  }
}

/**
 * 获取总览数据
 * @param req
 * @param res
 */
export async function statisticTotalGet(req, res) {
  try {
    const result = await totalGet();
    res.send(successResponse(result, 'success'));
  } catch (err) {
    res.send(failResponse(err.message || JSON.stringify(err)));
  }
}

/**
 * 获取应用数据
 * @param req
 * @param res
 */
export async function statisticProjGet(req, res) {
  try {
    const { data: projList = [] } = await projModel.find(0, 0);
    const promises = projList.map(({ id }) => totalGet(id));
    const resultList = await Promise.all(promises);
    res.send(
      successResponse(
        resultList.map((r) => {
          const proj = projList.find(({ id }) => id === r.proj);
          const { proj: id, err, api, fmp } = r;
          if (proj) {
            return { err, api, fmp, ...proj };
          }
          return { id, err, api, fmp };
        }),
        'success'
      )
    );
  } catch (err) {
    res.send(failResponse(err.message || JSON.stringify(err)));
  }
}
