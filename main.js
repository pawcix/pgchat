const { app } = require("electron");
const createStartWindow = require("./windows/startWindow.js");
const { ipcMain } = require("electron");
const socket = require("./sockets");
global.socket = socket;

require("electron-reload")(__dirname);

// Open starting window

app.on("ready", () => {
    createStartWindow();
});

app.on("window-all-closed", () => {
    app.quit();
});

app.on("activate", () => {
    if (win == null) {
        createWindow();
    }
});

ipcMain.on("setSocket", (event, socket) => {
    global.socket = socket;
});
