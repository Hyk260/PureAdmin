<template>
  <div class="list-container">
    <Sidebar />
    <!-- 聊天列表 -->
    <div class="message-left">
      <!-- 搜索框 -->
      <Search />
      <div :class="['scroll-container', !networkStatus ? 'style-net' : '']">
        <!-- 连接已断开 -->
        <networklink :show="!networkStatus" />
        <!-- 会话列表 -->
        <ConversationList />
      </div>
    </div>
    <!-- 聊天框 -->
    <div
      :class="['message-right', groupDrawer ? 'style-group' : '']"
      id="svgBox"
    >
      <Header />
      <!-- 聊天窗口 -->
      <Chatwin ref="ChatRef" v-show="conver" />
      <div
        id="svgResize"
        @mouseover="dragControllerDiv(ChatRef)"
        v-if="showMsgBox"
      >
        <!-- <div class="back-to-the-bottom" @click="toBottom">
          <el-icon class="svg-left">
            <DArrowLeft />
          </el-icon>
          <span>回到底部</span>
        </div> -->
      </div>
      <!-- 编辑器 -->
      <Editor v-show="showMsgBox" />
    </div>
    <!-- 群详情 -->
    <GroupDetails />
  </div>
</template>

<script setup>
import {
  ref,
  onActivated,
  onDeactivated,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  watch,
  nextTick,
} from "vue";
import { copyFile } from "fs";
import { useState, useGetters } from "@/utils/hooks/useMapper";
import { dragControllerDiv } from "./utils/utils";
import { useStore } from "vuex";

import Editor from "./Editor.vue";
import Sidebar from "./Sidebar.vue";
import Search from "./components/Search.vue";
import Header from "./components/Header.vue";
import Chatwin from "./Chatwin.vue";
import GroupDetails from "./GroupDetails.vue";
import networklink from "./components/networklink.vue";
import ConversationList from "./ConversationList.vue";

const ChatRef = ref(null);
const showGroup = ref(false);
const { state, dispatch, commit } = useStore();

const { toAccount } = useGetters(["toAccount"]);
const {
  networkStatus,
  conver,
  user,
  groupDrawer,
  showMsgBox,
  conversationList,
} = useState({
  networkStatus: (state) => state.conversation.networkStatus,
  user: (state) => state.data.user,
  conver: (state) => state.conversation.currentConversation,
  showMsgBox: (state) => state.conversation.showMsgBox,
  groupDrawer: (state) => state.groupinfo.groupDrawer,
  conversationList: (state) => state.conversation.conversationList,
});

const setNetwork = () => {
  const status = navigator?.onLine;
  commit("SET_NETWORK_STATUS", status);
};

const monitoring = (off) => {
  if (off) {
    window.addEventListener("online", setNetwork);
    window.addEventListener("offline", setNetwork);
  } else {
    window.removeEventListener("online", setNetwork);
    window.removeEventListener("offline", setNetwork);
  }
};

onActivated(() => {
  console.log("onActivated");
  commit("updataScroll");
});
onDeactivated(() => {
  commit("setgroupDrawer", false);
  console.log("onDeactivated");
});
onMounted(() => {
  monitoring(true);
});
onUnmounted(() => {
  monitoring(false);
});
</script>

<style lang="scss" scoped>
.list-container {
  width: 100%;
  height: 100%;
  display: flex;
}
.message-left {
  width: 280px;
}
.message-right {
  background: #fff;
  border-left: 1px solid rgba(0, 0, 0, 0.09);
  width: calc(100% - 280px - 68px);
  height: 100%;
  position: relative;
  overflow: hidden;
  min-width: 274px;
}
.style-group {
  width: calc(100% - 280px - 68px - 220px);
}
.scroll-container {
  height: calc(100% - 60px);
  position: relative;

  :deep(.is-active) {
    background: #f0f2f5;
  }
  :deep(.is-actives) {
    background: rgba(0, 0, 0, 0.03);
  }
}
.style-net {
  height: calc(100% - 60px - 34px);
}

#svgResize {
  position: relative;
  height: 5px;
  width: 100%;
  cursor: s-resize;
  // cursor: row-resize;
  font-size: 12px;
}
:deep(.group-chat-switch) {
  position: absolute;
  right: 0;
  background: rgb(218, 218, 218);
  border-radius: 2px 0 0 2px;
  width: 10px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
    background: rgb(137, 210, 243);
  }
  .el-icon {
    font-size: 14px !important;
    color: #fff;
  }
}
.back-to-the-bottom {
  position: absolute;
  width: 70px;
  height: 20px;
  background: #17a7f6;
  top: -30px;
  right: 15px;
  z-index: 1;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  cursor: pointer;
}
</style>
