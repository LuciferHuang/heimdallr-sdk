<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ElConfigProvider } from "element-plus";
import cn from "element-plus/lib/locale/lang/zh-cn";
import en from "element-plus/lib/locale/lang/en";

import { getLocalStore } from "helper/utils";
import { LANG_KEY } from "config/others";

export default defineComponent({
  components: {
    ElConfigProvider,
  },
  setup() {
    const localeMap = {
      cn,
      en,
    };
    const lang = getLocalStore(LANG_KEY) || "cn";
    return {
      locale: localeMap[lang],
    };
  },
});
</script>
