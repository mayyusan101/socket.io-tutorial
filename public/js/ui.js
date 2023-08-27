import store from "./store.js";
import elements from "./elements.js";
import socket from "./socketHandler.js";

const goToChatPage = () => {
  const introductionPage = document.querySelector(".introduction_page");
  const chatPage = document.querySelector(".chat_page");

  introductionPage.classList.add("display_none");
  chatPage.classList.remove("display_none");
  chatPage.classList.add("display_flex");

  const userName = store.getUserName();
  updateUserName(userName);

  createGroupChatBox();
  createRoomChatBox();
};

const updateUserName = (userName) => {
  const userNameLabel = document.querySelector(".username_label");
  userNameLabel.innerHTML = userName;
};

const createGroupChatBox = () => {
  // id for group chat
  const chatboxId = "group-chat-chatbox";
  const chatboxMessagesId = "group_chat_messages";
  const chatboxInputId = "group-chat-input";

  const data = {
    chatboxLabel: "Group chat",
    chatboxId,
    chatboxMessagesId,
    chatboxInputId,
  };

  const chatbox = elements.getChatBox(data);
  const chatboxesContainer = document.querySelector(".chatboxes_container");
  chatboxesContainer.appendChild(chatbox);

  // add event listener to sent group message
  const newMessageInput = document.getElementById(chatboxInputId);
  newMessageInput.addEventListener("keyup", (event) => {
    const key = event.key;

    if (key === "Enter") {
      const author = store.getUserName();
      const messageContent = event.target.value;

      socket.sendGroupChatMessage(author, messageContent);
      newMessageInput.value = "";
    }
  });
};

const appendGroupChatMessage = (data) => {
  const groupChatMessengeContainer = document.getElementById(chatboxMessagesId);
  const chatMessage = elements.getGroupChatMessage(data);
  groupChatMessengeContainer.appendChild(chatMessage);
};

const updateActiveChatBoxes = (data) => {
  const { connectedPeers } = data;
  const userSocketId = store.getSocketId();

  connectedPeers.forEach((peer) => {
    const activeChatBoxes = store.getActiveChatBoxes();
    const activeChatBox = activeChatBoxes.find(
      (chatbox) => peer.socketId === chatbox.socketId
    );
    if (!activeChatBox && userSocketId !== peer.socketId) {
      // append not already exits && remove for ourself chat box
      newUserChatBox(peer);
      const newChatBoxes = [...activeChatBoxes, peer]; // added to new only if not exist in activeChatBoxes
      store.setActiveChatBoxes(newChatBoxes);
    }
  });
};

const newUserChatBox = (peer) => {
  // id for peer chat box
  const chatboxId = peer.socketId;
  const chatboxMessagesId = `${peer.socketId}_chat_messages`;
  const chatboxInputId = `${peer.socketId}-chat-input`;
  const data = {
    chatboxLabel: peer.userName,
    chatboxId,
    chatboxMessagesId,
    chatboxInputId,
  };
  const newChatBox = elements.getChatBox(data);
  // append chat box to DOM
  const chatboxesContainer = document.querySelector(".chatboxes_container");
  chatboxesContainer.appendChild(newChatBox);

  // add event listener to sent direct message
  const messageInput = document.getElementById(chatboxInputId);
  messageInput.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key === "Enter") {
      const author = store.getUserName();
      const messageContent = event.target.value;
      const authorSocketId = store.getSocketId();
      const receiverSocketId = peer.socketId;

      const message = {
        author,
        messageContent,
        authorSocketId,
        receiverSocketId,
      };

      socket.setDirectMessage(message);
      messageInput.value = "";
    }
  });
};

const appendDirectChatMessage = (messageData) => {
  const { isAuthor, authorSocketId, receiverSocketId, messageContent } =
    messageData;

  const messageContainer = isAuthor
    ? document.getElementById(`${receiverSocketId}_chat_messages`)
    : document.getElementById(`${authorSocketId}_chat_messages`);

  if (messageContainer) {
    const data = {
      messageContent,
      alignRight: isAuthor ? true : false,
    };

    const message = elements.getDirectMessage(data);
    messageContainer.appendChild(message);
  }
};

const removeChatBoxOfDisconnectedPeer = (data) => {
  const { disconnectedPeerId } = data;
  const chatBoxId = document.getElementById(disconnectedPeerId);
  const chatBoxContainer = document.querySelector(".chatboxes_container");

  if (chatBoxId) {
    chatBoxContainer.removeChild(chatBoxId);
  }
};

const createRoomChatBox = () => {
  // id for room chat
  const roomId = store.getRoomId();
  const chatboxLabel = roomId;
  const chatboxId = roomId;
  const chatboxMessagesId = `${roomId}_chat_messages`;
  const chatboxInputId = `${roomId}-chat-input`;
  const data = {
    chatboxLabel,
    chatboxId,
    chatboxMessagesId,
    chatboxInputId,
  };

  const chatbox = elements.getChatBox(data);
  const chatboxesContainer = document.querySelector(".chatboxes_container");
  chatboxesContainer.appendChild(chatbox);

  // add event listener to sent room message
  const newMessageInput = document.getElementById(chatboxInputId);
  newMessageInput.addEventListener("keyup", (event) => {
    const key = event.key;

    if (key === "Enter") {
      const author = store.getUserName();
      const messageContent = event.target.value;
      const authorSocketId = store.getSocketId();

      const data = {
        author,
        messageContent,
        authorSocketId,
        roomId,
      };
      socket.sendRoomMessage(data);
      newMessageInput.value = "";
    }
  });
};

const appendRoomMessage = (data) => {
  const roomId = store.getRoomId();
  const chatboxMessagesId = `${roomId}_chat_messages`;
  const roomMessengeContainer = document.getElementById(chatboxMessagesId);
  const chatMessage = elements.getGroupChatMessage(data);
  roomMessengeContainer.appendChild(chatMessage);
};

export default {
  goToChatPage,
  appendGroupChatMessage,
  updateActiveChatBoxes,
  appendDirectChatMessage,
  removeChatBoxOfDisconnectedPeer,
  appendRoomMessage,
};
