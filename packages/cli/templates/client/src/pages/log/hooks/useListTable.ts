import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import http from 'helper/http';
import { DEFAULT_PAGE_SIZE } from 'config/others';
import { copy, cusToRefs, formatDate } from 'helper/utils';

interface BreadcrumbType {
  time: string;
  type: string;
  message: string;
  level: string;
}

export interface DetailType {
  path?: string;
  type?: string;
  sub_type?: string;
  ascription_name?: string;
  ctime?: string;
  page_title?: string;
  user_agent?: string;
  data?: any;
  breadcrumb?: BreadcrumbType[];
}

export default function useListTable() {
  const state = reactive({
    tableData: [],
    form: {},
    allItems: 0,
    detail: {},
    isDrawerShow: false
  });
  // 翻页
  const page = { index: 1, size: DEFAULT_PAGE_SIZE };
  function pageHandle({ pindex, psize }) {
    page.index = pindex;
    page.size = psize;
    loadData();
  }
  // 排序
  let sortParams: any = {
    orderParam: 'order',
    sortParam: 'sort',
    sortVal: 'otime',
    order: 'desc',
  };
  function sortHandle(params) {
    sortParams = params;
    loadData();
  }
  // 加载数据
  function loadData() {
    const params = cusToRefs(state.form);
    if (Object.keys(sortParams).length) {
      const { orderParam, sortParam, sortVal, order } = sortParams;
      params[sortParam] = sortVal;
      params[orderParam] = order;
    }
    const paramStr = Object.keys(params).reduce((pre, cur) => {
      const value = params[cur];
      let paramValue = value;
      if (value) {
        if (Array.isArray(value)) {
          paramValue = value.map((time) => formatDate(new Date(time), 'yyyy-MM-dd hh:mm:ss')).join('+');
        }
        pre += `&${cur}=${encodeURIComponent(paramValue)}`;
      }
      return pre;
    }, '');
    const { index, size } = page;
    state.tableData = [];
    const url = `/log/list?psize=${size}&pindex=${index}${paramStr}`;
    http
      .get(url)
      .then((res: any) => {
        const { total = 0, list = [] } = res;
        state.tableData = list;
        state.allItems = total;
      })
      .catch(() => {});
  }
  // 多选
  let selected = [];
  function selectHandle(val) {
    selected = val;
  }
  // 批量操作
  function batchHandle(cmd: string) {
    switch (cmd) {
      case 'copy':
        if (!selected.length) {
          ElMessage.warning('至少选择一项');
          return;
        }
        copy(
          selected
            .map(({ id }) => id)
            .filter((k) => k)
            .join('|')
        )
          ? ElMessage.success('已复制成功，可使用快捷键 CTRL+V 粘贴')
          : ElMessage.error('复制失败，请稍后重试');
        break;
      default:
        break;
    }
  }
  // 表格操作
  function operateHandle(cmd, row) {
    const { id } = row;
    switch (cmd) {
      case 'detail':
        // 弹出详情
        state.detail = {};
        http
          .get(`/log/detail?id=${id}`)
          .then((res: any) => {
            state.isDrawerShow = true;
            state.detail = res;
          })
          .catch(() => {});
        break;
      default:
        break;
    }
  }
  // tag类型
  function tagTypeFilter(type) {
    switch (type) {
      case 'error':
        return 'danger';
      case 'api':
        return 'warning';
      case 'vue':
        return 'success';
      case 'customer':
        return 'info';
      default:
        return '';
    }
  }
  function getDetail() {
    return state.detail as DetailType || {};
  }
  return {
    state,
    getDetail,
    loadData,
    pageHandle,
    selectHandle,
    batchHandle,
    operateHandle,
    sortHandle,
    tagTypeFilter
  };
}
