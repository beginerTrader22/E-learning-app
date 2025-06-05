const asyncHandler = require('express-async-handler');
const Build = require('../models/buildModel');
const Part = require('../models/partModel');

const checkCompatibility = async (parts) => {
  // Get all parts at once for efficiency
  const partDocs = await Part.find({ _id: { $in: Object.values(parts) } });
  
  // Create a map for easy access
  const partsMap = {};
  partDocs.forEach(part => {
    partsMap[part._id.toString()] = part;
  });

  // Check CPU-Motherboard compatibility
  const cpu = partsMap[parts.cpu];
  const motherboard = partsMap[parts.motherboard];
  
  if (cpu && motherboard) {
    const compatibleSockets = cpu.compatibleWith?.motherboard || [];
    if (!compatibleSockets.includes(motherboard.compatibleWith?.cpu?.[0])) {
      return false;
    }
  }

  // Check GPU-PowerSupply compatibility
  const gpu = partsMap[parts.gpu];
  const powerSupply = partsMap[parts.powerSupply];
  
  if (gpu && powerSupply) {
    const minWattage = gpu.compatibleWith?.powerSupply?.minWattage || 0;
    const psuWattage = parseInt(powerSupply.name.match(/\d+/)?.[0] || 0);
    if (psuWattage < minWattage) {
      return false;
    }
  }

  return true;
};

const calculateScore = async (parts) => {
  const partDocs = await Part.find({ _id: { $in: Object.values(parts) } });
  return partDocs.reduce((score, part) => score + (part.scoreValue || 0), 0);
};

const createBuild = asyncHandler(async (req, res) => {
  const { parts } = req.body;
  
  if (!parts || !parts.cpu || !parts.ram || !parts.gpu || !parts.ssd || !parts.motherboard || !parts.powerSupply) {
    res.status(400);
    throw new Error('All parts are required');
  }

  const isCompatible = await checkCompatibility(parts);
  if (!isCompatible) {
    res.status(400);
    throw new Error('Selected parts are not compatible');
  }
  
  const score = await calculateScore(parts);
  const build = await Build.create({ 
    user: req.user.id,
    parts,
    score
  });
  
  res.status(201).json(build);
});

const getBuilds = asyncHandler(async (req, res) => {
  const builds = await Build.find({ user: req.user.id })
    .populate('parts.cpu parts.ram parts.gpu parts.ssd parts.motherboard parts.powerSupply');
  res.status(200).json(builds);
});

const deleteBuild = asyncHandler(async (req, res) => {
  const build = await Build.findById(req.params.id);
  
  if (!build || build.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Unauthorized or Build not found');
  }
  
  await build.deleteOne();
  res.status(200).json({ message: 'Build deleted' });
});

const updateBuild = asyncHandler(async (req, res) => {
  const build = await Build.findById(req.params.id);
  
  if (!build || build.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Unauthorized or Build not found');
  }

  const { parts } = req.body;
  const isCompatible = await checkCompatibility(parts);
  if (!isCompatible) {
    res.status(400);
    throw new Error('Selected parts are not compatible');
  }

  const score = await calculateScore(parts);
  const updatedBuild = await Build.findByIdAndUpdate(
    req.params.id,
    { parts, score },
    { new: true }
  ).populate('parts.cpu parts.ram parts.gpu parts.ssd parts.motherboard parts.powerSupply');
  
  res.status(200).json(updatedBuild);
});

module.exports = { createBuild, getBuilds, deleteBuild, updateBuild };
