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
      image: 'https://www.dateks.lv/images/pic/1200/1200/924/1085.jpg',
      compatibleWith: {
        motherboard: ['ASUS ROG Strix Z690-E', 'Gigabyte Z790 Aorus Elite'],
         gpu: ['NVIDIA RTX 3080', 'NVIDIA RTX 3060 Ti', 'AMD RX 6700 XT', 'NVIDIA RTX 4070', 'Intel Arc A770']
      }
    },
    {
      _id: 'cpu2',
      name: 'AMD Ryzen 7 5800X',
      scoreValue: 28,
      image: 'https://m.media-amazon.com/images/I/71WPGXQLcLL._AC_SL1500_.jpg',
      compatibleWith: {
        motherboard: ['MSI MPG B550 Gaming Edge'],
        gpu: ['AMD RX 6800 XT', 'NVIDIA RTX 3060 Ti', 'AMD RX 6700 XT', 'NVIDIA RTX 4070', 'Intel Arc A770']
      }
    },
    {
      _id: 'cpu3',
      name: 'Intel Core i5-12600K',
      scoreValue: 25,
      image: 'https://m.media-amazon.com/images/I/51saxT83YWL.jpg',
      compatibleWith: {
        motherboard: ['ASUS ROG Strix Z690-E', 'Gigabyte Z790 Aorus Elite'],
        gpu: ['NVIDIA RTX 3060 Ti', 'AMD RX 6700 XT', 'NVIDIA RTX 4070', 'Intel Arc A770']
      }
    },
    {
      _id: 'cpu4',
      name: 'AMD Ryzen 9 5900X',
      scoreValue: 35,
      image: 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-9-5900x.jpg',
      compatibleWith: {
        motherboard: ['MSI MPG B550 Gaming Edge'],
        gpu: ['AMD RX 6800 XT']
      }
    },
    {
      _id: 'cpu5',
      name: 'Intel Core i9-12900K',
      scoreValue: 40,
      image: 'https://www.dateks.lv/images/pic/2400/2400/926/1085.jpg',
      compatibleWith: {
        motherboard: ['Gigabyte Z790 Aorus Elite'],
        gpu: ['NVIDIA RTX 3080' ,'NVIDIA RTX 4070']
      }
    },
    {
      _id: 'cpu6',
      name: 'Intel Core i5-12400F',
      scoreValue: 22,
      image: 'https://computerpro.al/wp-content/uploads/2023/02/2-37.jpg',
      compatibleWith: {
        motherboard: ['ASUS ROG Strix Z690-E'],
        gpu: ['NVIDIA RTX 3060 Ti', 'AMD RX 6700 XT', 'Intel Arc A770']
      }
    }
  ],
  ram: [
    {
      _id: 'ram1',
      name: 'Corsair Vengeance 16GB DDR4',
      scoreValue: 15,
      image: 'https://img.overclockers.co.uk/images/MY-4A5-CS/4e8a7ed8ae822d73f40093d0068237af.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ram2',
      name: 'G.Skill Trident Z 32GB DDR4',
      scoreValue: 20,
      image: 'https://m.media-amazon.com/images/I/61l4EStxhnL._AC_UF1000,1000_QL80_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ram3',
      name: 'Kingston Fury 64GB DDR4',
      scoreValue: 25,
      image: 'https://m.media-amazon.com/images/I/61xzrtoGKXL._AC_UF350,350_QL80_DpWeblab_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ram4',
      name: 'Teamgroup T-Force Delta RGB 16GB DDR4',
      scoreValue: 18,
      image: 'https://microless.com/cdn/products/e69d028be0f58fdc3775c42b27fa847d-hi.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ram5',
      name: 'Crucial Ballistix 32GB DDR4',
      scoreValue: 22,
      image: 'https://m.media-amazon.com/images/I/51Fkwz3IHAS._AC_UF1000,1000_QL80_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ram6',
      name: 'Patriot Viper Steel 64GB DDR4',
      scoreValue: 27,
      image: 'https://www.tradeinn.com/f/14025/140251573/patriot-viper-steel-pvb464g360c8k-64gb-2x32gb-ddr4-3600mhz-ram.webp',
      compatibleWith: {}
    }
  ],
