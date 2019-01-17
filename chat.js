const { ipcRenderer, remote } = require("electron");
const filterMessage = require("./chat_modules/filterMessage");
const processMessage = require("./chat_modules/processMessage");
const moment = require("moment");
moment.locale("pl");

socket = remote.getGlobal("socket").conn;

let submit = document.getElementById("send");
let textarea = document.getElementById("message");
let chat = document.getElementById("chat");

let username = remote.getGlobal("socket").username;

textarea.focus();

let sendMessage = () => {
    let message = textarea.value;

    message = filterMessage(message);
    if (message) {
        socket.emit("chat-send", { message });
        textarea.setAttribute("disabled", true);
    }
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

socket.on("chat-message-status", data => {
    textarea.disabled = false;
    textarea.value = "";
    textarea.focus();

    if (data.success) {
        // udało się wysłać wiadomość
    } else {
        // nie udało się wysłać
    }
});

let generateMessageView = data => {
    let msgBox = document.createElement("div");
    msgBox.classList.add("chat-message");

    if (data.author) {
        msgBox.classList.add("author");
    }

    let msgSender = document.createElement("div");
    let msgContent = document.createElement("div");
    let msgDate = document.createElement("div");

    let msgElements = { msgContent, msgSender, msgBox, msgDate };
    processMessage(msgElements, data);

    msgElements.msgSender.classList.add("chat-message-sender");
    msgElements.msgContent.classList.add("chat-message-content");
    msgElements.msgDate.classList.add("chat-message-date");

    msgElements.msgSender.innerText = data.user;
    msgElements.msgContent.innerText = data.message;
    msgElements.msgDate.innerText = moment(data.date).fromNow();

    msgElements.msgDate.setAttribute("data-date", data.date);

    msgElements.msgBox.appendChild(msgElements.msgSender);
    msgElements.msgBox.appendChild(msgElements.msgContent);
    msgElements.msgBox.appendChild(msgElements.msgDate);

    chat.appendChild(msgElements.msgBox);
};

setInterval(() => {
    let elements = document.getElementsByClassName("chat-message-date");
    for (let i = 0; i < elements.length; i++) {
        elements[i].innerText = moment(
            parseInt(elements[i].getAttribute("data-date"))
        ).fromNow();
    }
}, 5000);
