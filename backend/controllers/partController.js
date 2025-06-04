const asyncHandler = require('express-async-handler');
const Part = require('../models/partModel');

const getParts = asyncHandler(async (req, res) => {
  const parts = await Part.find({});
  const partsByType = {
    cpu: parts.filter(p => p.type === 'cpu'),
    ram: parts.filter(p => p.type === 'ram'),
    gpu: parts.filter(p => p.type === 'gpu'),
    ssd: parts.filter(p => p.type === 'ssd'),
    motherboard: parts.filter(p => p.type === 'motherboard'),
    powerSupply: parts.filter(p => p.type === 'powerSupply'),
  };
  res.status(200).json(partsByType);
});

const getPartById = asyncHandler(async (req, res) => {
  const part = await Part.findById(req.params.id);
  if (!part) {
    res.status(404);
    throw new Error('Part not found');
  }
  res.status(200).json(part);
});

module.exports = { getParts, getPartById };