gpu: [
  {
    _id: 'gpu1',
    name: 'NVIDIA RTX 3080',
    scoreValue: 40,
    image: 'https://images.evga.com/products/gallery/png/10G-P5-3897-RX_LG_1.png',
    compatibleWith: {
      powerSupply: { minWattage: 750 },
      cpu: ['Intel Core i7-12700K', 'Intel Core i9-12900K']
    }
  },
  {
    _id: 'gpu2',
    name: 'AMD RX 6800 XT',
    scoreValue: 38,
    image: 'https://www.notebookcheck.net/uploads/tx_nbc2/Radeon_RX_6800_XT_1.jpg',
    compatibleWith: {
      powerSupply: { minWattage: 700 },
      cpu: ['AMD Ryzen 7 5800X', 'AMD Ryzen 9 5900X']
    }
  },
  {
    _id: 'gpu3',
    name: 'NVIDIA RTX 3060 Ti',
    scoreValue: 30,
    image: 'https://www.pny.com/productimages/927800C5-248A-4F52-A2D3-AEF30122DC9A/images/PNY-GeForce-RTX-3060-Ti-B-la.png',
    compatibleWith: {
      powerSupply: { minWattage: 600 },
      cpu: ['Intel Core i7-12700K', 'Intel Core i5-12600K', 'AMD Ryzen 7 5800X', 'Intel Core i5-12400F']
    }
  },
  {
    _id: 'gpu4',
    name: 'AMD RX 6700 XT',
    scoreValue: 32,
    image: 'https://tpucdn.com/gpu-specs/images/c/3695-bottom.jpg',
    compatibleWith: {
      powerSupply: { minWattage: 650 },
      cpu: ['Intel Core i7-12700K', 'Intel Core i5-12600K', 'AMD Ryzen 7 5800X', 'Intel Core i5-12400F'] // No explicit compatibility listed in CPU objects; you can add CPUs here if desired.
    }
  },
  {
    _id: 'gpu5',
    name: 'NVIDIA RTX 4070',
    scoreValue: 42,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR_luHzpA4-FeROQCMUG3SqCvXnA9eDl4iVw&s',
    compatibleWith: {
      powerSupply: { minWattage: 650 },
      cpu: ['Intel Core i7-12700K', 'Intel Core i5-12600K', 'AMD Ryzen 7 5800X', 'Intel Core i9-12900K'] 
    }
  },
  {
    _id: 'gpu6',
    name: 'Intel Arc A770',
    scoreValue: 28,
    image: 'https://www.guru3d.com/data/publish/221/3436d6bc6121a4eb4c342baa8638ac2c1dad8e/img_0705.jpg',
    compatibleWith: {
      powerSupply: { minWattage: 550 },
      cpu: ['Intel Core i7-12700K', 'Intel Core i5-12600K', 'AMD Ryzen 7 5800X', 'Intel Core i5-12400F'] 
    }
  }
],
  ssd: [
    {
      _id: 'ssd1',
      name: 'Samsung 980 Pro 1TB',
      scoreValue: 15,
      image: 'https://www.albagame.al/cdn/shop/products/samsung-980-pro-1tb-ssd-with-heat-sink-nvme-m-2-mz-v8p1t0cw-eu.jpg?v=1716398869',
      compatibleWith: {}
    },
    {
      _id: 'ssd2',
      name: 'WD Black SN850 2TB',
      scoreValue: 20,
      image: 'https://m.media-amazon.com/images/I/41PiQxCFXqL._AC_UF1000,1000_QL80_DpWeblab_.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ssd3',
      name: 'Crucial P5 Plus 500GB',
      scoreValue: 10,
      image: 'https://lv4tech.com/wp-content/uploads/2023/09/p5p500g-2.png',
      compatibleWith: {}
    },
    {
      _id: 'ssd4',
      name: 'Sabrent Rocket Q 1TB',
      scoreValue: 14,
      image: 'https://gzhls.at/i/05/44/2180544-n3.jpg',
      compatibleWith: {}
    },
    {
      _id: 'ssd5',
      name: 'ADATA XPG GAMMIX S70 Blade 2TB',
      scoreValue: 22,
      image: 'https://webapi3.adata.com/storage/product/s70_blade_a05.png',
      compatibleWith: {}
    },
    {
      _id: 'ssd6',
      name: 'Kingston KC3000 1TB',
      scoreValue: 18,
      image: 'https://gv466hf5ah.gjirafa.net/image/2955/2955417.jpg',
      compatibleWith: {}
    }
  ],
  motherboard: [
    {
      _id: 'mobo1',
      name: 'ASUS ROG Strix Z690-E',
      scoreValue: 25,
      image: 'https://dlcdnwebimgs.asus.com/files/media/F06BD967-FC83-4514-8AC4-760944D051CC/v2/img/style/id-design.png',
      compatibleWith: { cpu: ['Intel Core i7-12700K', 'Intel Core i5-12600K', 'Intel Core i9-12900K', 'Intel Core i5-12400F'] }
    },
    {
      _id: 'mobo2',
      name: 'MSI MPG B550 Gaming Edge',
      scoreValue: 20,
      image: 'https://asset.msi.com/resize/image/global/product/product_6_20200603173652_5ed76f343312c.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png',
      compatibleWith: { cpu: ['AMD Ryzen 7 5800X', 'AMD Ryzen 9 5900X'] }
    },
    {
      _id: 'mobo3',
      name: 'Gigabyte Z790 Aorus Elite',
      scoreValue: 30,
      image: 'https://www.gigabyte.com/FileUpload/Global/KeyFeature/2499/innergigabyte/images/product/rgb/cover.png',
      compatibleWith: { cpu: ['Intel Core i7-12700K', 'Intel Core i5-12600K', 'Intel Core i9-12900K'] }
    },
    {
      _id: 'mobo4',
      name: 'ASRock B550 Phantom Gaming',
      scoreValue: 22,
      image: 'https://pg.asrock.com/mb/photo/B550%20Phantom%20Gaming%204(L2).png',
      compatibleWith: { cpu: ['AMD Ryzen 7 5800X'] }
    },
    {
      _id: 'mobo5',
      name: 'MSI Z690 PRO',
      scoreValue: 27,
      image: 'https://asset.msi.com/resize/image/global/product/product_17011617939d6202da2891bc20ecae8fb3682781dc.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png',
      compatibleWith: { cpu: ['Intel Core i7-12700K', 'Intel Core i9-12900K'] }
    },
    {
      _id: 'mobo6',
      name: 'ASUS TUF Gaming B550-PLUS',
      scoreValue: 24,
      image: 'https://www.asus.com/websites/global/products/dvy2c3hgqjvmpugy/img/kv/x570.png',
      compatibleWith: { cpu: ['AMD Ryzen 9 5900X'] }
    }
  ],
  powerSupply: [
    {
      _id: 'psu1',
      name: 'Corsair RM750x 750W',
      scoreValue: 15,
      image: 'https://www.foleja.com/cdn-cgi/image/fit=scale-down,format=auto,height=1600,width=1600/media/1d/01/21/1729166905/corsair-rm750x-cp-9020285-eu-kom-200202056-0.webp',
      compatibleWith: {}
    },
    {
      _id: 'psu2',
      name: 'EVGA SuperNOVA 850W',
      scoreValue: 20,
      image: 'https://www.singular.com.cy/images/detailed/328/EVGA_SuperNOVA_850_GA_Power_supply_220-GA-0850-X2-391787.jpg',
      compatibleWith: {}
    },
    {
      _id: 'psu3',
      name: 'Seasonic Focus GX-650W',
      scoreValue: 12,
      image: 'https://www.dekada.com/en/images/seasonic_atx31_focus_gx_850_v4_01_15AeTk.jpg',
      compatibleWith: {}
    },
    {
      _id: 'psu4',
      name: 'Thermaltake Toughpower GF 750W',
      scoreValue: 17,
      image: 'https://images.anandtech.com/doci/21073/THERMALTAKE_TOUGHPOWER_GF_A3_750W_05.jpg',
      compatibleWith: {}
    },
    {
      _id: 'psu5',
      name: 'Cooler Master MWE Gold 650W',
      scoreValue: 13,
      image: 'https://a.storyblok.com/f/281110/22f859adec/mwe-gold-650-v2-full-modular-gallery-5.png/m/960x0/smart',
      compatibleWith: {}
    },
    {
      _id: 'psu6',
      name: 'Be Quiet! Straight Power 850W',
      scoreValue: 22,
      image: 'https://www.bequiet.com/volumes/pim/powersupply/straightpower/straightpower12/XR/750W-1000W/004.jpg',
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
