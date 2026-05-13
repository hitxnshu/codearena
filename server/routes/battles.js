const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Battle = require('../models/Battle');
const { broadcastOpenBattlesChanged } = require('../socket');

// @route   POST api/battles/create
// @desc    Create a new battle room
// @access  Private
router.post('/create', auth, async (req, res) => {
  try {
    const newBattle = new Battle({
      host: req.user.id,
      players: [req.user.id]
    });

    const battle = await newBattle.save();
    broadcastOpenBattlesChanged();
    res.json(battle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/battles/join/:id
// @desc    Join an existing battle
// @access  Private
router.post('/join/:id', auth, async (req, res) => {
  try {
    let battle = await Battle.findById(req.params.id);

    if (!battle) {
      return res.status(404).json({ message: 'Battle not found' });
    }

    if (battle.status !== 'waiting') {
      return res.status(400).json({ message: 'Battle is no longer available to join' });
    }

    // Check if user is already in the battle
    if (battle.players.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already in this battle' });
    }

    // Add player to battle
    battle.players.push(req.user.id);
    
    // If 2 players are present, start the battle
    if (battle.players.length === 2) {
      battle.status = 'active';
      battle.startTime = Date.now();
    }

    await battle.save();
    if (battle.status !== 'waiting') {
      broadcastOpenBattlesChanged();
    }
    res.json(battle);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Battle not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/battles/open
// @desc    Get all open battles waiting for players
// @access  Private
router.get('/open', auth, async (req, res) => {
  try {
    const battles = await Battle.find({ status: 'waiting', players: { $ne: [] } })
      .populate('players', 'name rating')
      .sort({ createdAt: -1 });
      
    res.json(battles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/battles/:id
// @desc    Get battle details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const battle = await Battle.findById(req.params.id).populate('players', 'name rating');
    if (!battle) {
      return res.status(404).json({ message: 'Battle not found' });
    }
    res.json(battle);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Battle not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
