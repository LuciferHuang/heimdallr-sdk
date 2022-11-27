export interface InterfaceResponseType<T> {
  code: number;
  msg: string;
  data?: T;
}

export interface ModelResponseType<O> {
  status: boolean;
  msg: string;
  data?: O;
}

export interface IAnyObject {
  [key: string]: any;
}

export interface ConditionType {
  skip?: number;
  take?: number;
  orderBy?: IAnyObject[];
  where?: IAnyObject;
}

export interface IPInfo {
  ip: string;
  error?: string;
  region?: string;
}
