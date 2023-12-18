import store from "@/store/index";
import { $t } from "@/plugins/i18n";
import { searchByPinyin } from "./utils";
// 编辑器配置
export const editorConfig = {
  // 请输入内容... $t("chat.buttonPrompt")
  placeholder: $t("chat.buttonPrompt"),
  // 配置编辑器是否只读，默认为 false
  // readOnly: true,
  /* 菜单配置 */
  MENU_CONF: {},
  EXTEND_CONF: {
    mentionConfig: {
      showModal,
      hideModal,
    },
  },
  hoverbarKeys: {
    link: {
      // 重写 link 元素的 hoverbar
      menuKeys: ["editLink", "unLink", "viewLink"],
    },
    image: {
      // 清空 image 元素的 hoverbar
      // menuKeys: [],
    },
  },
};
// 显示 modal
function showModal(e) {
  console.log(e.getText())
  store.commit("SET_MENTION_MODAL", true);
}
// 隐藏 modal
function hideModal(e) {
  console.log(e.getText())
  if (searchByPinyin(e.getText())) return
  store.commit("SET_MENTION_MODAL", false);
}
