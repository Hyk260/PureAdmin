<template>
  <el-drawer
    v-model="drawer"
    size="360px"
    :title="t('common.setup')"
    :with-header="true"
    :show-close="true"
  >
    <ul class="setting w-full">
      <li>
        <span>{{ t("common.closeSidebar") }}</span>
        <el-switch
          v-model="sidebar"
          inline-prompt
          inactive-color="#a6a6a6"
          :active-icon="Check"
          :inactive-icon="Close"
          @change="greyChange"
        />
      </li>
      <!-- <li>
        <span>{{ t("common.sidebarLogo") }}</span>
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
      </li> -->
      <li>
        <span>{{ t("common.theme") }}</span>
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
        <span>{{ t("common.language") }}</span>
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
import { computed, reactive, ref, watch } from "vue";
import { useState } from "@/utils/hooks/useMapper";
import { useStore } from "vuex";
import { changeAppearance } from "@/utils/common";
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();

const options = computed(() => {
  return [
    {
      value: "auto",
      label: t("common.auto"),
    },
    {
      value: "light",
      label: t("common.light"),
    },
    {
      value: "dark",
      label: t("common.dark"),
    },
  ];
});

const languages = [
  {
    value: "zh-CN",
    label: "简体中文",
  },
  {
    value: "en",
    label: "English",
  },
];

const { dispatch, commit } = useStore();
const { sidebar, appearance, lang, setswitch } = useState({
  sidebar: (state) => !state.settings.sidebar,
  appearance: (state) => state.settings.appearance,
  setswitch: (state) => state.settings.setswitch,
  lang: (state) => state.settings.lang,
});

const greyChange = (val) => {
  commit("UPDATE_USER_SETUP", {
    key: "sidebar",
    value: !val,
  });
};

const drawer = computed({
  get() {
    return setswitch.value;
  },
  set(val) {
    commit("UPDATE_USER_SETUP", {
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
  commit("UPDATE_USER_SETUP", {
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
  commit("UPDATE_USER_SETUP", {
    key: "lang",
    value: val,
  });
  locale.value = val;
};
</script>

<style lang="scss" scoped>
.setting li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  .el-select {
    max-width: 230px;
  }
}
</style>
