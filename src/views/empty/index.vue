<template>
  <div class="w-full h-full text-center">
    <div class="back" title="返回上一页" @click="router.go(-1)">返回上一页</div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<style lang="scss" scoped>
.back {
  position: relative;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  cursor: pointer;
  background: rgb(138 150 160 / 8%);
  border-radius: 18px;
  transform: translate(-50%, -50%);

  &:hover {
    background: rgb(138 150 160 / 20%);
    transition: background 0.6s;
  }
}
</style>
