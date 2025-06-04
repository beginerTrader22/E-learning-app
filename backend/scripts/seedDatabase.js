const mongoose = require('mongoose');
const Part = require('../models/partModel'); 
const dotenv = require('dotenv');

dotenv.config();

const pcParts = {
  cpu: [
    { _id: 'cpu1', name: 'Intel Core i7-12700K', scoreValue: 30, compatibleWith: { motherboard: ['LGA1700'] } },
    { _id: 'cpu2', name: 'AMD Ryzen 7 5800X', scoreValue: 28, compatibleWith: { motherboard: ['AM4'] } },
    { _id: 'cpu3', name: 'Intel Core i5-12600K', scoreValue: 25, compatibleWith: { motherboard: ['LGA1700'] } },
  ],
  ram: [
    { _id: 'ram1', name: 'Corsair Vengeance 16GB DDR4', scoreValue: 15, compatibleWith: {} },
    { _id: 'ram2', name: 'G.Skill Trident Z 32GB DDR4', scoreValue: 20, compatibleWith: {} },
    { _id: 'ram3', name: 'Kingston Fury 64GB DDR4', scoreValue: 25, compatibleWith: {} },
  ],
  gpu: [
    { _id: 'gpu1', name: 'NVIDIA RTX 3080', scoreValue: 40, compatibleWith: { powerSupply: { minWattage: 750 } } },
    { _id: 'gpu2', name: 'AMD RX 6800 XT', scoreValue: 38, compatibleWith: { powerSupply: { minWattage: 700 } } },
    { _id: 'gpu3', name: 'NVIDIA RTX 3060 Ti', scoreValue: 30, compatibleWith: { powerSupply: { minWattage: 600 } } },
  ],
  ssd: [
    { _id: 'ssd1', name: 'Samsung 980 Pro 1TB', scoreValue: 15, compatibleWith: {} },
    { _id: 'ssd2', name: 'WD Black SN850 2TB', scoreValue: 20, compatibleWith: {} },
    { _id: 'ssd3', name: 'Crucial P5 Plus 500GB', scoreValue: 10, compatibleWith: {} },
  ],
  motherboard: [
    { _id: 'mobo1', name: 'ASUS ROG Strix Z690-E', scoreValue: 25, compatibleWith: { cpu: ['LGA1700'] } },
    { _id: 'mobo2', name: 'MSI MPG B550 Gaming Edge', scoreValue: 20, compatibleWith: { cpu: ['AM4'] } },
    { _id: 'mobo3', name: 'Gigabyte Z790 Aorus Elite', scoreValue: 30, compatibleWith: { cpu: ['LGA1700'] } },
  ],
  powerSupply: [
    { _id: 'psu1', name: 'Corsair RM750x 750W', scoreValue: 15, compatibleWith: {} },
    { _id: 'psu2', name: 'EVGA SuperNOVA 850W', scoreValue: 20, compatibleWith: {} },
    { _id: 'psu3', name: 'Seasonic Focus GX-650W', scoreValue: 12, compatibleWith: {} },
  ]
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    for (const [type, parts] of Object.entries(pcParts)) {
      for (const part of parts) {
        await Part.findOneAndUpdate(
          { _id: part._id },
          { ...part, type },
          { upsert: true, new: true }
        );
      }
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();