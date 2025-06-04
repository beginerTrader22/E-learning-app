const mongoose = require('mongoose');

const partSchema = mongoose.Schema({
  _id: { type: String }, // <-- ADD THIS LINE
  type: { type: String, required: true, enum: ['cpu', 'ram', 'gpu', 'ssd', 'motherboard', 'powerSupply'] },
  name: { type: String, required: true },
  compatibleWith: {
    cpu: [{ type: String }],
    motherboard: [{ type: String }],
    powerSupply: { minWattage: Number }
  },
  scoreValue: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.models.Part || mongoose.model('Part', partSchema);
