const socket = require("./sockets")("Pawel");
const filterMessage = require("./chat_modules/filterMessage");

let submit = document.getElementById("send");
let textarea = document.getElementById("message");
let chat = document.getElementById("chat");

let sendMessage = () => {
    let message = textarea.value;

    message = filterMessage(message);
    if (message) socket.emit("chat-send", { message });

    textarea.value = "";
};

textarea.addEventListener("keydown", e => {
    if (e.keyCode == 13) {
        e.preventDefault();
        sendMessage();
    }
});

submit.addEventListener("click", () => {
    sendMessage();
});

socket.on("chat-message", data => {
    generateMessageView(data);

    // todo: nie scrolluj jak nie jest na samym dole
    chat.scrollTo(0, chat.scrollHeight);
});

let generateMessageView = data => {
    let msgBox = document.createElement("div");
    msgBox.classList.add("chat-message");

    let msgSender = document.createElement("div");
    msgSender.classList.add("chat-message-sender");
    msgSender.textContent = data.user;

    let msgContent = document.createElement("div");
    msgContent.classList.add("chat-message-content");
    msgContent.textContent = data.message;

    msgBox.appendChild(msgSender);
    msgBox.appendChild(msgContent);

    chat.appendChild(msgBox);
};
