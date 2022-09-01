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
  [key: string]: any
}