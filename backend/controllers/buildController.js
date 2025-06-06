const asyncHandler = require('express-async-handler');
const Build = require('../models/buildModel');
const Part = require('../models/partModel');

const checkCompatibility = async (parts) => {
  // Get all parts at once for efficiency
  const partIds = Object.values(parts).filter(id => id);
  if (partIds.length !== 6) return false; // All 6 parts must be selected
  
  const partDocs = await Part.find({ _id: { $in: partIds } });
  
  // Create a map for easy access
  const partsMap = {};
  partDocs.forEach(part => {
    partsMap[part._id.toString()] = part;
  });

  // Check if we have all parts
  if (Object.keys(partsMap).length !== partIds.length) {
    return false;
  }

  // Get all the parts for easier access
  const cpu = partsMap[parts.cpu];
  const motherboard = partsMap[parts.motherboard];
  const gpu = partsMap[parts.gpu];
  const powerSupply = partsMap[parts.powerSupply];

  // 1. Check CPU-Motherboard compatibility
  if (cpu && motherboard) {
    // CPU's compatible motherboards should include this motherboard's name
    const cpuCompatibleMobos = cpu.compatibleWith?.motherboard || [];
    if (!cpuCompatibleMobos.includes(motherboard.name)) {
      return false;
    }

    // Motherboard's compatible CPUs should include this CPU's name
    const moboCompatibleCPUs = motherboard.compatibleWith?.cpu || [];
    if (!moboCompatibleCPUs.includes(cpu.name)) {
      return false;
    }
  }

  // 2. Check CPU-GPU compatibility (if specified)
  if (cpu && gpu) {
    const cpuCompatibleGPUs = cpu.compatibleWith?.gpu || [];
    if (cpuCompatibleGPUs.length > 0 && !cpuCompatibleGPUs.includes(gpu.name)) {
      return false;
    }
  }

  // 3. Check GPU-PowerSupply compatibility
  if (gpu && powerSupply) {
    const minWattage = gpu.compatibleWith?.powerSupply?.minWattage || 0;
    // Extract wattage from power supply name (e.g., "Corsair RM750x 750W" → 750)
   const psuWattage = parseInt(powerSupply.name.match(/\d+/)?.[0] || 0);
    if (psuWattage < minWattage) {
      return false;
    }
  }

  // All compatibility checks passed
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
