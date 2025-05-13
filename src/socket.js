const { Server } = require('socket.io');
let io;

function initSocket(server) {
  io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Quando um cliente entra em uma sala (ex: "mesa-10")
    socket.on("joinRoom", ({ room }) => {
      const roomId = String(room); // força string
      console.log(`Socket ${socket.id} entrou na sala ${room}`);
      socket.join(roomId);
    });


     
    // Quando um cliente envia uma mensagem
    socket.on("sendMessage", ({ room, author, message }) => {
      const payload = { author, message, timestamp: Date.now() };

      console.log("🟢 [server] sendMessage recebido:", { room, author, message });


      // Emite para todos NA SALA, _menos_ quem enviou
      socket.to(room).emit("newMessage", payload);
      console.log(`Mensagem enviada para sala ${room} (exceto o remetente):`, payload);
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
