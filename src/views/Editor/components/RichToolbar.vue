<template>
  <div class="toolbar">
    <!-- 表情包 -->
    <el-popover
      placement="top-start"
      popper-class="style-emo"
      :show-arrow="false"
      :width="200"
      :teleported="false"
      trigger="click"
    >
      <template #reference>
        <span
          class="emoticon"
          title="选择表情"
          ref="buttonRef"
          v-click-outside="onClickOutside"
        >
          <svg-icon iconClass="iconxiaolian" />
        </span>
      </template>
      <div class="emojis">
        <div
          v-for="item in emojiName"
          class="emoji"
          :key="item"
          @click="SelectEmoticon(item)"
        >
          <img :src="emojiUrl + emojiMap[item]" :title="item" />
        </div>
      </div>
    </el-popover>
    <!-- 最近表情 -->
    <el-popover
      ref="popoverRef"
      :show-after="200"
      :hide-after="300"
      :show-arrow="false"
      :teleported="false"
      :virtual-ref="buttonRef"
      placement="top-start"
      trigger="hover"
      virtual-triggering
    >
      <div class="lately-emoji">
        <div
          v-for="item in emojiName.slice(0, 16)"
          class="emoji"
          :key="item"
          @click="SelectEmoticon(item)"
        >
          <img :src="emojiUrl + emojiMap[item]" :title="item" />
        </div>
      </div>
    </el-popover>
    <!-- 图片 -->
    <span class="" title="图片" @click="SendImageClick">
      <svg-icon iconClass="icontupian" />
    </span>
    <!-- 文件 -->
    <span class="" title="文件" @click="SendFileClick">
      <svg-icon iconClass="iconwenjianjia" />
    </span>
    <!-- 截图 -->
    <span class="" title="截图" @click="clickCscreenshot">
      <svg-icon iconClass="iconjietu" />
    </span>
    <!-- 更多 -->
    <el-popover
      v-if="false"
      placement="top-start"
      popper-class="style-tup"
      :width="100"
      trigger="hover"
    >
      <template #reference>
        <span class="">
          <svg-icon iconClass="icondiandiandian" />
        </span>
      </template>
      <div>更多</div>
    </el-popover>
    <input
      type="file"
      id="imagePicker"
      ref="imagePicker"
      accept=".jpg, .jpeg, .png, .gif, .bmp"
      @change="sendImage"
      style="display: none"
    />
    <input
      type="file"
      id="filePicker"
      ref="filePicker"
      @change="sendFile"
      style="display: none"
    />
    <input
      type="file"
      id="videoPicker"
      ref="videoPicker"
      @change="sendVideo"
      style="display: none"
      accept=".mp4"
    />
  </div>
</template>

<script setup>
import html2canvas from "html2canvas";
import { ref, unref, toRefs, defineEmits } from "vue";
import {
  emojiName,
  emojiUrl,
  emojiMap,
  localemojiUrl,
} from "@/utils/emoji-map";
import { ClickOutside as vClickOutside } from "element-plus";

const buttonRef = ref();
const popoverRef = ref();
const emit = defineEmits(["innerHTML"]);
const imagePicker = ref();
const filePicker = ref();
const visible = ref(false);

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.();
};
const SelectEmoticon = (item) => {
  let url = emojiUrl + emojiMap[item];
  emit("innerHTML", url, item);
};
const SendImageClick = () => {
  let $el = imagePicker.value;
  $el.value = null;
  $el.click();
};
const SendFileClick = () => {
  let $el = filePicker.value;
  $el.click();
};
const clickCscreenshot = () => {
  // screenshot
  html2canvas(document.body, {
    allowTaint: true,
    // useCORS: true,
    dpi: 150,
    scale: 2,
  }).then((canvas) => {
    console.log(canvas);
    // let dataURL = canvas.toDataURL("image/png");
    // console.log(dataURL);
    // document.body.appendChild(canvas);
  });
};
function sendImage(e) {
  console.log(e.target.files[0]);
}
function sendFile(e) {
  console.log(e.target.files[0]);
}
</script>
<style>
.style-emo {
  z-index: 9999 !important;
  width: auto !important;
}
</style>
<style lang="scss" scoped>
.toolbar {
  height: 40px;
  padding: 0 5px;
  display: flex;
  & > span {
    width: 42px;
    align-items: center;
    justify-content: center;
    display: flex;
    height: 40px;
    padding: 4px;
    position: relative;
    text-align: center;
    color: #808080;
    svg:hover {
      color: #1989fa;
    }
  }
}
.emojis,
.lately-emoji {
  width: 400px;
  height: 202px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-y: scroll;
  .emoji {
    img {
      width: 30px;
      height: 30px;
    }
  }
}
.lately-emoji {
  width: 125px;
  height: 140px;
}
::-webkit-scrollbar {
  display: none;
}
// ::-webkit-scrollbar {
//   width: 6px;
// }
// ::-webkit-scrollbar-thumb {
//   border-radius: 10px;
//   background: rgba(222, 223, 225);
// }
// ::-webkit-scrollbar-track {
//   border-radius: 0;
// }
.emoticon {
}
</style>
