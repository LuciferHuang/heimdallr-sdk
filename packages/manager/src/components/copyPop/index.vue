<template>
  <el-popover
    popper-class="copy-popover"
    placement="bottom-start"
    v-model:visible="show"
    trigger="manual"
  >
    <p class="copy-popover-tip">
      <i class="el-icon-circle-check"></i>
      {{ $t("component.copySuccess") }}
    </p>
    <template #reference>
      <i class="copy-btn el-icon-document-copy" :class="cusIconClass" @click="handleClick"> </i>
    </template>
  </el-popover>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { ElPopover } from "element-plus";
import { copy } from "helper/utils";

export default defineComponent({
  components: {
    ElPopover,
  },
  props: {
    duration: { type: Number, default: 2000 },
    copy: { type: String, default: "" },
    cusIconClass: { type: String, default: "" },
    callback: { default: null },
  },
  setup({ callback, duration }) {
    const show = ref(false);
    let timmerId = 0;
    watch(show, (value) => {
      if (!value) {
        window.clearTimeout(timmerId);
      }
    });
    function handleClick() {
      if (typeof callback === "function") {
        callback();
        return;
      }
      copy(this.copy);
      successHandle();
    }
    function successHandle() {
      show.value = true;
      if (show.value) {
        timmerId = window.setTimeout(() => {
          show.value = false;
        }, duration);
      }
    }
    return {
      show,
      handleClick,
    };
  },
});
</script>
<style lang="scss">
.copy-btn {
  vertical-align: middle;
  color: #409eff;
  font: {
    weight: bold;
    size: 15px;
  }
  &:hover {
    color: #79bcff;
    cursor: pointer;
  }
}
.copy-popover {
  width: auto !important;
  &-tip {
    white-space: nowrap;
    display: flex;
    align-items: center;
    margin: 0;
    .el-icon-circle-check {
      margin-right: 5px;
      color: #67c23a;
      font: {
        size: 16px;
        weight: bold;
      }
    }
  }
}
</style>
