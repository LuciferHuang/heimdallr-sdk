import { FilterItem } from 'components/filterGroup';
import { OperateBtn } from 'components/tableOprate';
import { ColumnConfig } from 'components/tableView';
import { EventTypes } from '@heimdallr-sdk/types';

const filterFormItems: FilterItem[] = [
  {
    renderType: 'input',
    label: '会话ID',
    prop: 'id'
  },
  {
    renderType: 'input',
    label: '页面路径',
    prop: 'path'
  },
  {
    renderType: 'input',
    label: '页面标题',
    prop: 'page_title'
  },
  {
    renderType: 'input',
    label: '用户ID',
    prop: 'user_id'
  }
];

const tableOprates: OperateBtn[] = [
  {
    cmd: 'copy',
    label: '批量复制ID',
    position: 'left',
    plain: true,
    icon: 'DocumentCopy'
  }
];

const tableConfig: ColumnConfig[] = [
  {
    prop: 'id',
    label: 'ID',
    width: 320,
    plugins: ['copy']
  },
  {
    prop: 'path',
    label: '页面路径'
  },
  {
    prop: 'page_title',
    label: '页面标题'
  },
  {
    prop: 'stay_time',
    label: '停留时间（s）',
    width: 158,
    sortable: true,
    config: {
      sortParam: 'sort',
      orderParam: 'order',
      sortVal: 'stay_time',
      ascVal: 'asc',
      descVal: 'desc'
    }
  },
  {
    prop: 'terminal',
    label: '终端'
  },
  {
    prop: 'user_id',
    label: '用户ID'
  },
  {
    prop: 'ip',
    label: 'IP地址'
  },
  {
    prop: 'etime',
    width: 158,
    label: '开始时间',
    sortable: true,
    config: {
      sortParam: 'sort',
      orderParam: 'order',
      sortVal: 'etime',
      ascVal: 'asc',
      descVal: 'desc'
    }
  },
  {
    type: 'operation',
    label: '操作',
    operates: [
      {
        cmd: 'detail',
        label: '详情'
      }
    ]
  }
];

function tagType(type) {
  switch (type) {
    case EventTypes.ERROR:
    case EventTypes.VUE:
      return 'danger';
    case EventTypes.DOM:
    case EventTypes.API:
      return 'success';
    case EventTypes.CUSTOMER:
      return 'warning';
    case EventTypes.ROUTE:
      return '';
    default:
      return 'info';
  }
}

export default function useListConfig() {
  return {
    dataPath: 'list',
    tableOprates,
    filterFormItems,
    tableConfig,
    tagType
  };
}
