const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "Chatbot";

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("New WS connection...");
  // welcome current user
  socket.emit("message", formatMessage(botName, "Welcome to the chat!"));

  // broadcast when a user connects
  socket.broadcast.emit(
    "message",
    formatMessage(botName, "A user has joined the chat!")
  );

  // runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat..."));
  });

  // listen for chat message
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("USER", msg));
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
