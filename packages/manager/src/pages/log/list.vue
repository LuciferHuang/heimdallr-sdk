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
  <el-drawer v-model="state.isDrawerShow" :title="detail.path" size="45%" @close="drawerClose">
    <el-descriptions title="详情" :column="2" border>
      <el-descriptions-item label="类型">
        <el-tag :type="tagTypeFilter(detail.type)">{{ detail.type }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="子类">{{ detail.sub_type }}</el-descriptions-item>
      <el-descriptions-item label="应用">{{ detail.ascription_name }}</el-descriptions-item>
      <el-descriptions-item label="发生时间">{{ formatDate(new Date(detail.ctime)) }}</el-descriptions-item>
      <el-descriptions-item label="页面标题">{{ detail.page_title }}</el-descriptions-item>
      <el-descriptions-item label="页面路径">{{ detail.path }}</el-descriptions-item>
      <el-descriptions-item label="userAgent">{{ detail.user_agent }}</el-descriptions-item>
      <el-descriptions-item label="data">{{ detail.data }}</el-descriptions-item>
    </el-descriptions>
    <template v-if="detail.sub_type === 'error'">
      <br />
      <el-popover :visible="state.codeVisible" placement="bottom" :title="`文件：${codeDetail.file}`" :width="400" trigger="mual">
        <div class="source-content">
          <pre><code>{{ codeDetail.code }}</code></pre>
          <el-tag class="mg-r-8" type="info">行数：{{ codeDetail.line }}</el-tag>
          <el-tag type="info">列数：{{ codeDetail.col }}</el-tag>
        </div>
        <template #reference>
          <el-button :loading="state.codeLoading" @click="showCode">{{ state.codeVisible ? '隐藏错误代码' : '查看错误代码' }}</el-button>
        </template>
      </el-popover>
    </template>
    <br />
    <br />
    <el-timeline>
      <el-timeline-item v-for="(item, index) in detail.breadcrumb" :key="index" :timestamp="formatDate(new Date(parseInt(item.time)))">
        <el-tag effect="dark" :type="levelTypeMap[item.level]" class="mg-r-8">{{ item.type }}</el-tag>
        <el-tag :type="levelTypeMap[item.level]">{{ item.level }}</el-tag>
        <p>{{ item.message }}</p>
      </el-timeline-item>
    </el-timeline>
  </el-drawer>
</template>
<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
// 组件
import {
  ElAffix,
  ElDrawer,
  ElDescriptions,
  ElDescriptionsItem,
  ElTag,
  ElTimeline,
  ElTimelineItem,
  ElPopover,
  ElButton
} from 'element-plus';
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
    ElPopover,
    ElButton,
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
<style lang="scss">
.source-content pre {
  padding: 8px 12px;
  border-radius: 8px;
  background: #f5f7fa;
  margin-top: 0;
}
</style>
