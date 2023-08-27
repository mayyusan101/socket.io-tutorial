let userName;
let soketId;
let activeChatBoxes = [];
let roomId = "football";

const getUserName = () => {
  return userName;
};

const setUserName = (name) => {
  userName = name;
};

const getSocketId = () => {
  return soketId;
};

const setSocketId = (id) => {
  soketId = id;
};

const getActiveChatBoxes = () => {
  return activeChatBoxes;
};

const setActiveChatBoxes = (connectedPeers) => {
  activeChatBoxes = connectedPeers;
};

const getRoomId = () => {
  return roomId;
};

const setRoomId = (id) => {
  roomId = id;
};

export default {
  getUserName,
  setUserName,
  getSocketId,
  setSocketId,
  getActiveChatBoxes,
  setActiveChatBoxes,
  getRoomId,
  setRoomId,
};
