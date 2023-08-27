import store from "./store.js";
import ui from "./ui.js";
import socket from "./socketHandler.js";

const chatPageButton = document.getElementById("enter_chats_button");

const nameInput = document.querySelector(".introduction_page_name_input");
nameInput.addEventListener("keypress", (e) => {
  store.setUserName(e.target.value);
  console.log("username", store.getUserName());
});

const roomSelect = document.getElementById("room_select");
roomSelect.addEventListener("change", (e) => {
  store.setRoomId(e.target.value);
});

chatPageButton.addEventListener("click", () => {
  ui.goToChatPage(); // go to chat page
  socket.connectSocketIOServer(); // connect to socket after entering userName
});
