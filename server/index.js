require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const battleRoutes = require('./routes/battles');
const Battle = require('./models/Battle');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codearena';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/battles', battleRoutes);
app.use('/api/execute', require('./routes/execute'));

app.get('/', (req, res) => {
  res.send('CodeArena API is running');
});

const http = require('http');
const initializeSocket = require('./socket');
const { broadcastOpenBattlesChanged } = require('./socket');

const server = http.createServer(app);
const io = initializeSocket(server);

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await Battle.deleteMany({ status: 'waiting' });
    console.log('Cleared stale waiting battles on startup');

    setInterval(async () => {
      try {
        const staleWaiting = new Date(Date.now() - 5 * 60 * 1000);
        const staleFinished = new Date(Date.now() - 60 * 60 * 1000);

        await Battle.deleteMany({ status: 'waiting', updatedAt: { $lt: staleWaiting } });
        await Battle.deleteMany({ status: 'finished', updatedAt: { $lt: staleFinished } });
        broadcastOpenBattlesChanged();
      } catch (err) {
        console.error('Periodic battle cleanup error:', err);
      }
    }, 60 * 1000);
  })
  .catch(err => console.error('MongoDB connection error:', err));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
