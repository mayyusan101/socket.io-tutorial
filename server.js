const express = require("express");
const http = require("http");

const PORT = 5000;

const app = express();
const server = http.createServer(app);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const io = require("socket.io")(server);
let connectedPeers = []; // to store active users

io.on("connection", (socket) => {
  socket.on("group-chat-message", (data) => {
    io.emit("group-chat-message", data); // emit to all clients connected in chat group
  });

  // register user session event
  socket.on("register-new-user", (data) => {
    const { userName, roomId } = data;
    const newPeer = {
      userName,
      socketId: socket.id,
      roomId,
    };

    // join socket.io room
    socket.join(roomId);

    connectedPeers = [...connectedPeers, newPeer]; // store new active user
    broadcastConnectedPeers(); // emit all connected peers

    socket.on("direct-message", (data) => {
      const { receiverSocketId } = data;

      const connectedPeer = connectedPeers.find(
        (peer) => peer.socketId === receiverSocketId
      );
      if (connectedPeer) {
        const authorData = {
          ...data,
          isAuthor: true,
        };
        // emit event with message to ourself
        socket.emit("direct-message", authorData);
        // emit event to receiver of the message
        io.to(receiverSocketId).emit("direct-message", data);
      }
    });
  });

  socket.on("room-message", (data) => {
    const { roomId } = data;
    io.to(roomId).emit("room-message", data);
  });

  socket.on("disconnect", () => {
    connectedPeers = connectedPeers.filter(
      (peer) => peer.socketId !== socket.id
    );
    const data = {
      disconnectedPeerId: socket.id,
    };
    io.emit("peer-disconnected", data);
  });

  const broadcastConnectedPeers = () => {
    const data = {
      connectedPeers,
    };
    io.emit("acitve-peers", data); // chat one to one chat box with acitve users
  };
});

server.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
