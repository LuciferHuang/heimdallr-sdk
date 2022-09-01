<template>
  <header class="top-bar">
    <div class="heade-left" @click="toIndex()">
      <span class="el-icon-watermelon"></span>
      <span class="mg-l-8">{{ $t("name") }}</span>
    </div>
    <div class="heade-right">
      <el-dropdown trigger="click" @command="switchLang">
        <svg
          t="1632512709664"
          viewBox="0 0 1097 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5061"
          width="24"
          height="24"
        >
          <path
            d="M591.945143 650.971429L465.261714 526.043429l1.462857-1.462858a871.862857 871.862857 0 0 0 185.051429-325.193142h146.139429V99.547429H448.804571V0H349.110857v99.547429H0v99.108571h557.056a786.066286 786.066286 0 0 1-158.061714 266.898286 785.115429 785.115429 0 0 1-115.2-166.765715H184.027429a874.276571 874.276571 0 0 0 148.626285 226.962286l-253.586285 250.148572 70.509714 70.509714 249.417143-248.978286 155.062857 154.843429 37.888-101.302857z m280.795428-252.635429h-99.766857L548.571429 995.766857h99.766857l56.100571-149.357714h236.836572l56.100571 149.357714H1097.142857l-224.402286-597.430857z m-130.925714 348.525714L822.857143 531.017143l81.042286 215.771428h-162.084572z"
            p-id="5062"
            fill="#fff"
          ></path>
        </svg>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cn">简体中文</el-dropdown-item>
            <el-dropdown-item command="en">English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="heade-user mg-l-18">
        <el-popover
          popper-class="user-popover"
          placement="bottom"
          trigger="hover"
        >
          <div class="quit" @click="quitLogin">
            {{ $t("component.loginOut") }}
          </div>
          <template #reference>
            <span class="text" v-if="userInfor.name">
              <i class="el-icon-s-custom mg-r-8"></i>
              {{ userInfor.name }}
            </span>
            <span class="text" v-else> {{ $t("component.loginText") }} </span>
          </template>
        </el-popover>
      </div>
    </div>
  </header>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {
  ElPopover,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
} from "element-plus";
import { delCookie, getCookie, setLocalStore } from "helper/utils";
import { LANG_KEY, USER_INFOR_KEY, USER_TOKEN_KEY } from "config/others";
import { router } from "@/route";
import { UserInfor } from ".";

export default defineComponent({
  components: {
    ElPopover,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
  },
  setup() {
    let userInfor: UserInfor;
    try {
      const cookieStr = getCookie(USER_INFOR_KEY);
      userInfor = JSON.parse(cookieStr);
    } catch (error) {
      console.error(error);
    }
    function toIndex() {
      router.push("/home");
      location.reload();
    }
    function quitLogin() {
      delCookie(USER_TOKEN_KEY);
      delCookie(USER_INFOR_KEY);
      router.push("/login");
    }
    function switchLang(lang: string) {
      setLocalStore(LANG_KEY, lang);
      location.reload();
    }
    return {
      userInfor,
      toIndex,
      quitLogin,
      switchLang,
    };
  },
});
</script>
<style lang='scss'>
.top-bar {
  width: 100%;
  height: 70px;
  line-height: 70px;
  background: #373d41;
  color: #fff;
  user-select: none;
  z-index: 30;
  .heade-left {
    margin-left: 8px;
    height: 70px;
    float: left;
    font-weight: 666;
    font-size: 28px;
    .el-icon-watermelon {
      font-size: 32px;
      vertical-align: middle;
    }
    &:hover {
      cursor: pointer;
    }
  }
  .heade-right {
    float: right;
    height: 70px;
    font-size: 16px;
    display: flex;
    align-items: center;
    svg {
      cursor: pointer;
    }
    .heade-user {
      padding: 0 28px;
      border-left: 1px solid #2a2f32;
      border-right: 1px solid #2a2f32;
    }
  }
}
.user-popover {
  text-align: center;
  padding: 12px 0;
  .quit {
    &:hover {
      color: #409eff;
      cursor: pointer;
    }
  }
}
</style>
