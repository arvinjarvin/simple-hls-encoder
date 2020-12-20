const { server } = require('./app');
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket) =>
{
    socket.emit('handshake');
})

module.exports = io;