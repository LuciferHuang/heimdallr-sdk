import "element-plus/dist/index.css";
import "@/assets/styles/index.scss";
import { createApp } from "vue";
import App from "@/App.vue";
import { router } from "@/route/index";
import i18n from "@/language/i18n";

const app = createApp(App);
app.use(router).use(i18n).mount("#app");
