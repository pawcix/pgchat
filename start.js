const { ipcRenderer, remote } = require("electron");

document.getElementById("open").addEventListener("click", () => {
    let login = document.getElementById("login").value;

    // ipcRenderer.send("establishConn", {
    //     addr: "http://localhost:3000",
    //     login
    // });

    remote.getGlobal("socket").connect(
        "http://localhost:3000",
        login
    );
});

let interval = setInterval(() => {
    if (remote.getGlobal("socket").connected) {
        window.open("index.html");
        clearInterval(interval);
    }
}, 1000);
