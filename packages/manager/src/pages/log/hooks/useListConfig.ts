import { FilterItem } from 'components/filterGroup';
import { OperateBtn } from 'components/tableOprate';
import { ColumnConfig } from 'components/tableView';

const filterFormItems: FilterItem[] = [
  {
    renderType: 'smartbox',
    label: '应用',
    prop: 'ascription_id',
    config: {
      url: '/project/list?psize=20&pindex=1',
      targetPath: 'list',
      nameKey: 'name',
      searchKey: 'name',
      idKey: 'id'
    }
  },
  {
    renderType: 'input',
    label: '日志ID',
    prop: 'id'
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
    prop: 'type',
    label: '类型',
    renderType: 'select',
    options: [
      {
        value: 'api',
        label: '请求'
      },
      {
        value: 'dom',
        label: 'UI操作'
      },
      {
        value: 'performance',
        label: '性能'
      },
      {
        value: 'route',
        label: '路由'
      },
      {
        value: 'error',
        label: '错误'
      },
      {
        value: 'console',
        label: '控制台输出'
      },
      {
        value: 'customer',
        label: '用户上报'
      },
      {
        value: 'vue',
        label: 'Vue'
      },
    ]
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
    prop: 'platform',
    width: 108,
    label: '平台'
  },
  {
    prop: 'type',
    width: 108,
    label: '类型'
  },
  {
    prop: 'subType',
    width: 158,
    label: '子类型'
  },
  {
    prop: 'ascription',
    width: 158,
    label: '应用'
  },
  {
    prop: 'sessionId',
    width: 320,
    label: '会话ID',
    plugins: ['copy']
  },
  {
    prop: 'otime',
    width: 158,
    label: '发生时间',
    sortable: true,
    config: {
      sortParam: 'sort',
      orderParam: 'order',
      sortVal: 'otime',
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

const levelTypeMap = {
  fatal: 'danger',
  error: 'danger',
  warn: 'warning',
  info: 'info',
  debug: ''
};

export default function useListConfig() {
  return {
    dataPath: 'list',
    tableOprates,
    filterFormItems,
    tableConfig,
    levelTypeMap
  };
}
