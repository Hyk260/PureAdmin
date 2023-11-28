import router from "@/router";
import { ElMessage } from "element-plus";
import TIMProxy from "@/utils/IM";
import { login, register, logout, getMenu } from "@/api/node-admin-api/index";
import chat from "@/utils/im-sdk/tim";
import emitter from "@/utils/mitt-bus";
import { verification } from "@/utils/message/index";
const timProxy = new TIMProxy();
const user = {
  state: {
    timProxy,
    message: null,
    showload: false, // 登录按钮加载状态
    currentPage: 0,
    currentUserProfile: {}, // IM用户信息
  },
  mutations: {
    setCurrentPage(state, num) {
      state.currentPage = num;
    },
    setCurrentUserProfile(state, profile) {
      state.currentUserProfile = profile;
    },
    reset(state) {
      Object.assign(state, {
        showload: false,
        currentPage: 0,
        currentUserProfile: {},
      });
    },
    showMessage(state, options) {
      if (state.message) {
        state.message.close();
      }
      state.message = ElMessage({
        message: options.message,
        type: options.type || "success",
        duration: options.duration || 2000,
        // offset: 40,
      });
    },
  },
  actions: {
    // 注册
    async REGISTER({ state }, data) {
      const result = await register(data);
    },
    // 登录
    async LOG_IN({ state, commit, dispatch }, data) {
      const { code, msg, result } = await login(data);
      console.log({ code, msg, result }, "登录信息");
      if (code == 200) {
        window.TIMProxy.init();
        dispatch("GET_MENU");
        dispatch("TIM_LOG_IN", {
          userID: result.username,
          userSig: result.userSig,
        });
        commit("UPDATE_USER_INFO", { key: "user", value: result });
        commit("ACCOUNT_INFORMATION", data);
        setTimeout(() => {
          router.push("/welcome");
        }, 1000);
      } else {
        verification(code, msg);
      }
    },
    // 退出登录
    async LOG_OUT({ state, commit, dispatch }) {
      logout();
      emitter.all.clear();
      dispatch("TIM_LOG_OUT");
      router.push("/login");
    },
    // 登录im
    async TIM_LOG_IN({ state, commit, dispatch }, user) {
      const { code, data } = await chat.login(user);
      if (code == 0) {
        console.log("[chat] im登录成功 login", data);
      } else {
        dispatch("LOG_OUT");
      }
    },
    // 退出im
    async TIM_LOG_OUT({ commit, dispatch }) {
      const { code, data } = await chat.logout();
      if (code == 0) {
        console.log("[chat] im退出登录 logout", data);
        commit("reset");
        // 清除消息记录
        commit("SET_HISTORYMESSAGE", { type: "CLEAR_HISTORY" });
        dispatch("CLEAR_EL_TAG"); // 清除 eltag 标签
      }
    },
    // 重新登陆
    LOG_IN_AGAIN({ state, rootState, dispatch }) {
      const { username: userID, userSig } = rootState.data.user || {};
      console.log({ userID, userSig }, "LOG_IN_AGAIN");
      if (!userID || !userSig) dispatch("LOG_OUT");
      setTimeout(() => {
        window.TIMProxy.init();
        dispatch("TIM_LOG_IN", { userID, userSig });
      }, 500);
    },
    // 菜单列表
    async GET_MENU({ dispatch }) {
      let menu = await getMenu();
      dispatch("updateRoute", menu);
    },
  },
};

export default user;
