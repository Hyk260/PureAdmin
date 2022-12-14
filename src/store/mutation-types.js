export const ACCESS_TOKEN = "Access-Token";
export const SET_UP = "setup";
export const USER_DATA = "userdata";

export const CONVERSATIONTYPE = {
  UPDATE_NOMORE: "UPDATE_NOMORE", //更新加载更多
  UPDATE_MESSAGES: "UPDATE_MESSAGES", //更新消息
  ADD_MORE_MESSAGE: "ADD_MORE_MESSAGE",
  UPDATE_CACHE: "UPDATE_CACHE",
  ADD_MESSAGE: "ADD_MESSAGE",
  RECALL_MESSAGE: "RECALL_MESSAGE",
  MARKE_MESSAGE_AS_READED: "MARKE_MESSAGE_AS_READED",
  UPDATE_SCROLL_DOWN: "UPDATE_SCROLL_DOWN",
  CLEAR_HISTORY: "CLEAR_HISTORY", //清除历史记录
  DELETE_MESSAGE: "DELETE_MESSAGE", //删除消息
  RECIVE_MESSAGE: "RECIVE_MESSAGE", //接收消息
  REPLACE_CONV_LIST: "REPLACE_CONV_LIST",
  UPDATE_CURRENT_SELECTED_CONVERSATION: "UPDATE_CURRENT_SELECTED_CONVERSATION", //跳转会话
};

export const GET_MESSAGE_LIST = "GET_MESSAGE_LIST"; //获取消息列表
export const HISTORY_MESSAGE_COUNT = 20; //历史消息计数

// 请求头-内容类型
export const ContentType = {
  JSON: "application/json;charset=UTF-8",
  FORM: "application/x-www-form-urlencoded;charset=UTF-8",
  UPLOAD: "multipart/form-data",
  STREAM: "application/octet-stream;charset=UTF-8",
};
