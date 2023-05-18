import storage from "storejs";
import { USER_DATA, SET_UP } from "@/store/mutation-types";

// 默认设置
const defaultSettings = {
  lang: "zh-CN", // 默认语言
  sidebar: true, // 侧边栏隐藏
  logoIcon: true, // login图标
  appearance: "light", // 主题颜色
  isCollapse: true, // 侧边栏是否折叠
  setswitch: false, // 设置按钮开关
};

// 默认用户信息
const defaultData = {
  verifyCode: "",
  user: null,
  token: null,
  elTag: [], // Tag 标签
  Routingtable: null, // 路由表
};

// 获取本地存储中的设置和用户信息，如果没有则使用默认值
const settings = storage.get(SET_UP) || defaultSettings;
const data = storage.get(USER_DATA) || defaultData;

export default {
  settings,
  data,
};
