<template>
  <div class="session-play">
    <div class="mg-b-18">
      <el-icon class="head-arrow" size="18" @click="back"><ArrowLeftBold /></el-icon>
      <span class="detail-title">{{ state.title }}</span>
    </div>
    <el-row>
      <el-col :span="12">
        <el-timeline>
          <el-timeline-item v-for="(item, index) in state.logs" :key="index" :timestamp="item.otime">
            <el-tag class="mg-r-8" :type="tagType(item.type)">{{ item.type }}</el-tag>
            <el-tag :type="tagType(item.type)">{{ item.sub_type }}</el-tag>
            <p>{{ item.data }}</p>
          </el-timeline-item>
        </el-timeline>
      </el-col>
      <el-col :span="12">
        <div id="sessionPlayWrap"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';
import { ArrowLeftBold } from '@element-plus/icons-vue';
import { ElIcon, ElRow, ElCol, ElTimeline, ElTimelineItem } from 'element-plus';
import { router } from '@/route/index';
import { EventTypes } from '@heimdallr-sdk/types';
import http from '@/helper/http';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'sessionPlay',
  components: {
    ElIcon,
    ElRow,
    ElCol,
    ElTimeline,
    ElTimelineItem,
    ArrowLeftBold
  },
  setup() {
    const state = reactive({
      logs: [],
      title: ''
    });
    const {
      params: { id }
    } = useRoute();
    const url = `/session/list?psize=1&pindex=1&id=${id}`;
    http
      .get(url)
      .then((res: any) => {
        const { list = [] } = res;
        try {
          const [{ events = '', path = '' } = {}] = list;
          const eventsObj = JSON.parse(events);
          state.title = path;
          new rrwebPlayer({
            target: document.getElementById('sessionPlayWrap'),
            // 配置项
            props: {
              events: eventsObj
            }
          });
        } catch (error) {
          console.error(error);
        }
      })
      .catch(() => {});
    // onMounted(() => {
    //   new rrwebPlayer({
    //     target: document.getElementById('sessionPlayWrap'),
    //     // 配置项
    //     props: {
    //       events: state.events
    //     }
    //   });
    // });
    return {
      back: () => {
        router.back();
      },
      tagType: (type: EventTypes) => {
        switch (type) {
          case EventTypes.ERROR:
          case EventTypes.VUE:
            return 'danger';
          case EventTypes.CUSTOMER:
            return '';
          default:
            return 'info';
        }
      },
      state
    };
  }
});
</script>
<style lang="scss">
.session-play {
  flex: 1;
  background: #fff;
  border-radius: 3px;
  margin-bottom: 20px;
  padding: 20px;
  position: relative;
  box-shadow: 0 3px 8px 0 #dfdfdf;
  font-size: 14px;
  .head-arrow {
    margin-right: 12px;
    cursor: pointer;
  }
  .detail-title {
    font: {
      weight: bold;
      size: 20px;
    }
  }
  #sessionPlayWrap {
    position: relative;
    width: 100%;
    min-width: 1024px;
    height: 656px;
  }
}
</style>
