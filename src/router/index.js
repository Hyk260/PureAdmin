import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import { ACCESS_TOKEN } from "@/store/constants";
import { setPageTitle } from "@/utils/common";
import NProgress from "@/utils/progress";
import storage from "@/utils/localforage/index";

const routes = [];
const files = require.context("./modules/", false, /\.js$/);
files.keys().forEach((key) => {
  routes.push(...files(key).default);
});

let isF = false;
const historyMode = {
  history: createWebHistory(),
  hash: createWebHashHistory(),
};

const router = createRouter({
  history: historyMode[process.env.VUE_APP_ROUTER_HISTORY],
  routes,
  /*
   * 自定义路由切换时页面如何滚动
   * 参考 https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html
   */
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top = document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  },
});

router.beforeEach((to, from, next) => {
  if (from.path === to.path) return;
  setPageTitle(to.meta.title);
  const token = storage.get(ACCESS_TOKEN);
  if (token) {
    NProgress.start();
    if (isF) {
      next();
    } else {
      isF = true;
      next({ ...to, replace: true });
    }
  } else {
    if (to.path !== "/login") {
      next({ path: "/login" });
    } else {
      next();
    }
  }
});

router.afterEach((to, from, next) => {
  NProgress.done();
});

/** setup vue router. - [安装vue路由] */
export async function setupRouter(app) {
  app.use(router);
  await router.isReady();
}

export default router;
