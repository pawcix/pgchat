const { ipcRenderer, remote } = require("electron");
const filterMessage = require("./chat_modules/filterMessage");
const processMessage = require("./chat_modules/processMessage");
const moment = require("moment");

moment.locale("pl");

let chatWindow = document.getElementById("chat-content");
let chatLoading = document.getElementById("chat-loading");
document.getElementById("chat-failedtoconnect").style.display = "none";
chatWindow.style.display = "none";

s = require("./sockets").connect(
    remote.getCurrentWindow().socketCredentials.addr,
    remote.getCurrentWindow().socketCredentials.login
);

let timer = 0;

let interval = setInterval(() => {
    if (s.connected) {
        socket = s.conn;
        username = s.username;

        chatLoading.style.display = "none";
        chatWindow.style.display = "flex";

        chat();
        clearInterval(interval);
    } else {
        if (timer > 10) {
            document.getElementById("chat-failedtoconnect").style.display =
                "block";
        }

        timer++;
    }
}, 1000);

let chat = () => {
    let textarea = document.getElementById("message");
    let chat = document.getElementById("chat");

    let username = s.username;    
    let usersOnline = [];

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

    socket.on("chat-message", data => {
        generateMessageView(data);

        // todo: nie scrolluj jak nie jest na samym dole
        chat.scrollTo(0, chat.scrollHeight);
    });

    // notifications
    socket.on("notification", data => {
        console.log(data);
        notification(data.type, data.text);
    })

    socket.on("usersOnline-fetch", data => {

        console.log("fetch");
        usersOnline = data;
        updateUsersOnline();
    })

    socket.on("usersOnline-add", data => {
        usersOnline.push(data);
        updateUsersOnline();
    })

    socket.on("usersOnline-remove", data => {
        let index = usersOnline.findIndex(el => {
            return el.name == data.name;
        })

        if(typeof index != 'undefined') usersOnline.splice(index, 1);
        updateUsersOnline();
    })

    socket.on("usersOnline-update", data => {
        let index = usersOnline.findIndex(el => {
            return el.name == data.name;
        })

        if(typeof index != 'undefined') usersOnline[index] = data;
        updateUsersOnline();
    })

    // users online
    let updateUsersOnline = () => {
        document.getElementById("users-online-list").innerHTML = "";
        for(let user in usersOnline) {
            
            let userBox = document.createElement("div");
            let userSpan = document.createElement("span");
            let userStatus = document.createElement("i");

            userStatus.classList.add("fa");
            userStatus.classList.add("fa-circle");
            userStatus.classList.add(usersOnline[user].status);

            userBox.classList.add("users-online-user");
            
            userSpan.innerHTML = usersOnline[user].name;

            userBox.append(userStatus);
            userBox.append(userSpan);

            document.getElementById("users-online-list").append(userBox);
        }
    }
    updateUsersOnline();

    let notification = (type, text) => {
        let notifyBox = document.createElement("div");
        let notifySpan = document.createElement("span");

        notifyBox.classList.add("notification-box");

        notifySpan.classList.add(`notification`);
        notifySpan.classList.add(`${type}`);
        notifySpan.innerHTML = text;

        notifyBox.append(notifySpan);
        chat.append(notifyBox);
    }

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
        data.message = data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        processMessage(msgElements, data);

        msgElements.msgSender.classList.add("chat-message-sender");
        msgElements.msgContent.classList.add("chat-message-content");
        msgElements.msgDate.classList.add("chat-message-date");

        msgElements.msgSender.innerText = data.user;

        msgElements.msgContent.innerHTML = data.message;
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
};
