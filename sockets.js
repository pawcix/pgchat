const io = require("socket.io-client");

let socket = {
    conn: null,
    username: null,
    connected: false,
    connect: function(addr, user) {
        this.conn = io(addr);
        this.conn.on("connect", () => {
            this.connected = true;
            this.username = user;
            this.conn.emit("logIn", { user });
        });
        return this;
    }
};

module.exports = socket;
