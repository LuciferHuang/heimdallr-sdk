import { InterfaceResponseType, IAnyObject } from '../types';

export function successResponse(data: any, msg: string): InterfaceResponseType<IAnyObject> {
  return {
    code: 0,
    data,
    msg
  };
}
export function failResponse(msg: string): InterfaceResponseType<IAnyObject> {
  return {
    code: -1,
    msg
  };
}
