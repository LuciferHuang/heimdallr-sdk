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
    prop: 'platform',
    label: '平台',
    renderType: 'select',
    options: [
      {
        value: 'browser',
        label: '浏览器端'
      },
      {
        value: 'wechat',
        label: '微信小程序'
      },
      {
        value: 'nodejs',
        label: 'NodeJS'
      }
    ]
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
    prop: 'platform',
    width: 108,
    label: '平台',
    plugins: ['filter']
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
      },
      {
        cmd: 'play',
        label: '播放',
        condition: {
          prop: 'events',
          cmd: 'notempty'
        }
      }
    ]
  }
];

const filterMap = {
  platform: {
    browser: '浏览器端',
    wechat: '微信小程序',
    nodejs: 'NodeJS'
  }
};

function tagType(type: EventTypes) {
  switch (type) {
    case EventTypes.ERROR:
    case EventTypes.VUE:
      return 'danger';
    case EventTypes.CUSTOMER:
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
    tagType,
    filterMap
  };
}
