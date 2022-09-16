<template>
  <div class="overview-wrap">
    <panel title="总览" class="view-box">
      <div class="view-detail">
        <div class="view-detail-bar">
          <div>{{ formateNum(total.views) }}</div>
          <div>异常问题</div>
        </div>
        <div class="view-detail-bar">
          <div>{{ formateNum(total.contents) }}</div>
          <div>性能问题</div>
        </div>
      </div>
    </panel>
    <panel title="性能" class="view-box">
      <el-select class="view-option" size="small" v-model="viewerTime" @change="onViewChange">
        <el-option v-for="item in viewerOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <div id="viewerChart" class="view-chart"></div>
    </panel>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import panel from 'components/panel/index.vue';
import { formateNum } from 'helper/utils';
import useViewerChart from './hooks/usePerformanceChart';
import useTotalChart from './hooks/useTotalChart';

export default defineComponent({
  components: {
    panel,
    ElSelect,
    ElOption
  },
  setup() {
    const chartColors = ['#37A2DA', '#67E0E3', '#9FE6B8', '#32C5E9', '#FFDB5C'];
    // 总览
    const { total } = useTotalChart(chartColors);
    // 访客
    const { config: viewerConfig, render: viewerRender } = useViewerChart('viewerChart', chartColors);
    onMounted(() => {
      viewerRender();
    });
    return {
      total,
      formateNum,
      ...viewerConfig
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
      width: 600px;
      height: 300px;
      clear: both;
      margin: 0 auto;
    }
    &:nth-of-type(1) .view-chart {
      width: 500px;
      height: 200px;
    }
    &:nth-of-type(2) .view-chart {
      width: 700px;
    }
    .view-detail {
      display: flex;
      justify-content: space-between;
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
