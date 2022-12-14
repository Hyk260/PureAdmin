import { createStore } from "vuex";
import { useI18n } from "vue-i18n";

import saveToLocalStorage from "./plugins/localStorage"; // 自定义插件
import { changeAppearance } from "@/utils/common";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";
import state from "./state";

const modules = {};
const plugins = [saveToLocalStorage];
const requireModules = require.context("./modules/", true, /index\.(ts|js)$/iu);

/**
 * @description: 自动导入模块文件中的所有vuex模块
 * @param {*}
 * @return {*}
 */
requireModules.keys().forEach((filePath) => {
  const modular = requireModules(filePath);
  const name = filePath.replace(/\.\/|\/index.(js|ts)/g, "");
  modules[name] = {
    // namespaced: true,
    ...modular.default,
  };
});

console.log(modules, "modules");

const store = createStore({
  modules,
  state,
  mutations,
  actions,
  getters,
  // 自定义属性
  plugins,
});

// 刷新页面保存当前主题色
changeAppearance(store.state.settings.appearance);

console.log(store, "store实例");
export default store;
