import { reactive } from "vue";
import http from "helper/http";

export default function useTotalChart(color: string[]) {
  const total = reactive({
    views: 0,
    contents: 0,
    registors: 0,
  });
  // 拉取数据
  async function fetchDatas() {
    const datas = {
      visits: 30,
      tourist: 900,
      projectss: 60,
      resources: 1000
    };
    const {
      visits = 0,
      tourist = 0,
      projectss,
      resources,
    } = datas as any;
    total.views = visits + tourist;
    total.contents = projectss + resources;
    return [
      [
        {
          value: visits,
          name: '注册用户',
        },
        {
          value: tourist,
          name: '游客',
        },
      ],
      [
        {
          value: projectss,
          name: '项目',
        },
        {
          value: resources,
          name: '资源',
        },
      ],
    ];
  }
  return {
    fetchDatas,
    total,
  };
}
