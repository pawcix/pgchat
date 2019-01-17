const electron = require("electron")
const { app, BrowserWindow, Menu } = require("electron")

require('electron-reload')(__dirname)

function createWindow() {
    win = new BrowserWindow({
        width: 650,
        height: 450,
        titleBarStyle: 'hiddenInset',
        show: false,
        frame: false
    })

    win.loadFile("index.html")
    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })

    win.once('ready-to-show', () => {
        win.show()
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    app.quit()
})

app.on('activate', () => {
    if(win == null) {
        createWindow()
    }
}) 