"use strict";
import TIM from "tim-js-sdk";
import tim from "@/utils/im-sdk/tim";
import storage from "storejs";
import store from "@/store";
import emitter from "@/utils/mitt-bus";

function kickedOutReason(type) {
  switch (type) {
    case TIM.TYPES.KICKED_OUT_MULT_ACCOUNT:
      return "由于多实例登录";
    case TIM.TYPES.KICKED_OUT_MULT_DEVICE:
      return "由于多设备登录";
    case TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED:
      return "由于 userSig 过期";
    default:
      return "";
  }
}
function checkoutNetState(state) {
  switch (state) {
    case TIM.TYPES.NET_STATE_CONNECTED:
      return { message: "已接入网络", type: "success" };
    case TIM.TYPES.NET_STATE_CONNECTING:
      return { message: "当前网络不稳定", type: "warning" };
    case TIM.TYPES.NET_STATE_DISCONNECTED:
      store.dispatch("LOG_OUT");
      return { message: "当前网络不可用", type: "error" };
    default:
      return "";
  }
}

export default class TIMProxy {
  // 静态方法
  constructor() {
    this.version = TIM.VERSION; // im版本号
    this.userProfile = {}; // IM用户信息
    this.isSDKReady = false; // TIM SDK 是否 ready
    this.userID = "";
    this.userSig = "";
    this.tim = null; // TIM实例
    this.TIM = null; // TIM命名空间
    this.once = false;
    this.test = {};
    Object.defineProperty(this, "test", {
      configurable: true, // 可配置
      enumerable: false, // 不可枚举
      value: 1, // 赋值
      writable: true, // 可写
    });
    // 暴露给全局
    window.TIMProxy = new Proxy(this, {
      set(target, key, val) {
        console.log(key, val);
        return Reflect.set(target, key, val);
      },
      get(target, key) {
        const value = Reflect.get(target, key);
        // console.log(value);
        return value;
      },
    });
  }
  // 缓存IM信息
  saveSelfToLocalStorage() {
    const player = {};
    for (const [key, value] of Object.entries(this)) {
      player[key] = value;
    }
    console.log(player);
    // storage.set("player", player);
  }
  // 更新IM信息
  loadSelfFromLocalStorage() {
    const player = storage.get("player");
    if (!player) return;
    for (const [key, value] of Object.entries(player)) {
      this[key] = value;
    }
  }
  // 初始化
  init() {
    if (this.once) return;
    console.log("TIMProxy init");
    this.once = true;
    this.tim = tim;
    this.TIM = TIM;
    // 监听SDK
    this.initListener();
  }
  initListener() {
    // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
    tim.on(TIM.EVENT.SDK_READY, this.onReadyStateUpdate);
    // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
    tim.on(TIM.EVENT.SDK_NOT_READY, this.onReadyStateUpdate);
    // 收到会话列表更新通知
    tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, this.onUpdateConversationList);
    // 收到推送的单聊、群聊、群提示、群系统通知的新消息
    tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage);
    // 收到消息被撤回的通知
    tim.on(TIM.EVENT.MESSAGE_REVOKED, this.onMessageRevoked);
    // 群组列表更新
    tim.on(TIM.EVENT.GROUP_LIST_UPDATED, this.onUpdateGroupList);
    // 被踢出
    tim.on(TIM.EVENT.KICKED_OUT, this.onKickOut);
    // SDK内部出错
    tim.on(TIM.EVENT.ERROR, this.onError);
    // 网络监测
    tim.on(TIM.EVENT.NET_STATE_CHANGE, this.onNetStateChange);
    // 收到好友申请列表更新通知
    tim.on(TIM.EVENT.FRIEND_APPLICATION_LIST_UPDATED, this.onFriendApplicationListUpdated);
    // 收到好友分组列表更新通知
    tim.on(TIM.EVENT.FRIEND_GROUP_LIST_UPDATED, this.onFriendGroupListUpdated);
    // 已订阅用户或好友的状态变更（在线状态或自定义状态）时触发。
    tim.on(TIM.EVENT.USER_STATUS_UPDATED, this.onUserStatusUpdated);
  }
  onReadyStateUpdate({ name }) {
    const isSDKReady = name === TIM.EVENT.SDK_READY;
    store.commit("toggleIsSDKReady", isSDKReady);
    if (!isSDKReady) return;
    store.dispatch("GET_MY_PROFILE");
  }
  onUpdateConversationList({ data, name }) {
    console.log(data, "会话列表更新");
    store.dispatch("GET_TOTAL_UNREAD_MSG");
    store.commit("SET_CONVERSATION", {
      type: "REPLACE_CONV_LIST",
      payload: data,
    });
  }
  onReceiveMessage({ data, name }) {
    const convId = store.state.conversation?.currentConversation?.conversationID;
    const userProfile = store.state.user.currentUserProfile;
    const { atUserList } = data[0];
    console.log(convId, "当前会话ID");
    console.log(data, "收到新消息");
    if (atUserList.length > 0) {
      let userId = userProfile?.userID;
      let off = atUserList.includes(userId);
      let all = atUserList.includes(TIM.TYPES.MSG_AT_ALL);
      if (off || all) {
        window.TIMProxy.notifyMe(data[0]);
      }
    }
    if (!convId) return;
    // 收到新消息 且 不为当前选中会话 更新对应ID消息
    if (data?.[0].conversationID !== convId) {
      store.commit("SET_HISTORYMESSAGE", {
        type: "UPDATE_CACHE",
        payload: {
          convId: data?.[0].conversationID,
          message: data,
        },
      });
      return;
    }
    // 更新当前会话消息
    store.commit("SET_HISTORYMESSAGE", {
      type: "UPDATE_MESSAGES",
      payload: {
        convId: convId,
        message: data[0],
      },
    });
    // 更新滚动条位置到底部
    store.commit("updataScroll");
  }
  onMessageRevoked({ data, name }) {
    console.log(data, "撤回消息");
    store.commit("SET_HISTORYMESSAGE", {
      type: "RECALL_MESSAGE",
      payload: {
        convId: data[0].conversationID,
        message: data,
      },
    });
  }
  onUpdateGroupList({ data, name }) {
    console.log(data, "群组列表更新");
    // store.commit("updateGroupList", data[0]);
  }
  onKickOut({ data }) {
    const message = kickedOutReason(data.type);
    store.commit("showMessage", {
      message: `${message}被踢出，请重新登录。`,
      type: "error",
    });
    store.dispatch("LOG_OUT");
  }
  onError({ data }) {
    console.log(data);
    if (data.message !== "Network Error") {
      store.commit("showMessage", {
        message: data.message,
        type: "error",
      });
    }
  }
  onNetStateChange({ data }) {
    store.commit("showMessage", checkoutNetState(data.state));
  }
  onFriendApplicationListUpdated(event) {
    console.log(event);
  }
  onFriendGroupListUpdated(event) {
    console.log(event);
  }
  onUserStatusUpdated(event) {
    console.log(event);
  }
  /**
   * 使用 window.Notification 进行全局的系统通知
   * 本地调试仅支持 http://localhost:8080/
   * https://developer.mozilla.org/zh-CN/docs/Web/API/notification
   * @param {Message} message
   */
  notifyMe(message) {
    // 需检测浏览器支持和用户授权
    if (!("Notification" in window)) {
      return;
    } else if (window.Notification.permission === "granted") {
      this.handleNotify(message);
    } else if (window.Notification.permission !== "denied") {
      window.Notification.requestPermission().then((permission) => {
        // 如果用户同意，就可以向他们发送通知
        if (permission === "granted") {
          this.handleNotify(message);
        }
      });
    }
  }
  handleNotify(message) {
    const notification = new window.Notification("有人提到了你", {
      icon: "https://web.sdk.qcloud.com/im/assets/images/logo.png",
      body: message.payload.text,
    });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}
