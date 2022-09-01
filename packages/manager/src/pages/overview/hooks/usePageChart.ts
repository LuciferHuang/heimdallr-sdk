import * as echarts from "echarts";
import { ref } from "vue";
import { getDateRange } from "helper/utils";

export default function usePageChart(id: string, color: string[], t: Function) {
  const pageTime = ref(1);
  const pageOptions = [
    {
      label: t("overview.yesterday"),
      value: 1,
    },
    {
      label: t("overview.week"),
      value: 7,
    },
    {
      label: t("overview.month"),
      value: 30,
    },
    {
      label: t("overview.all"),
      value: -1,
    },
  ];
  async function onPageChange(val) {
    const chart = echarts.init(document.getElementById(id));
    let params = "";
    if (val !== -1) {
      const dateRange = getDateRange(-val, "MM-dd");
      params = `${new Date().getFullYear()}-${
        dateRange[0]
      }+${new Date().getFullYear()}-${dateRange[dateRange.length - 1]}`;
    }
    chart.showLoading();
    setTimeout(() => {
      chart.setOption(getOptions());
      chart.hideLoading();
    }, 888);
  }
  // 图表
  function getOptions() {
    const LEGENDS = [
      "index",
      "column-list",
      "column-detail",
      "resource-list",
      "resource-detail",
      "lab",
      "personal",
      "upload",
    ];
    const viewDatas = [];
    const durDatas = [];
    LEGENDS.forEach((legend) => {
      viewDatas.push({
        name: legend,
        value: Math.floor(Math.random() * 90 + 10),
      });
      durDatas.push({
        name: legend,
        value: Math.floor(Math.random() * 90 + 10),
      });
    });
    return {
      color,
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c}",
      },
      legend: {
        left: "rig",
        data: LEGENDS,
      },
      calculable: true,
      series: [
        {
          name: t("overview.times"),
          type: "funnel",
          width: "40%",
          left: "12%",
          bottom: "3%",
          label: {
            position: "left",
          },
          data: viewDatas,
        },
        {
          name: t("overview.duration"),
          type: "funnel",
          width: "40%",
          left: "48%",
          bottom: "3%",
          sort: "ascending",
          data: durDatas,
        },
      ],
    };
  }
  function render() {
    onPageChange(pageTime.value);
  }
  return {
    render,
    config: {
      pageTime,
      pageOptions,
      onPageChange,
    },
  };
}
