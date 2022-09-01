import { createI18n } from "vue-i18n";
import messages from "./index";
import { getLocalStore } from "helper/utils";
import { LANG_KEY } from "config/others";

const lang = getLocalStore(LANG_KEY) || "cn";

const i18n = createI18n({
  legacy: false,
  locale: lang,
  messages,
});

export default i18n;
