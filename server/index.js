require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const battleRoutes = require('./routes/battles');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codearena';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/battles', battleRoutes);

app.get('/', (req, res) => {
  res.send('CodeArena API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
