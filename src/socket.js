const { Server } = require('socket.io');
let io;

function initSocket(server) {
  io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Quando um cliente entra em uma sala (ex: "mesa-10")
    socket.on("joinRoom", ({ room }) => {
      socket.join(room);
      console.log(`Socket ${socket.id} entrou na sala ${room}`);
    });

    // Quando um cliente envia uma mensagem
    socket.on("sendMessage", ({ room, author, message }) => {
      const payload = {
        author,
        message,
        timestamp: Date.now()
      };

      // Emite para todos da sala (ex: mesa-10)
      io.to(room).emit("newMessage", payload);
      console.log(`Mensagem enviada para sala ${room}:`, payload);
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.io não inicializado!');
  return io;
}

module.exports = { initSocket, getIO };
