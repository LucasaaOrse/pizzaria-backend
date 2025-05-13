// socket.js (novo arquivo)
const { Server } = require('socket.io');
let io;

function initSocket(server) {
  io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', socket => console.log('Cliente conectado:', socket.id));
  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.io não inicializado!');
  return io;
}

module.exports = { initSocket, getIO };