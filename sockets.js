const io = require("socket.io-client");

let socket = {
    conn: null,
    username: null,
    connected: false,
    connect: function(addr, user, cb) {
        this.conn = io(addr);
        this.conn.on("connect", () => {
            this.connected = true;
        });
    }
};

module.exports = socket;
