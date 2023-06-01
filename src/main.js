import { createApp, version } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { setupStore } from "./pinia";
import { getServerConfig } from "./config";

import "@/styles/index.scss";
import "element-plus/theme-chalk/dark/css-vars.css";
import "v-contextmenu/dist/themes/default.css";

import * as directives from "@/directives";
import { useI18n } from "./plugins/i18n";
import { useElIcons } from "./plugins/icons";
import { loadAllassembly } from "./components";
import { directive } from "v-contextmenu";
import { MotionPlugin } from "@vueuse/motion";
import { registerSvgIcon } from "./assets/icons/index";

const app = createApp(App);
// 自定义指令
Object.keys(directives).forEach((key) => {
  app.directive(key, directives[key]);
});
app.directive("contextmenu", directive);
// 自动加载组件
loadAllassembly(app);
// 自定义SvgIcon组件
registerSvgIcon(app);

getServerConfig(app).then(async (config) => {
  app.use(router);
  app.use(store);
  app.use(useI18n);
  app.use(useElIcons);
  app.use(MotionPlugin);
  app.mount("#app");
});

app.config.errorHandler = (err, instance, info) => {
  // 向追踪服务报告错误
  console.log(err, instance, info);
};
