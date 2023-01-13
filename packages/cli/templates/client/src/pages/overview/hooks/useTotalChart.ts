import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import http from 'helper/http';

export default function useTotalChart() {
  const total = reactive({
    api: 0,
    fmp: 0,
    err: 0
  });
  http
    .get('/statistic/total')
    .then((res: any) => {
      const { api, err, fmp } = res;
      total.api = api;
      total.err = err;
      total.fmp = fmp;
    })
    .catch((err) => {
      console.error(err);
      ElMessage.error(err.message || '获取总览数据失败');
    });
  return {
    total
  };
}
