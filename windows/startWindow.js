const { BrowserWindow } = require("electron");
const { ipcMain } = require("electron");

function createStartWindow(createChatWindow) {
    win = new BrowserWindow({
        width: 650,
        height: 450,
        titleBarStyle: "hiddenInset",
        show: false,
        frame: false,
        name: "Start"
    });

    win.loadFile("start.html");
    win.webContents.openDevTools();

    win.on("closed", () => {
        //createChatWindow(this);
    });

    win.once("ready-to-show", () => {
        win.show();
    });

    win.webContents.on(
        "new-window",
        (event, url, frameName, disposition, options, additionalFeatures) => {
            event.preventDefault();
            Object.assign(options, {
                width: 650,
                height: 450
            });
            event.newGuest = new BrowserWindow(options);
            event.newGuest.loadFile("index.html");
            event.newGuest.webContents.openDevTools();
            event.newGuest.on("closed", () => {
                win.reload();
                win.show();
                global.socket.connected = false;
                global.socket.conn = null;
            });
        }
    );

    return win;
}

module.exports = createStartWindow;
