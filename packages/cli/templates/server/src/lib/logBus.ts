import BreadCrumbModel from '../models/breadcrumbModel';
import LogModel from '../models/logModel';
import ProjModel from '../models/projModel';
import SessionModel from '../models/sessionModel';
import { BreadCrumb, LogItem, DeviceType, EventTypes, PageLifeType, InterfaceResponseType, IAnyObject } from '../types';
import { failResponse, generateUUID, isMobileDevice, successResponse } from './utils';

const projModel = new ProjModel();
const logModel = new LogModel();
const bcModel = new BreadCrumbModel();
const sessionModel = new SessionModel();

const TAG = '[@heimdallr-sdk/server|logBus]:';

export async function add(message: string): Promise<InterfaceResponseType<IAnyObject>> {
  try {
    // 解析消息
    const params = JSON.parse(message);
    const { param, ipInfo } = params;
    const {
      app_id,
      session_id,
      id,
      time,
      type,
      data: paramData,
      breadcrumb: breadcrumbJson = '[]',
      path,
      language,
      user_agent,
      page_title
    } = param;
    if (!id || !app_id) {
      return failResponse('missing id or app_id');
    }
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
      // 面包屑入库
      const { status: bcStatus } = await bcModel.add(bcs);
      if (bcStatus) {
        bcIds = bcs.map(({ id }) => id);
      }
    }

    // 将入参转为数据库存储结构
    const paramObj = JSON.parse(paramData);
    const { sub_type, user_id = '' } = paramObj;
    delete paramObj.sub_type;

    // session
    if (type === EventTypes.LIFECYCLE) {
      const { error, ip, region = '' } = ipInfo;
      if (error) {
        console.error(TAG, error);
      }
      let response = { status: false, msg: 'sub_type not found' };
      switch (sub_type) {
        case PageLifeType.LOAD:
          // 会话信息入库
          response = await sessionModel.add([
            {
              id: session_id,
              user_id: `${user_id}`,
              ip,
              province: region,
              path,
              page_title,
              stay_time: 0,
              terminal: isMobileDevice(user_agent) ? DeviceType.MOBILE : DeviceType.PC,
              language,
              etime: time,
              ltime: ''
            }
          ]);
          break;
        case PageLifeType.UNLOAD:
          {
            const { data = [] } = await sessionModel.find(1, 5, {
              id: session_id
            });
            const [targetSession] = data;
            if (!targetSession || data.length > 1) {
              throw new Error('session not found');
            }
            const { etime } = targetSession;
            let stayTime = 0;
            if (etime) {
              stayTime = new Date(time).getTime() - new Date(etime).getTime();
            }
            response = await sessionModel.modify(
              { id: session_id },
              {
                stay_time: stayTime,
                ltime: time
              }
            );
          }
          break;

        default:
          break;
      }
      const { status, msg } = response;
      if (!status) {
        throw new Error(msg);
      }
      // 页面生命周期时间不加log
      return successResponse(null, msg);
    }

    const logInfo: LogItem = {
      ascription_id: app_id,
      session_id,
      otime: time,
      type,
      sub_type,
      breadcrumb: JSON.stringify(bcIds),
      data: JSON.stringify(paramObj),
      path,
      language,
      user_agent,
      page_title
    };
    const { data: count } = await logModel.count({ id });
    if (count) {
      // 记录已存在，直接更新
      const { status, msg } = await logModel.modify({ id }, logInfo);
      if (status) {
        return successResponse(null, msg);
      }
      return failResponse(msg);
    }
    // 新增
    const { status, msg } = await logModel.add([
      {
        id,
        ...logInfo
      }
    ]);
    if (status) {
      return successResponse(null, msg);
    }
    return failResponse(msg);
  } catch (err) {
    return failResponse(err.message || JSON.stringify(err));
  }
}

export async function list(params): Promise<InterfaceResponseType<IAnyObject>> {
  const { psize, pindex, order, sort } = params;
  if (!psize || !pindex) {
    return failResponse('missing psize or pindex');
  }
  delete params.psize;
  delete params.pindex;
  delete params.order;
  delete params.sort;
  const { data: total } = await logModel.count(params);
  if (!total) {
    return successResponse(
      {
        list: [],
        total: 0
      },
      'empty'
    );
  }
  let orderBy: any = null;
  if (sort && order) {
    orderBy = {};
    orderBy[sort] = order;
  }
  const { status, data, msg } = await logModel.find(pindex, psize, params, orderBy);
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
    return successResponse(
      {
        list: data?.map((ele) => ({
          ...ele,
          ascription: projMap[ele.ascription_id] || ele.ascription_id
        })),
        total
      },
      msg
    );
  }
  return failResponse(msg);
}

export async function detail(params): Promise<InterfaceResponseType<IAnyObject>> {
  const { id } = params;
  if (!id) {
    return failResponse('missing id');
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
    return successResponse(
      {
        ...data[0],
        breadcrumb,
        ascription_name
      },
      msg
    );
  } catch (err) {
    return failResponse(err.message || JSON.stringify(err));
  }
}
