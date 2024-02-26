/**
 * @description 加载所有组件
 * @param  {ReturnType<typeofcreateApp>} app 整个应用的实例
 */
const whiteList = ["SvgIcon", "Stage"]; //组件白名单

/** 自动加载全局组件 */
export function loadAllassembly(app) {
  const files = require.context("./", true, /\.vue$/);
  files.keys().forEach((key) => {
    const name = key.replace(/\.\/(.*)\/index\.vue/, "$1"); // 获取组件名称
    const meter = files(key).default;
    if (!whiteList.includes(name)) {
      app.component(name, meter);
    }
  });
}
