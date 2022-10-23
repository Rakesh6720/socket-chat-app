const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

const botName = "Chatbot";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    console.log("New WS connection...");
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    // welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to the chat!"));
    // broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat!`)
      );
  });

  // runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat...`)
      );
    }
  });

  // listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
