const io = require("socket.io-client")

let socket = user => {
    const conn = io('http://localhost:3000')

    conn.emit('logIn', {user})

    return conn
}

module.exports = socket