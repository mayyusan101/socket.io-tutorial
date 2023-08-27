import store from "./store.js";
import ui from "./ui.js";

let socket = null;

const connectSocketIOServer = () => {
  socket = io("/");

  socket.on("connect", () => {
    registerAcitveSession(); // register as new user
  });

  socket.on("group-chat-message", (data) => {
    ui.appendGroupChatMessage(data); // append return data to ui
  });

  socket.on("acitve-peers", (data) => {
    ui.updateActiveChatBoxes(data);
  });

  socket.on("direct-message", (data) => {
    ui.appendDirectChatMessage(data);
  });

  socket.on("peer-disconnected", (data) => {
    ui.removeChatBoxOfDisconnectedPeer(data);
  });

  socket.on("room-message", (data) => {
    ui.appendRoomMessage(data);
  });
};

const sendGroupChatMessage = (author, messageContent) => {
  const message = {
    author,
    messageContent,
  };
  socket.emit("group-chat-message", message);
};

const setDirectMessage = (message) => {
  socket.emit("direct-message", message);
};

const sendRoomMessage = (data) => {
  socket.emit("room-message", data);
};

const registerAcitveSession = () => {
  const userData = {
    userName: store.getUserName(),
    roomId: store.getRoomId(),
  };
  socket.emit("register-new-user", userData);
  store.setSocketId(socket.id);
};

export default {
  connectSocketIOServer,
  sendGroupChatMessage,
  setDirectMessage,
  sendRoomMessage,
};
