import * as echarts from "echarts";
import { reactive } from "vue";
import http from "helper/http";

declare interface ChartData {
  name: string;
  value: number;
}

export default function useTotalChart(domID: string, color: string[], t: Function) {
  const total = reactive({
    views: 0,
    contents: 0,
    registors: 0,
  });
  // 拉取数据
  async function fetchDatas() {
    const datas = await http.get("/statistics/total");
    const {
      visits = 0,
      tourist = 0,
      men,
      women,
      secreat,
      projectss,
      resources,
    } = datas as any;
    total.views = visits + tourist;
    total.contents = projectss + resources;
    total.registors = men + women + secreat;
    return [
      [
        {
          value: visits,
          name: t("overview.registors"),
        },
        {
          value: tourist,
          name: t("overview.tourist"),
        },
      ],
      [
        {
          value: projectss,
          name: t("overview.projects"),
        },
        {
          value: resources,
          name: t("overview.resource"),
        },
      ],
      [
        {
          value: men,
          name: t("overview.men"),
        },
        {
          value: women,
          name: t("overview.women"),
        },
        {
          value: secreat,
          name: t("overview.secreat"),
        },
      ],
    ];
  }
  // 图表
  function getOption(datas: Array<Array<ChartData>>) {
    const series = datas.map((ele, index) => ({
      type: "pie",
      center: [`${15 + index * 35}%`, "50%"],
      radius: [50, 66],
      label: {
        normal: {
          show: false,
          position: "center",
          formatter: "{value|{c}}\n{label|{b}}",
          rich: {
            value: {
              padding: 5,
              align: "center",
              verticalAlign: "middle",
              fontSize: 20,
            },
            label: {
              align: "center",
              verticalAlign: "middle",
              fontSize: 14,
            },
          },
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: "12",
          },
        },
      },
      data: ele,
    }));
    return {
      color,
      series,
    };
  }
  function render() {
    const chart = echarts.init(document.getElementById(domID));
    chart.showLoading();
    fetchDatas().then((datas) => {
      chart.hideLoading();
      chart.setOption(getOption(datas));
      chart.dispatchAction({
        type: "highlight",
        seriesIndex: [0, 1, 2],
        dataIndex: 0,
      });
      let dataIndex = 0;
      chart.on("mouseover", (e) => {
        if (e.dataIndex !== dataIndex) {
          [0, 1, 2].forEach((seriesIndex) => {
            if (seriesIndex === e.seriesIndex) {
              chart.dispatchAction({
                type: "downplay",
                seriesIndex,
                dataIndex: dataIndex,
              });
            }
          });
        }
      });
      chart.on("mouseout", (e) => {
        dataIndex = e.dataIndex;
        chart.dispatchAction({
          type: "highlight",
          seriesIndex: e.seriesIndex,
          dataIndex: e.dataIndex,
        });
      });
    });
  }
  return {
    render,
    fetchDatas,
    total,
  };
}
