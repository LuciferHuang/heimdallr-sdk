<template>
  <div class="panel" :class="{ 'shadow-top': topShadow }">
    <div v-if="title" class="panel-hd">
      <h4 class="title">{{ title }}</h4>
      <span v-if="plugins.includes('more')" class="sub-text" @click="more">{{
        $t("component.more")
      }}</span>
      <span
        v-if="plugins.includes('collapse')"
        class="sub-text"
        @click="collapse = !collapse"
        >{{ collapse ? $t("component.unfold") : $t("component.fold") }}</span
      >
    </div>
    <div class="panel-bd" :class="{ 'collapse-bd': collapse }">
      <span
        v-if="collapse"
        class="collapse-bar el-icon-d-arrow-right"
        :title="$t('component.unfoldBtn')"
        @click="collapse = !collapse"
      ></span>
      <slot v-else />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { Plugin } from "./index";

export default defineComponent({
  props: {
    title: { type: String, default: "" },
    link: { type: String, default: "" },
    plugins: { type: Array as PropType<Plugin[]>, default: () => [] },
    topShadow: { type: Boolean, default: false },
  },
  setup(props) {
    const { t } = useI18n();
    const collapse = ref(false);
    function more() {
      const { link } = props;
      if (!link) {
        ElMessage.warning(t("component.linkWarn"));
      }
      window.open(link);
    }
    return {
      collapse,
      more,
    };
  },
});
</script>
<style lang="scss">
.panel {
  flex: 1;
  background: #fff;
  border-radius: 3px;
  margin-bottom: 20px;
  padding: 20px;
  position: relative;
  box-shadow: 0 3px 8px 0 #dfdfdf;
  &-hd {
    margin-bottom: 12px;
    user-select: none;
    .title {
      padding-left: 12px;
      position: relative;
      margin: 0;
      display: inline;
      &:before {
        content: "";
        width: 4px;
        height: 15px;
        position: absolute;
        left: 0;
        top: 50%;
        background: #409eff;
        transform: translateY(-50%);
      }
    }
    .sub-text {
      color: #409eff;
      cursor: pointer;
      margin-left: 12px;
      font-size: 14px;
      vertical-align: middle;
    }
  }
  .collapse-bd {
    text-align: center;
    position: relative;
    height: 30px;
    overflow: hidden;
    padding: 0;
    .collapse-bar {
      transform: rotate(90deg) translateX(-50%);
      font-size: 28px;
      color: #409eff;
      position: absolute;
      left: 50%;
      animation: updown 1.5s infinite;
      cursor: pointer;
    }
  }
}
.shadow-top {
  box-shadow: 0 -3px 8px 0 #dfdfdf;
}
@keyframes updown {
  0% {
    top: 8px;
  }
  100% {
    top: 20px;
  }
}
</style>
