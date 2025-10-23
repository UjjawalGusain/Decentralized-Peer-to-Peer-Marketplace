export const ChatEventEnum = Object.freeze({
  CONNECTED_EVENT: "connect",
  DISCONNECT_EVENT: "disconnect",
  FRIEND_DISCONNECT_EVENT: "friendDisconnect",
  FRIEND_CONNECTED_EVENT: "friendConnect",
  SEND_MESSAGE_EVENT: "messageSent",
  JOIN_CHAT_EVENT: "joinChat",
  LEAVE_CHAT_EVENT: "leaveChat",
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  NEW_CHAT_EVENT: "newChat",
  SOCKET_ERROR_EVENT: "socketError",
  STOP_TYPING_EVENT: "stopTyping", // will use in future
  TYPING_EVENT: "typing", // will use in future
  MESSAGE_DELETE_EVENT: "messageDeleted",
});