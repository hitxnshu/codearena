const { Server } = require('socket.io');

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // For dev, allow all. In production, restrict to frontend URL
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a battle room
    socket.on('joinRoom', ({ battleId, user }) => {
      socket.join(battleId);
      console.log(`${user.name} joined room ${battleId}`);
      
      // Notify others in the room
      socket.to(battleId).emit('playerJoined', user);
    });

    // Handle code updates
    socket.on('codeUpdate', ({ battleId, code }) => {
      // Broadcast code to everyone else in the room
      socket.to(battleId).emit('codeUpdate', code);
    });

    // Handle when a player is ready/starts
    socket.on('startBattle', ({ battleId }) => {
      io.to(battleId).emit('battleStarted');
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = initializeSocket;
