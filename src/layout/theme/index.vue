<template>
  <div
    :class="['app-wrapper', sidebar ? '' : 'style-wrapper']"
    :style="fnStyle(isActive)"
  >
    <Header />
    <main class="app-main">
      <div class="continer-theme">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <!-- :include="['editor']" -->
            <keep-alive v-if="$route.meta.keep" max="3">
              <component v-if="Component" :is="Component" />
              <component v-else :is="CompMap[page.type] || error" />
            </keep-alive>
            <template v-else>
              <component v-if="Component" :is="Component" />
              <component v-else :is="CompMap[page.type] || error" />
            </template>
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  watch,
  reactive,
  defineAsyncComponent,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useState } from "@/utils/hooks/useMapper";
import Header from "./Header.vue";
import error from "@/views/notfound/index.vue";
import editor from "@/views/Editor/index.vue";
import welcome from "@/views/welcome/index.vue";
import personal from "@/views/Personal/index.vue";
import about from "@/views/about/index.vue";

const route = useRoute();
const router = useRouter();

const CompMap = {
  home: welcome, //首页
  personal: personal, //个人中心
  editor: editor, //编辑器
  about: about, //关于
};
const page = reactive({
  type: "",
});

const { isActive, sidebar } = useState({
  isActive: (state) => state.settings.isCollapse,
  sidebar: (state) => state.settings.sidebar,
});

watch(
  () => route.name,
  (val) => {
    page.type = val;
  },
  {
    immediate: true, //立即执行
    // deep:true // 深度监听
  }
);

const fnStyle = (off) => {
  return `margin-left:${off ? "64px" : "200px"}`;
};
</script>
<style lang="scss" scoped>
.style-wrapper {
  margin: 0 !important;
}
.app-wrapper {
  width: 100%;
}
.continer-theme {
  height: 100%;
  background: var(--color-body-bg);
}
.app-main {
  // padding-top: 86px;
  // height: 100vh;
  height: calc(100vh - 86px);
  // margin-top: 86px;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  background: #f0f2f5;
  box-sizing: border-box;
}
</style>
