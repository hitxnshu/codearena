const mongoose = require('mongoose');

const battleSchema = new mongoose.Schema({
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  problemId: {
    type: String,
    // For now, this is just a string placeholder. We will link this to actual problems later.
    default: 'simple-two-sum' 
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'finished'],
    default: 'waiting'
  },
  startTime: {
    type: Date
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Battle', battleSchema);
