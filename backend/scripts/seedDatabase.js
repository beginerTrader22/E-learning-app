const mongoose = require('mongoose');
const Part = require('../models/partModel');
const dotenv = require('dotenv');

dotenv.config();

const pcParts = {
  cpu: [
    {
      _id: 'cpu1',
      name: 'Intel Core i7-12700K',
      scoreValue: 30,
      image: 'https://m.media-amazon.com/images/I/61zKGzGfHIL._AC_SX679_.jpg',
      compatibleWith: {
        motherboard: ['ASUS ROG Strix Z690-E', 'Gigabyte Z790 Aorus Elite'],
        gpu: ['NVIDIA RTX 3080', 'NVIDIA RTX 3060 Ti']
      }
    },
    {
      _id: 'cpu2',
      name: 'AMD Ryzen 7 5800X',
      scoreValue: 28,
      image: 'https://m.media-amazon.com/images/I/71WPGXQLcLL._AC_SL1500_.jpg',
      compatibleWith: {
        motherboard: ['MSI MPG B550 Gaming Edge'],
        gpu: ['AMD RX 6800 XT', 'NVIDIA RTX 3060 Ti']
      }
    },
    {
      _id: 'cpu3',
      name: 'Intel Core i5-12600K',
      scoreValue: 25,
      image: 'https://m.media-amazon.com/images/I/61mIUCd-37L._AC_SL1500_.jpg',
      compatibleWith: {
        motherboard: ['ASUS ROG Strix Z690-E', 'Gigabyte Z790 Aorus Elite'],
        gpu: ['NVIDIA RTX 3060 Ti']
      }
    },
    {
      _id: 'cpu4',
      name: 'AMD Ryzen 9 5900X',
      scoreValue: 35,
      image: 'https://m.media-amazon.com/images/I/618nGbfK+qL._AC_SL1000_.jpg',
      compatibleWith: {
        motherboard: ['MSI MPG B550 Gaming Edge'],
        gpu: ['AMD RX 6800 XT']
      }
    },
    {
      _id: 'cpu5',
      name: 'Intel Core i9-12900K',
      scoreValue: 40,
      image: 'https://m.media-amazon.com/images/I/61+Ncl0bWGL._AC_SL1200_.jpg',
      compatibleWith: {
        motherboard: ['Gigabyte Z790 Aorus Elite'],
        gpu: ['NVIDIA RTX 3080']
      }
    },
    {
      _id: 'cpu6',
      name: 'Intel Core i5-12400F',
      scoreValue: 22,
      image: 'https://m.media-amazon.com/images/I/61JEb6QUbqL._AC_SL1500_.jpg',
      compatibleWith: {
        motherboard: ['ASUS ROG Strix Z690-E'],
        gpu: ['NVIDIA RTX 3060 Ti']
      }
    }
  ],
  ram: [
    {
      _id: 'ram1',
      name: 'Corsair Vengeance 16GB DDR4',
      scoreValue: 15,
      image: 'https://m.media-amazon.com/images/I/51HDHrfEefL._AC_SL1500_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ram2',
      name: 'G.Skill Trident Z 32GB DDR4',
      scoreValue: 20,
      image: 'https://m.media-amazon.com/images/I/91B9mKZrJjL._AC_SL1500_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ram3',
      name: 'Kingston Fury 64GB DDR4',
      scoreValue: 25,
      image: 'https://m.media-amazon.com/images/I/81kQUYBvHCL._AC_SL1500_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ram4',
      name: 'Teamgroup T-Force Delta RGB 16GB DDR4',
      scoreValue: 18,
      image: 'https://m.media-amazon.com/images/I/71Z3r4PLnML._AC_SL1500_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ram5',
      name: 'Crucial Ballistix 32GB DDR4',
      scoreValue: 22,
      image: 'https://m.media-amazon.com/images/I/61Xp0SD2D+L._AC_SL1500_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ram6',
      name: 'Patriot Viper Steel 64GB DDR4',
      scoreValue: 27,
      image: 'https://m.media-amazon.com/images/I/81b7UtswXnL._AC_SL1500_.jpg',
      compatibleWith: {}
    }
  ],
  gpu: [
    {
      _id: 'gpu1',
      name: 'NVIDIA RTX 3080',
      scoreValue: 40,
      image: 'https://m.media-amazon.com/images/I/81gJwrDeC+L._AC_SL1500_.jpg',
      compatibleWith: { powerSupply: { minWattage: 750 } }
    },
    {
      _id: 'gpu2',
      name: 'AMD RX 6800 XT',
      scoreValue: 38,
      image: 'https://m.media-amazon.com/images/I/81cVxKMQTEL._AC_SL1500_.jpg',
      compatibleWith: { powerSupply: { minWattage: 700 } }
    },
    {
      _id: 'gpu3',
      name: 'NVIDIA RTX 3060 Ti',
      scoreValue: 30,
      image: 'https://m.media-amazon.com/images/I/61G5JoU9tTL._AC_SL1000_.jpg',
      compatibleWith: { powerSupply: { minWattage: 600 } }
    },
    {
      _id: 'gpu4',
      name: 'AMD RX 6700 XT',
      scoreValue: 32,
      image: 'https://m.media-amazon.com/images/I/81AjkRQ7u3L._AC_SL1500_.jpg',
      compatibleWith: { powerSupply: { minWattage: 650 } }
    },
    {
      _id: 'gpu5',
      name: 'NVIDIA RTX 4070',
      scoreValue: 42,
      image: 'https://m.media-amazon.com/images/I/91C8b0UysUL._AC_SL1500_.jpg',
      compatibleWith: { powerSupply: { minWattage: 650 } }
    },
    {
      _id: 'gpu6',
      name: 'Intel Arc A770',
      scoreValue: 28,
      image: 'https://m.media-amazon.com/images/I/61vZpzjA0EL._AC_SL1500_.jpg',
      compatibleWith: { powerSupply: { minWattage: 550 } }
    }
  ],
  ssd: [
    {
      _id: 'ssd1',
      name: 'Samsung 980 Pro 1TB',
      scoreValue: 15,
      image: 'https://m.media-amazon.com/images/I/61w6Lx8lrdL._AC_SL1500_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ssd2',
      name: 'WD Black SN850 2TB',
      scoreValue: 20,
      image: 'https://m.media-amazon.com/images/I/61VzsbvAOyL._AC_SL1500_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ssd3',
      name: 'Crucial P5 Plus 500GB',
      scoreValue: 10,
      image: 'https://m.media-amazon.com/images/I/81sJ5YDySSL._AC_SL1500_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ssd4',
      name: 'Sabrent Rocket Q 1TB',
      scoreValue: 14,
      image: 'https://m.media-amazon.com/images/I/71nJGZtM3eL._AC_SL1500_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ssd5',
      name: 'ADATA XPG GAMMIX S70 Blade 2TB',
      scoreValue: 22,
      image: 'https://m.media-amazon.com/images/I/71OuwMP4nbL._AC_SL1500_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ssd6',
      name: 'Kingston KC3000 1TB',
      scoreValue: 18,
      image: 'https://m.media-amazon.com/images/I/71eMAB+uQuL._AC_SL1500_.jpg',
      compatibleWith: {}
    }
  ],
  motherboard: [
    {
      _id: 'mobo1',
      name: 'ASUS ROG Strix Z690-E',
      scoreValue: 25,
      image: 'https://m.media-amazon.com/images/I/71SL9Fhx5+L._AC_SL1500_.jpg',
      compatibleWith: { cpu: ['Intel Core i7-12700K', 'Intel Core i5-12600K', 'Intel Core i9-12900K', 'Intel Core i5-12400F'] }
    },
    {
      _id: 'mobo2',
      name: 'MSI MPG B550 Gaming Edge',
      scoreValue: 20,
      image: 'https://m.media-amazon.com/images/I/71DRzSLjB6L._AC_SL1500_.jpg',
      compatibleWith: { cpu: ['AMD Ryzen 7 5800X', 'AMD Ryzen 9 5900X'] }
    },
    {
      _id: 'mobo3',
      name: 'Gigabyte Z790 Aorus Elite',
      scoreValue: 30,
      image: 'https://m.media-amazon.com/images/I/81FLqgy31LL._AC_SL1500_.jpg',
      compatibleWith: { cpu: ['Intel Core i7-12700K', 'Intel Core i5-12600K', 'Intel Core i9-12900K'] }
    },
    {
      _id: 'mobo4',
      name: 'ASRock B550 Phantom Gaming',
      scoreValue: 22,
      image: 'https://m.media-amazon.com/images/I/8104gZqaTxL._AC_SL1500_.jpg',
      compatibleWith: { cpu: ['AMD Ryzen 7 5800X'] }
    },
    {
      _id: 'mobo5',
      name: 'MSI Z690 PRO',
      scoreValue: 27,
      image: 'https://m.media-amazon.com/images/I/71pE8A69k2L._AC_SL1500_.jpg',
      compatibleWith: { cpu: ['Intel Core i7-12700K', 'Intel Core i9-12900K'] }
    },
    {
      _id: 'mobo6',
      name: 'ASUS TUF Gaming B550-PLUS',
      scoreValue: 24,
      image: 'https://m.media-amazon.com/images/I/81gcsE9N4FL._AC_SL1500_.jpg',
      compatibleWith: { cpu: ['AMD Ryzen 9 5900X'] }
    }
  ],
  powerSupply: [
    {
      _id: 'psu1',
      name: 'Corsair RM750x 750W',
      scoreValue: 15,
      image: 'https://m.media-amazon.com/images/I/81mTLXu8KEL._AC_SL1500_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'psu2',
      name: 'EVGA SuperNOVA 850W',
      scoreValue: 20,
      image: 'https://m.media-amazon.com/images/I/81vBffu9pEL._AC_SL1500_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'psu3',
      name: 'Seasonic Focus GX-650W',
      scoreValue: 12,
      image: 'https://m.media-amazon.com/images/I/81NBTP0w2pL._AC_SL1500_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'psu4',
      name: 'Thermaltake Toughpower GF1 750W',
      scoreValue: 17,
      image: 'https://m.media-amazon.com/images/I/91EkQ47ZstL._AC_SL1500_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'psu5',
      name: 'Cooler Master MWE Gold 650W',
      scoreValue: 13,
      image: 'https://m.media-amazon.com/images/I/81ymkE4NxeL._AC_SL1500_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'psu6',
      name: 'Be Quiet! Straight Power 11 850W',
      scoreValue: 22,
      image: 'https://m.media-amazon.com/images/I/81CZ2mfpx7L._AC_SL1500_.jpg',
      compatibleWith: {}
    }
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
