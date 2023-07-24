import { logType, platform } from '@/helper/config/filters';
import { deepMapperProperty, deserialize, deserializeArr, filterMapperProperty, mapperProperty } from 'type-json-mapper';

// 未声明的属性字段将不会被添加

export class Log {
  @mapperProperty('id')
  public id: string;
  @filterMapperProperty('platform', (val: string) => platform[val])
  public platform: string;
  @filterMapperProperty('type', (val: string) => logType[val])
  public type: string;
  @mapperProperty('sub_type')
  public subType: string;
  @mapperProperty('ascription')
  public ascription: string;
  @mapperProperty('session_id')
  public sessionId: string;
  @mapperProperty('otime', 'datetime')
  public otime: string;
}

export class Breadcrumb {
  @mapperProperty('time', 'datetime')
  public time: string;
  @mapperProperty('level')
  public level: string;
  @mapperProperty('type')
  public type: string;
  @mapperProperty('message')
  public message: string;
}

export class LogDetail {
  @mapperProperty('path')
  public path: string;
  @mapperProperty('type')
  public type: string;
  @mapperProperty('sub_type')
  public subType: string;
  @mapperProperty('ascription_name')
  public ascription: string;
  @mapperProperty('otime', 'datetime')
  public otime: string;
  @mapperProperty('page_title')
  public pageTitle: string;
  @mapperProperty('user_agent')
  public userAgent: string;
  @mapperProperty('data')
  public data: string;
  @deepMapperProperty('breadcrumb', Breadcrumb)
  public breadcrumb: Breadcrumb[];

  constructor() {
    // 缺省值
    this.breadcrumb = [];
  }
}

export const tableDeserialize = (tableData: Log[]) => deserializeArr(Log, tableData);

export const detailDeserialize = (detail: LogDetail) => deserialize<LogDetail>(LogDetail, detail);
