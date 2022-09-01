<template >
  <div class="sider-bar" :class="{ mini: state.isCollapse }">
    <div class="sider-fold" @click="foldHandler">
      <i class="el-icon-s-fold"></i>
    </div>
    <el-menu
      background-color="#42485b"
      text-color="#fff"
      class="sider-nav"
      unique-opened
      :collapse-transition="false"
      :default-active="state.defaultPath"
      :default-openeds="state.defaultOpen"
      :collapse="state.isCollapse"
    >
      <template v-for="(barItem, barIndex) in barList" :key="barIndex">
        <el-sub-menu :index="barItem.path" v-if="barItem.children">
          <template v-slot:title>
            <i class="mficon" :class="barItem.icon"></i>
            <span class="text">{{ $t(barItem.text) }}</span>
          </template>
          <el-menu-item
            v-for="(subBarItem, subBarIndex) in barItem.children"
            :key="subBarIndex"
            :index="subBarItem.path"
            @click="activeHandle(subBarItem)"
          >
            {{ $t(subBarItem.text) }}
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-if="!barItem.children" :index="barItem.path" @click="activeHandle(barItem)">
          <i class="mficon" :class="barItem.icon"></i>
          <template v-slot:title>
            <span class="text">{{ $t(barItem.text) }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script lang="ts">
import { defineComponent, onBeforeMount, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus';
import { navList } from 'config/others';
import { router } from '@/route';
import { Nav } from '.';

export default defineComponent({
  components: {
    ElMenu,
    ElMenuItem,
    ElSubMenu
  },
  setup() {
    const barList: Nav[] = navList;
    const state = reactive({
      isCollapse: false,
      defaultPath: '',
      defaultOpen: []
    });

    function foldHandler() {
      state.isCollapse = !state.isCollapse;
    }
    function activeHandle(c) {
      const { path } = c;
      if (path) {
        router.push(path);
      }
    }
    function initBar() {
      const { path } = useRoute();
      state.defaultPath = path;
    }
    onBeforeMount(initBar);
    return {
      barList,
      state,
      foldHandler,
      activeHandle
    };
  }
});
</script>
<style lang="scss">
.mini {
  width: 50px !important;
  .el-menu--collapse {
    width: 100% !important;
    .el-submenu__title,
    .el-menu-item .el-tooltip {
      padding: 0 15px !important;
    }
  }
  .el-icon-s-fold {
    transform: rotate(180deg);
  }
}
.sider-bar {
  width: 180px;
  height: 100%;
  background: #292d30;
  color: #fff;
  position: relative;
  text-align: center;
  user-select: none;
  font-size: 13px;
  transition: 0.158s;
  z-index: 2;
  .sider-fold {
    height: 30px;
    background: #4a5064;
    color: #aeb9c2;
    line-height: 30px !important;
    cursor: pointer;
    i {
      font-size: 20px;
      display: inline-block;
      transition: 0.518s;
      vertical-align: middle;
    }
  }
  .sider-nav {
    border: none !important;
    text-align: left;
    .mficon {
      margin-right: 8px;
    }
    .el-sub-menu .el-menu-item {
      background: #292d30 !important;
      min-width: 100%;
    }
    .el-menu-item.is-active {
      color: #fff !important;
      background: #409eff !important;
    }
  }
}
</style>
