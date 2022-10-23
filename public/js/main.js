const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

// get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

var socket = io();

// join chatroom
socket.emit("joinRoom", { username, room });

// message from server
socket.on("message", (message) => {
  console.log(message);
  outPutMessage(message);

  // scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// submit message
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get message text
  const msg = e.target.elements.msg.value;

  // emit message to server
  socket.emit("chatMessage", msg);

  // clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outPutMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `            
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
  `;
  document.querySelector(".chat-messages").appendChild(div);
}