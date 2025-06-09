const asyncHandler = require('express-async-handler');
const Build = require('../models/buildModel');
const Part = require('../models/partModel');

const checkCompatibility = async (parts) => {
  const errors = [];

  const partIds = Object.values(parts).filter(id => id);
  if (partIds.length !== 6) {
    errors.push('Te gjitha pjeset duhet te selektohen');
    return { compatible: false, errors };
  }

  const partDocs = await Part.find({ _id: { $in: partIds } });

  const partsMap = {};
  partDocs.forEach(part => {
    partsMap[part._id.toString()] = part;
  });

  if (Object.keys(partsMap).length !== partIds.length) {
    errors.push('disa pjese nuk u gjeten');
    return { compatible: false, errors };
  }

  const cpu = partsMap[parts.cpu];
  const motherboard = partsMap[parts.motherboard];
  const gpu = partsMap[parts.gpu];
  const powerSupply = partsMap[parts.powerSupply];

  // 1. CPU-Motherboard
  if (cpu && motherboard) {
    const cpuCompatibleMobos = cpu.compatibleWith?.motherboard || [];
    const moboCompatibleCPUs = motherboard.compatibleWith?.cpu || [];

    if (!cpuCompatibleMobos.includes(motherboard.name)) {
      errors.push(`Procesori (${cpu.name}) nuk pershtatet me bordin (${motherboard.name})`);
    }

    if (!moboCompatibleCPUs.includes(cpu.name)) {
      errors.push(`Bordi (${motherboard.name}) nuk pershtaet me procesorin (${cpu.name})`);
    }
  }

  // 2. CPU-GPU
  if (cpu && gpu) {
    const cpuCompatibleGPUs = cpu.compatibleWith?.gpu || [];
    if (cpuCompatibleGPUs.length > 0 && !cpuCompatibleGPUs.includes(gpu.name)) {
      errors.push(`Procesori (${cpu.name}) nuk pershtatet me karten grafike (${gpu.name})`);
    }
  }

  // 3. GPU-PowerSupply
  if (gpu && powerSupply) {
    const minWattage = gpu.compatibleWith?.powerSupply?.minWattage || 0;
    const psuWattage = parseInt(powerSupply.name.match(/\d+/)?.[0] || 0);
    if (psuWattage < minWattage) {
      errors.push(`Ushqyesi (${powerSupply.name}) eshte shum i dobet per karten grafike (${gpu.name}) – Duhen te pakten ${minWattage}W`);
    }
  }

  return {
    compatible: errors.length === 0,
    errors,
  };
};

const getOtherUsersBuilds = asyncHandler(async (req, res) => {
  const builds = await Build.find({ user: { $ne: req.user.id } })
    .populate('parts.cpu parts.ram parts.gpu parts.ssd parts.motherboard parts.powerSupply')
    .populate('user', 'name');
  
  res.status(200).json(builds);
});

const calculateScore = async (parts) => {
  const partDocs = await Part.find({ _id: { $in: Object.values(parts) } });
  return partDocs.reduce((score, part) => score + (part.scoreValue || 0), 0);
};

const createBuild = asyncHandler(async (req, res) => {
  const { parts } = req.body;

  if (!parts || !parts.cpu || !parts.ram || !parts.gpu || !parts.ssd || !parts.motherboard || !parts.powerSupply) {
    res.status(400);
    throw new Error('Te gjitha pjeset jane te nevojshme');
  }

  const { compatible, errors } = await checkCompatibility(parts);
  if (!compatible) {
    res.status(400).json({ message: 'Pjeset nuk pershtaten', errors });
    return;
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
    throw new Error('Nuk je i autorizuar ose pc nuk gjendet');
  }

  await build.deleteOne();
  res.status(200).json({ message: 'Kompiuteri u fshi' });
});

const updateBuild = asyncHandler(async (req, res) => {
  const build = await Build.findById(req.params.id);

  if (!build || build.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Nuk je i autorizuar ose pc nuk gjendet');
  }

  const { parts } = req.body;
  const { compatible, errors } = await checkCompatibility(parts);
  if (!compatible) {
    res.status(400).json({ message: 'Pjeset nuk pershtaten', errors });
    return;
  }

  const score = await calculateScore(parts);
  const updatedBuild = await Build.findByIdAndUpdate(
    req.params.id,
    { parts, score },
    { new: true }
  ).populate('parts.cpu parts.ram parts.gpu parts.ssd parts.motherboard parts.powerSupply');

  res.status(200).json(updatedBuild);
});

module.exports = { createBuild, getBuilds, deleteBuild, updateBuild, getOtherUsersBuilds };
