import { reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import http from 'helper/http';
import { DEFAULT_PAGE_SIZE } from 'config/others';
import { copy, cusToRefs, formatDate } from 'helper/utils';
import { logType as logTypeMap, subType as subTypeMap } from 'helper/config/filters'
import { detailDeserialize, LogDetail, tableDeserialize } from '@/models/log';

const detailLabel = {
  type: '类型',
  subType: '子类',
  ascription: '应用',
  otime: '发生时间'
};

export default function useListTable() {
  const state = reactive({
    tableData: [],
    form: {},
    allItems: 0,
    detail: {},
    codeLoading: false,
    codeVisible: false,
    isDrawerShow: false,
    codeDetail: {}
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
    order: 'desc'
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
        state.tableData = tableDeserialize(list);
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
            const detailRes = detailDeserialize(res);
            const fields = [];
            let arrayData = [];
            const { path, subType, data } = detailRes;
            Object.keys(detailRes).forEach((key) => {
              if (!['data', 'path'].includes(key)) {
                const lable = detailLabel[key] || key;
                const val =  detailRes[key]
                fields.push({
                  label: detailLabel[key] || key,
                  val: logTypeMap[val] || subTypeMap[val] || val
                });
              }
            });
            try {
              const dataRes = JSON.parse(data);
              switch (typeof dataRes) {
                case 'object':
                  if (subType === 35) {
                    arrayData = dataRes.value;
                  } else {
                    Object.keys(dataRes).forEach((key) => {
                      fields.push({
                        label: key,
                        val: dataRes[key]
                      });
                    });
                  }
                  break;
                default:
                  fields.push({
                    label: 'data',
                    val: dataRes
                  });
                  break;
              }
            } catch (error) {
              console.error(error);
            }
            state.detail = {
              fields,
              path,
              subType,
              data: subType === 21 ? data : null,
              arrayData
            };
          })
          .catch(() => {});
        break;
      default:
        break;
    }
  }

  // tag类型
  function tagTypeFilter(type: string) {
    switch (type) {
      case '错误':
        return 'danger';
      case '请求':
        return 'warning';
      case 'Vue':
        return 'success';
      case '用户上报':
        return 'info';
      default:
        return '';
    }
  }

  const detail = computed(() => state.detail || {});
  const codeDetail = computed(() => state.codeDetail || {});

  async function showCode() {
    if (state.codeVisible) {
      state.codeVisible = false;
      return;
    }
    const { data, ascription: app } = state.detail as LogDetail;
    try {
      const { lineno: line, colno: col, filename: file } = JSON.parse(data);
      state.codeLoading = true;
      const res = await http.get(`/sourcemap/search?lineno=${line}&colno=${col}&filename=${file}&appname=${app}`);
      const code = Array.isArray(res) ? res.join('\n') : res;
      state.codeVisible = true;
      state.codeDetail = {
        line,
        col,
        file,
        code
      };
    } catch (error) {
      ElMessage.error(error.message || '请求失败，请稍后重试');
    }
    state.codeLoading = false;
  }

  function drawerClose() {
    state.codeLoading = false;
    state.codeVisible = false;
  }

  return {
    state,
    detail,
    loadData,
    pageHandle,
    selectHandle,
    batchHandle,
    operateHandle,
    sortHandle,
    tagTypeFilter,
    showCode,
    codeDetail,
    drawerClose
  };
}
