<template>
  <div>
    <template v-for="item in tree" :key="item.id">
      <!-- 一级菜单 -->
      <el-menu-item
        :class="{ 'active-item': $route.name === item.name }"
        v-if="fn(item)"
        :index="item.url"
      >
        <font-icon :iconName="item.meta.icon" />
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
      <!-- 二级菜单 -->
      <el-sub-menu v-else :index="item.url">
        <template #title>
          <font-icon :iconName="item.meta.icon" />
          <span>{{ item.meta.title }}</span>
        </template>
        <SideItem :tree="item.children" />
      </el-sub-menu>
    </template>
  </div>
</template>

<script setup>
import { computed, toRefs } from "vue";
import FontIcon from "@/layout/FontIcon/indx.vue";
import { useStore } from "vuex";

const store = useStore();

const props = defineProps({
  tree: {
    type: Object,
    required: true,
  },
  hidden: {
    type: Boolean,
    default: true,
  },
});
const { tree } = toRefs(props);

const fn = (item) => {
  return !item.children || item.children.length === 0;
};
</script>

<style lang="scss" scoped></style>
