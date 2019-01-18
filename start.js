const { ipcRenderer, remote } = require("electron");

let socket;
document.getElementById("open").addEventListener("click", () => {
    let data = {};
    data.login = document.getElementById("login").value;
    data.addr = document.getElementById("addr").value;

    window.open("index.html");
    ipcRenderer.send("socketCredentials", data);
});
