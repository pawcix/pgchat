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

    win.asd = "asd";

    win.loadFile("start.html");
    win.webContents.openDevTools();

    win.on("closed", () => {
        //createChatWindow(this);
    });

    win.once("ready-to-show", () => {
        win.show();
    });

    let newWindow;

    win.webContents.on(
        "new-window",
        (event, url, frameName, disposition, options, additionalFeatures) => {
            event.preventDefault();
            Object.assign(options, {
                width: 650,
                height: 450
            });
            event.newGuest = new BrowserWindow(options);
            win.hide();
            newWindow = event.newGuest;
            event.newGuest.loadFile("index.html");
            event.newGuest.webContents.openDevTools();
            event.newGuest.on("closed", () => {
                win.reload();
                win.show();
            });
        }
    );

    ipcMain.on("socketCredentials", (e, data) => {
        newWindow.socketCredentials = {};
        newWindow.socketCredentials.login = data.login;
        newWindow.socketCredentials.addr = data.addr;
    });

    return win;
}

module.exports = createStartWindow;
