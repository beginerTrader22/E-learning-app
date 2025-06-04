const mongoose = require('mongoose');

const buildSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  parts: {
    cpu: { type: String, ref: 'Part', required: true },
    ram: { type: String, ref: 'Part', required: true },
    gpu: { type: String, ref: 'Part', required: true },
    ssd: { type: String, ref: 'Part', required: true },
    motherboard: { type: String, ref: 'Part', required: true },
    powerSupply: { type: String, ref: 'Part', required: true },
  },
  score: { type: Number, default: 0 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Build', buildSchema);
