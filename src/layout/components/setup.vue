<template>
  <el-drawer
    v-model="drawer"
    size="285px"
    title="设置"
    :with-header="true"
    :show-close="true"
  >
    <ul class="setting width-full">
      <li>
        <span>关闭侧边栏</span>
        <el-switch
          v-model="sidebar"
          inline-prompt
          inactive-color="#a6a6a6"
          active-text="开"
          inactive-text="关"
          @change="greyChange"
        />
      </li>
      <li>
        <span>侧边栏logo</span>
        <el-switch
          v-model="logoVal"
          inline-prompt
          inactive-color="#a6a6a6"
          active-text="开"
          inactive-text="关"
          @change="LogoChange"
          :active-icon="Check"
          :inactive-icon="Close"
        />
      </li>
      <li>
        <span>主题</span>
        <el-select v-model="themecolor" placeholder="主题颜色">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </li>
      <li>
        <span>语言</span>
        <el-select v-model="language" placeholder="选择语言">
          <el-option
            v-for="item in languages"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </li>
    </ul>
  </el-drawer>
</template>

<script setup>
import { Close, Check } from "@element-plus/icons-vue";
import { computed, ref, watch } from "vue";
import { useState } from "@/utils/hooks/useMapper";
import { useStore } from "vuex";
import { changeAppearance } from "@/utils/common";
import { CircleCloseFilled } from "@element-plus/icons-vue";
import { useDark, useToggle } from "@vueuse/core";
import i18n from "@/locales";

const options = [
  {
    value: "auto",
    label: "自动",
  },
  {
    value: "light",
    label: "浅色",
  },
  {
    value: "dark",
    label: "深色",
  },
];

const languages = [
  {
    value: "zh",
    label: "中文",
  },
  {
    value: "en",
    label: "英文",
  },
];

const { state, dispatch, commit } = useStore();
const { sidebar, logoVal, appearance, lang, setswitch } = useState({
  sidebar: (state) => !state.settings.sidebar,
  logoVal: (state) => !state.settings.logoIcon,
  appearance: (state) => state.settings.appearance,
  setswitch: (state) => state.settings.setswitch,
  lang: (state) => state.settings.lang,
});

const LogoChange = (val) => {
  commit("updateSettings", {
    key: "logoIcon",
    value: !val,
  });
};

const greyChange = (val) => {
  commit("updateSettings", {
    key: "sidebar",
    value: !val,
  });
};

const drawer = computed({
  get() {
    return setswitch.value;
  },
  set(val) {
    commit("updateSettings", {
      key: "setswitch",
      value: false,
    });
  },
});

const themecolor = computed({
  get() {
    return appearance.value;
  },
  set(val) {
    ThemeColorChange(val);
  },
});

const ThemeColorChange = (val) => {
  commit("updateSettings", {
    key: "appearance",
    value: val,
  });
  changeAppearance(val);
};

const language = computed({
  get() {
    return lang.value;
  },
  set(val) {
    languageChange(val);
  },
});

const languageChange = (val) => {
  commit("updateSettings", {
    key: "lang",
    value: val,
  });
  i18n.global.locale = val;
};
</script>

<style lang="scss" scoped>
.setting li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}
</style>
