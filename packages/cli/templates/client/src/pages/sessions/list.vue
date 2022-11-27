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
      @selected="selectHandle"
      @sort-change="sortHandle"
      @page="pageHandle"
      @operate="operateHandle"
    ></page-table>
  </panel>
  <el-drawer v-model="state.isDrawerShow" :title="getDetail().path" size="45%">
    <el-descriptions title="详情" :column="2" border>
      <el-descriptions-item label="用户id">{{ getDetail().user_id }}</el-descriptions-item>
      <el-descriptions-item label="ip地址">{{ getDetail().ip }}</el-descriptions-item>
      <el-descriptions-item label="语言">{{ getDetail().language }}</el-descriptions-item>
      <el-descriptions-item label="省份">{{ getDetail().province }}</el-descriptions-item>
      <el-descriptions-item label="页面标题">{{ getDetail().page_title }}</el-descriptions-item>
      <el-descriptions-item label="页面路径">{{ getDetail().path }}</el-descriptions-item>
      <el-descriptions-item label="进入时间">{{ getDetail().etime }}</el-descriptions-item>
      <el-descriptions-item label="离开时间">{{ getDetail().ltime }}</el-descriptions-item>
    </el-descriptions>
    <br />
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in getDetail().log"
        :key="index"
        :timestamp="item.otime"
      >
        <el-tag class="mg-r-8" :type="tagType(item.type)">{{ item.type }}</el-tag>
        <el-tag :type="tagType(item.type)">{{ item.sub_type }}</el-tag>
        <p>{{ item.data }}</p>
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
  name: 'logList',
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
      formatDate,
    };
  }
});
</script>
<style lang="scss"></style>
