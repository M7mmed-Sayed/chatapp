var socket = io.connect("http://" + document.domain + ":" + location.port);
var userName;
var userColor;

function submitName(event) {
  event.preventDefault();
  userName = document.getElementById("name_input").value.trim();

  if (userName !== "") {
    userColor = generateUserColor(userName);
    document.getElementById("user-name").textContent = userName;
    document.getElementById("name-container").style.display = "none";
    document.getElementById("chat-container").style.display = "block";
    updateChatHeader(userName);
  }
}

socket.on("message", function (msg) {
  var ul = document.getElementById("messages");
  var li = document.createElement("li");
  li.className = "message-container";

  var userNameDiv = document.createElement("div");
  userNameDiv.className = "user-name";

  var messageParts = msg.split(":");
  var senderName = messageParts[0].trim();
  var messageText = messageParts.slice(1).join(":").trim();

  if (senderName === userName) {
    userNameDiv.appendChild(document.createTextNode("You"));
    userColor = generateUserColor(senderName);
    userNameDiv.classList.add("sender_user");
  } else {
    userNameDiv.classList.add("reciver_user");
    userColor = generateUserColor(senderName);
    userNameDiv.appendChild(document.createTextNode(senderName));
  }

  var messageDiv = document.createElement("div");
  messageDiv.className = "message";
  messageDiv.style.backgroundColor = userColor;

  if (senderName === userName) {
    messageDiv.classList.add("sent-message");
  } else {
    messageDiv.classList.add("received-message");
  }

  messageDiv.appendChild(document.createTextNode(messageText));

  li.appendChild(userNameDiv);
  li.appendChild(messageDiv);

  ul.appendChild(li);
  ul.scrollTop = ul.scrollHeight;
});

function sendMessage() {
  var messageInput = document.getElementById("message_input");
  var message = messageInput.value.trim();

  if (message !== "") {
    socket.emit("message", `${userName}: ${message}`);
    messageInput.value = "";
  }
}
function updateChatHeader(username) {
  var chatHeader = document.getElementById("chat-header");
  chatHeader.textContent = `Chat - ${username}`;
}
function generateUserColor(username) {
  var hash = 0;
  for (var i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  var color = Math.abs(hash % 360);
  return `hsl(${color}, 70%, 80%)`;
}
