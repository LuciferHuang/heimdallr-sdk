<template>
  <div class="overview-wrap">
    <panel title="总览" class="view-box">
      <div class="view-detail">
        <div class="view-detail-bar">
          <div>{{ formateNum(total.err) }}</div>
          <div>异常数</div>
        </div>
        <div class="view-detail-bar">
          <div>{{ formateNum(total.fmp) }}</div>
          <div>慢页面数</div>
        </div>
        <div class="view-detail-bar">
          <div>{{ formateNum(total.api) }}</div>
          <div>慢API数</div>
        </div>
      </div>
    </panel>
    <panel v-for="proj in projList" :key="proj.id" :title="proj.name" class="view-box">
      <div :id="`${proj.id}_chart`" class="view-chart"></div>
    </panel>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import panel from 'components/panel/index.vue';
import { formateNum } from 'helper/utils';
import useViewerChart from './hooks/usePerformanceChart';
import useTotalChart from './hooks/useTotalChart';

export default defineComponent({
  components: {
    panel,
  },
  setup() {
    const chartColors = ['#37A2DA', '#67E0E3', '#9FE6B8', '#32C5E9', '#FFDB5C'];
    // 总览
    const { total } = useTotalChart();
    // 应用
    const { projList = [], render } = useViewerChart(chartColors);
    render();
    return {
      total,
      formateNum,
      projList
    };
  }
});
</script>
<style lang="scss" scoped>
.overview-wrap {
  display: flex;
  flex-wrap: wrap;
  .view-box {
    margin-right: 10px;
    padding: 10px;
    .view-option {
      width: 88px;
      float: right;
    }
    .view-chart {
      width: 800px;
      height: 300px;
      clear: both;
      margin: 0 auto;
    }
    .view-detail {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 28px;
      &-bar {
        width: 50%;
        text-align: center;
        div {
          font-size: 18px;
          color: #90979c;
        }
        div:nth-of-type(1) {
          font: {
            size: 28px;
            weight: bold;
          }
          padding: 18px 0;
        }
        &:nth-of-type(1) div:nth-of-type(1) {
          color: #37a2da;
        }
        &:nth-of-type(2) div:nth-of-type(1) {
          color: #9fe6b8;
        }
        &:nth-of-type(3) div:nth-of-type(1) {
          color: #ffdb5c;
        }
      }
    }
  }
}
</style>
