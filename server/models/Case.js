const mongoose = require('mongoose');

const suspectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { _id: false });

const clueSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  discovered: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const caseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  premise: {
    type: String,
    required: true
  },
  story: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  suspects: {
    type: [suspectSchema],
    required: true
  },
  clues: {
    type: [clueSchema],
    required: true
  },
  hints: {
    type: [String],
    default: []
  },
  culprit: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  discoveredClues: {
    type: [String],
    default: []
  },
  hintsUsed: {
    type: Number,
    default: 0
  },
  accusation: {
    type: String,
    default: null
  },
  score: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Case', caseSchema);
