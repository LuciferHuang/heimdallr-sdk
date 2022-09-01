<template>
  <filter-group :filters="filterFormItems" v-model="state.form" @search="loadData"></filter-group>
  <panel class="mg-t-18">
    <el-affix :offset="88">
      <table-oprate class="mg-b-12" :button-grop="tableOprates" @trigger="batchHandle"></table-oprate>
    </el-affix>
    <page-table
      selectable
      :table-config="tableConfig"
      :datas="state.tableData"
      :all-items="state.allItems"
      :filter-map="filterMap"
      @selected="selectHandle"
      @sort-change="sortHandle"
      @page="pageHandle"
      @operate="operateHandle"
    ></page-table>
  </panel>
  <el-drawer v-model="state.isDrawerShow" :title="state.detail.path">
    <el-descriptions title="详情" :column="2" border>
      <el-descriptions-item label="类型">
        <el-tag :type="tagTypeFilter(state.detail.type)">{{ state.detail.type }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="子类">{{ state.detail.sub_type }}</el-descriptions-item>
      <el-descriptions-item label="应用">{{ state.detail.ascription_name }}</el-descriptions-item>
      <el-descriptions-item label="发生时间">{{ formatDate(new Date(state.detail.ctime)) }}</el-descriptions-item>
      <el-descriptions-item label="页面标题">{{ state.detail.page_title }}</el-descriptions-item>
      <el-descriptions-item label="页面路径">{{ state.detail.path }}</el-descriptions-item>
      <el-descriptions-item label="userAgent">{{ state.detail.user_agent }}</el-descriptions-item>
      <el-descriptions-item label="data">{{ state.detail.data }}</el-descriptions-item>
    </el-descriptions>
    <br />
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in state.detail.breadcrumb"
        :key="index"
        :timestamp="formatDate(new Date(parseInt(item.time)))"
      >
        <el-tag>{{ item.type }}</el-tag>
        {{ item.data }}
      </el-timeline-item>
    </el-timeline>
  </el-drawer>
</template>
<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
// 组件
import { ElAffix, ElDrawer, ElDescriptions, ElDescriptionsItem, ElTag, ElTimeline, ElTimelineItem } from 'element-plus';
// 配置
import useConfig from './hooks/useListConfig';
// 表格功能
import useTableFeature from './hooks/useListTable';
import { formatDate } from 'helper/utils';

export default defineComponent({
  components: {
    ElAffix,
    ElDrawer,
    ElDescriptions,
    ElDescriptionsItem,
    ElTag,
    ElTimeline,
    ElTimelineItem,
    filterGroup: defineAsyncComponent(() => import('components/filterGroup/index.vue')),
    tableOprate: defineAsyncComponent(() => import('components/tableOprate/index.vue')),
    pageTable: defineAsyncComponent(() => import('components/pageTable/index.vue')),
    panel: defineAsyncComponent(() => import('components/panel/index.vue'))
  },
  setup() {
    // 表格功能
    const tableFeature = useTableFeature();
    const { loadData } = tableFeature;
    loadData();
    // 供模板使用
    return {
      ...useConfig(), // 引入配置
      ...tableFeature,
      formatDate
    };
  }
});
</script>
<style lang="scss"></style>
