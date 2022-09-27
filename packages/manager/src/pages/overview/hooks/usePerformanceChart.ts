import * as echarts from "echarts";
import { reactive } from "vue";
import { getDateRange } from "helper/utils";
import http from "@/helper/http";

export default function useViewerChart(
  color: string[]
) {
  const projList = reactive([]);
  async function render() {
    const res = await http.get('/statistic/proj');
    // @ts-ignore
    for (const proj of res) {
      const { id, name } = proj;
      if (id) {
        const dateRange = getDateRange(-8, "MM-dd"); // 一周
        projList.push({
          id,
          name,
          options: getOptions(dateRange.slice(0, dateRange.length - 1))
        });
      }
    }
    setTimeout(() => {
      projList.forEach(({ id, options }) => {
        const chart = echarts.init(document.getElementById(`${id}_chart`));
        chart.showLoading();
        setTimeout(() => {
          chart.setOption(options);
          chart.hideLoading();
        }, 888);
      });
    });
  }
  // 图表
  function getOptions(xdatas: string[]) {
    const fmp = [];
    const err = [];
    const api = [];
    const total = [];
    // mock
    xdatas.forEach(() => {
      const temp1 = Math.floor(Math.random() * 90 + 10);
      fmp.push(temp1);
      const temp2 = Math.floor(Math.random() * 90 + 10);
      err.push(temp2);
      const temp3 = Math.floor(Math.random() * 90 + 10);
      api.push(temp3);
      total.push(temp1 + temp2 + temp3);
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
        data: ['index', 'task'],
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
          name: '异常数',
          type: "bar",
          stack: '总数',
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
          data: err,
        },
        {
          name: '慢页面',
          type: "bar",
          stack: '总数',
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
          data: fmp,
        },
        {
          name: '慢API',
          type: "bar",
          stack: '总数',
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
          data: api,
        },
        {
          name: '总数',
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
  return {
    projList,
    render
  };
}
