const { Server } = require('socket.io');
const Battle = require('./models/Battle');

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // For dev, allow all. In production, restrict to frontend URL
      methods: ['GET', 'POST']
    }
  });

  const roomSockets = new Map();
  const socketRoom = new Map();

  const cleanupBattleRecord = async (battleId) => {
    try {
      const battle = await Battle.findById(battleId);
      if (!battle) return;
      await Battle.findByIdAndDelete(battleId);
      console.log(`Cleaned up stale battle record ${battleId}`);
    } catch (err) {
      console.error('cleanupBattleRecord error:', err);
    }
  };

  const removeSocketFromRoom = async (socket, notifyRemaining = false) => {
    const battleId = socketRoom.get(socket.id);
    if (!battleId) return;

    socketRoom.delete(socket.id);
    const sockets = roomSockets.get(battleId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        roomSockets.delete(battleId);
      }
    }

    socket.leave(battleId);

    const remaining = roomSockets.get(battleId)?.size || 0;
    if (remaining === 0) {
      await cleanupBattleRecord(battleId);
    } else if (notifyRemaining) {
      socket.to(battleId).emit('opponentLeft');
    }
  };

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinRoom', async ({ battleId, user }) => {
      try {
        const battle = await Battle.findById(battleId);
        if (!battle || battle.status === 'finished') {
          socket.emit('roomError', { message: 'This battle is no longer available.' });
          return;
        }

        socket.join(battleId);
        socketRoom.set(socket.id, battleId);

        const sockets = roomSockets.get(battleId) || new Set();
        sockets.add(socket.id);
        roomSockets.set(battleId, sockets);

        console.log(`${user.name} joined room ${battleId} (${sockets.size} connected)`);

        socket.to(battleId).emit('playerJoined', user);
      } catch (err) {
        console.error('joinRoom error:', err);
        socket.emit('roomError', { message: 'Unable to join battle room.' });
      }
    });

    socket.on('leaveRoom', async ({ battleId }) => {
      await removeSocketFromRoom(socket, true);
    });

    socket.on('codeUpdate', ({ battleId, code }) => {
      socket.to(battleId).emit('codeUpdate', code);
    });

    socket.on('startBattle', ({ battleId }) => {
      io.to(battleId).emit('battleStarted');
    });

    socket.on('submitCode', async ({ battleId, user }) => {
      io.to(battleId).emit('battleEnded', { winnerName: user.name });
      try {
        const battle = await Battle.findById(battleId);
        if (battle) {
          battle.status = 'finished';
          battle.winner = user.id;
          await battle.save();

          setTimeout(async () => {
            await cleanupBattleRecord(battleId);
          }, 60 * 1000);
        }
      } catch (err) {
        console.error('submitCode error:', err);
      }
    });

    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.id}`);
      await removeSocketFromRoom(socket, true);
    });
  });

  return io;
}

module.exports = initializeSocket;
