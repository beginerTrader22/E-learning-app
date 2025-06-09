const mongoose = require('mongoose');

const partSchema = mongoose.Schema({
  _id: { type: String }, // <-- ADD THIS LINE
  type: { type: String, required: true, enum: ['cpu', 'ram', 'gpu', 'ssd', 'motherboard', 'powerSupply'] },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  compatibleWith: {
    cpu: [{ type: String }],
    gpu: [{ type: String }],
    motherboard: [{ type: String }],
    powerSupply: { minWattage: Number }
  },
    image: {
    type: String,
    default: '/default-part.png' // Default image if none provided
  },
  scoreValue: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.models.Part || mongoose.model('Part', partSchema);
