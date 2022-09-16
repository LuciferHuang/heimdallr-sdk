import { failResponse, successResponse } from '../lib/utils';
import ProjModel from '../models/projModel';
import LogModel from '../models/logModel';

const projModel = new ProjModel();
const logModel = new LogModel();

/**
 * 获取总览数据
 * @param req
 * @param res
 */
export function statisticTotalGet(req, res) {}

/**
 * 获取应用数据
 * @param req
 * @param res
 */
export function statisticProjGet(req, res) {}
