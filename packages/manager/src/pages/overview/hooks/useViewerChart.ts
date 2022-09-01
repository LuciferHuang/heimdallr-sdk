import * as echarts from "echarts";
import { ref } from "vue";
import { getDateRange } from "helper/utils";

export default function useViewerChart(
  id: string,
  color: string[],
  t: Function
) {
  const viewerTime = ref(7);
  const viewerOptions = [
    {
      label: t("overview.week"),
      value: 7,
    },
    {
      label: t("overview.month"),
      value: 30,
    },
  ];
  async function onViewChange(val) {
    const chart = echarts.init(document.getElementById(id));
    const dateRange = getDateRange(-val - 1, "MM-dd");
    chart.showLoading();
    setTimeout(() => {
      chart.setOption(getOptions(dateRange.slice(0, dateRange.length - 1)));
      chart.hideLoading();
    }, 888);
  }
  // 图表
  function getOptions(xdatas: string[]) {
    const registors = [];
    const visitors = [];
    const total = [];
    xdatas.forEach(() => {
      const temp1 = Math.floor(Math.random() * 90 + 10);
      registors.push(temp1);
      const temp2 = Math.floor(Math.random() * 90 + 10);
      visitors.push(temp2);
      total.push(temp1 + temp2);
    });
    return {
      color,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
          textStyle: {
            color: "#fff",
          },
        },
      },
      grid: {
        borderWidth: 0,
        top: "12%",
        bottom: "18%",
        left: "8%",
        right: "2%",
        textStyle: {
          color: "#fff",
        },
      },
      legend: {
        x: "3%",
        top: "0%",
        textStyle: {
          color: "#90979c",
        },
        data: [t("overview.registors"), t("overview.tourist")],
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#90979c",
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitArea: {
            show: false,
          },
          axisLabel: {
            interval: 0,
          },
          data: xdatas,
        },
      ],
      yAxis: [
        {
          type: "value",
          splitLine: {
            show: true,
          },
          axisLabel: {
            interval: 0,
          },
        },
      ],
      dataZoom: [
        {
          show: true,
          height: 20,
          xAxisIndex: [0],
          bottom: 8,
          start: 50,
          end: 100,
          handleIcon:
            "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
          handleSize: "110%",
          handleStyle: {
            color: "#d3dee5",
          },
          borderColor: "#90979c",
        },
        {
          type: "inside",
          show: true,
          height: 15,
          start: 1,
          end: 35,
        },
      ],
      series: [
        {
          name: t("overview.registors"),
          type: "bar",
          stack: t("overview.totalCount"),
          barMaxWidth: 28,
          barGap: "8%",
          itemStyle: {
            normal: {
              label: {
                show: true,
                textStyle: {
                  color: "#fff",
                },
                position: "inside",
                formatter: function (p) {
                  return p.value > 0 ? p.value : "";
                },
              },
            },
          },
          data: registors,
        },
        {
          name: t("overview.tourist"),
          type: "bar",
          stack: t("overview.totalCount"),
          itemStyle: {
            normal: {
              barBorderRadius: 0,
              label: {
                show: true,
                position: "inside",
                textStyle: {
                  color: "#fff",
                },
                formatter: function (p) {
                  return p.value > 0 ? p.value : "";
                },
              },
            },
          },
          data: visitors,
        },
        {
          name: t("overview.totalCount"),
          type: "line",
          symbolSize: 10,
          symbol: "circle",
          itemStyle: {
            normal: {
              barBorderRadius: 0,
              label: {
                show: true,
                position: "top",
                formatter: function (p) {
                  return p.value > 0 ? p.value : "";
                },
              },
            },
          },
          data: total,
        },
      ],
    };
  }
  function render() {
    onViewChange(viewerTime.value);
  }
  return {
    render,
    config: {
      viewerTime,
      viewerOptions,
      onViewChange,
    },
  };
}
