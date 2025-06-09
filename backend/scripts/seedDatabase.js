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
      },
      description: "Intel Core i7-12700K është një procesor i fuqishëm me 12 bërthama që oferon performancë të shkëlqyer për gaming dhe punë intensive. Është i përshtatshëm për motherboard ASUS ROG Strix Z690-E dhe Gigabyte Z790 për shkak të soketit të përbashkët LGA1700. Përputhja me GPU si RTX 3080 siguron balancë të mirë performancës pa bottleneck."
    },
    {
      _id: 'cpu2',
      name: 'AMD Ryzen 7 5800X',
      scoreValue: 28,
      image: 'https://m.media-amazon.com/images/I/71WPGXQLcLL._AC_SL1500_.jpg',
      compatibleWith: {
        motherboard: ['MSI MPG B550 Gaming Edge', 'ASRock B550 Phantom Gaming'],
        gpu: ['AMD RX 6800 XT', 'NVIDIA RTX 3060 Ti', 'AMD RX 6700 XT', 'NVIDIA RTX 4070', 'Intel Arc A770']
      },
      description: "AMD Ryzen 7 5800X me arkitekturë Zen 3 oferton performancë të shkëlqyer single-core për gaming. Përputhet mirë me motherboard MSI MPG B550 për shkak të soketit AM4. Kombinimi me GPU AMD RX 6800 XT lehtëson komunikimin e shpejtë përmes teknologjisë Smart Access Memory."
    },
    {
      _id: 'cpu3',
      name: 'Intel Core i5-12600K',
      scoreValue: 25,
      image: 'https://m.media-amazon.com/images/I/51saxT83YWL.jpg',
      compatibleWith: {
        motherboard: ['ASUS ROG Strix Z690-E', 'Gigabyte Z790 Aorus Elite'],
        gpu: ['NVIDIA RTX 3060 Ti', 'AMD RX 6700 XT', 'NVIDIA RTX 4070', 'Intel Arc A770']
      },
      description: "Intel Core i5-12600K është një zgjedhje e shkëlqyer për gaming me performancë të mirë për çmimin. Përputhet me motherboard Z690 dhe Z790 për shkak të mbështetjes për DDR4 dhe PCIe 5.0. GPU si RTX 3060 Ti janë zgjedhje ideale për të shmangur bottleneck."
    },
    {
      _id: 'cpu4',
      name: 'AMD Ryzen 9 5900X',
      scoreValue: 35,
      image: 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-9-5900x.jpg',
      compatibleWith: {
        motherboard: ['MSI MPG B550 Gaming Edge'],
        gpu: ['AMD RX 6800 XT']
      },
      description: "Ryzen 9 5900X me 12 bërthama është ideal për punë profesionale dhe gaming. Përputhet mirë me motherboard B550 për shkak të optimizimeve të BIOS. GPU AMD RX 6800 XT përfiton nga teknologjitë e AMD për performancë më të mirë."
    },
    {
      _id: 'cpu5',
      name: 'Intel Core i9-12900K',
      scoreValue: 40,
      image: 'https://www.dateks.lv/images/pic/2400/2400/926/1085.jpg',
      compatibleWith: {
        motherboard: ['Gigabyte Z790 Aorus Elite'],
        gpu: ['NVIDIA RTX 3080' ,'NVIDIA RTX 4070']
      },
      description: "Intel Core i9-12900K është njëri prej procesorëve më të fuqishëm për workstation dhe gaming. Përputhet me motherboard Z790 për shkak të mbështetjes për overclocking dhe PCIe 5.0. GPU të fuqishme si RTX 3080 janë të nevojshme për të shfrytëzuar plotësisht potencialin e tij."
    },
    {
      _id: 'cpu6',
      name: 'Intel Core i5-12400F',
      scoreValue: 22,
      image: 'https://computerpro.al/wp-content/uploads/2023/02/2-37.jpg',
      compatibleWith: {
        motherboard: ['ASUS ROG Strix Z690-E'],
        gpu: ['NVIDIA RTX 3060 Ti', 'AMD RX 6700 XT', 'Intel Arc A770']
      },
      description: "i5-12400F është një zgjedhje ekonomike për gaming me performancë të mirë. Përputhet me motherboard Z690 për shkak të soketit LGA1700. GPU si RTX 3060 Ti ofrojnë balancë të mirë performancë/çmim pa bottleneck."
    }
  ],
  ram: [
    {
      _id: 'ram1',
      name: 'Corsair Vengeance 16GB DDR4',
      scoreValue: 15,
      image: 'https://img.overclockers.co.uk/images/MY-4A5-CS/4e8a7ed8ae822d73f40093d0068237af.jpg',
      compatibleWith: {},
      description: "Corsair Vengeance 16GB DDR4 është memorie e besueshme me shpejtësi të mirë për shumicën e nevojave të gaming. Përputhet me të gjitha motherboard modernë që mbështesin DDR4. Kapaciteti 16GB është optimal për gaming aktual."
    },
    {
      _id: 'ram2',
      name: 'G.Skill Trident Z 32GB DDR4',
      scoreValue: 20,
      image: 'https://m.media-amazon.com/images/I/61l4EStxhnL._AC_UF1000,1000_QL80_.jpg',
      compatibleWith: {},
      description: "G.Skill Trident Z 32GB DDR4 ofron performancë të lartë me dizajn RGB. Kapaciteti 32GB është ideal për workstation dhe gaming me kërkesa të larta. Përputhet mirë me motherboard gaming për shkak të profileve XMP të optimizuara."
    },
    {
      _id: 'ram3',
      name: 'Kingston Fury 64GB DDR4',
      scoreValue: 25,
      image: 'https://m.media-amazon.com/images/I/61xzrtoGKXL._AC_UF350,350_QL80_DpWeblab_.jpg',
      compatibleWith: {},
      description: "Kingston Fury 64GB DDR4 është ideal për workstation profesionale dhe rendering. Kapaciteti i madh lejon punë me projekte komplekse pa probleme. Përputhet mirë me motherboard workstation për shkak të stabilitetit të lartë."
    },
    {
      _id: 'ram4',
      name: 'Teamgroup T-Force Delta RGB 16GB DDR4',
      scoreValue: 18,
      image: 'https://microless.com/cdn/products/e69d028be0f58fdc3775c42b27fa847d-hi.jpg',
      compatibleWith: {},
      description: "Teamgroup T-Force Delta RGB kombinon performancë dhe dritë RGB. 16GB është e mjaftueshme për shumicën e lojrave. Përputhet mirë me motherboard gaming për shkak të sinkronizimit të dritave RGB me sisteme të tjera."
    },
    {
      _id: 'ram5',
      name: 'Crucial Ballistix 32GB DDR4',
      scoreValue: 22,
      image: 'https://m.media-amazon.com/images/I/51Fkwz3IHAS._AC_UF1000,1000_QL80_.jpg',
      compatibleWith: {},
      description: "Crucial Ballistix 32GB DDR4 ofron performancë të lartë për gaming dhe punë kreative. Përputhet mirë me të gjitha platformat për shkak të kompatibilitetit të gjerë. Timinget e ulëta i bëjnë ideale për overclocking."
    },
    {
      _id: 'ram6',
      name: 'Patriot Viper Steel 64GB DDR4',
      scoreValue: 27,
      image: 'https://www.tradeinn.com/f/14025/140251573/patriot-viper-steel-pvb464g360c8k-64gb-2x32gb-ddr4-3600mhz-ram.webp',
      compatibleWith: {},
      description: "Patriot Viper Steel 64GB DDR4 është zgjidhje profesionale për workstation. Kapaciteti i madh lejon punë me aplikacione intensive. Përputhet mirë me motherboard workstation për shkak të stabilitetit të lartë në ngarkesa të rënda."
    }
  ],
  gpu: [
    {
      _id: 'gpu1',
      name: 'NVIDIA RTX 3080',
      scoreValue: 40,
      image: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3080/geforce-rtx-3080-shop-600-p@2x.png',
      compatibleWith: {
        powerSupply: { minWattage: 750 },
        cpu: ['Intel Core i7-12700K', 'Intel Core i9-12900K']
      },
      description: "NVIDIA RTX 3080 është një GPU i fuqishëm për gaming 4K. Kërkon PSU 750W për funksionim të qëndrueshëm. Përputhet mirë me CPU të fuqishëm si i7-12700K për të shmangur bottleneck. Teknologjia DLSS ofron performancë të shkëlqyer në lojëra."
    },
    {
      _id: 'gpu2',
      name: 'AMD RX 6800 XT',
      scoreValue: 38,
      image: 'https://www.notebookcheck.net/uploads/tx_nbc2/Radeon_RX_6800_XT_1.jpg',
      compatibleWith: {
        powerSupply: { minWattage: 700 },
        cpu: ['AMD Ryzen 7 5800X', 'AMD Ryzen 9 5900X']
      },
      description: "AMD RX 6800 XT ofron performancë konkurruese me RTX 3080. Përputhet mirë me CPU AMD për shkak të teknologjisë Smart Access Memory. Kërkon PSU 700W për funksionim optimal. Ideal për gaming në rezolucione të larta."
    },
    {
      _id: 'gpu3',
      name: 'NVIDIA RTX 3060 Ti',
      scoreValue: 30,
      image: 'https://www.pny.com/productimages/927800C5-248A-4F52-A2D3-AEF30122DC9A/images/PNY-GeForce-RTX-3060-Ti-B-la.png',
      compatibleWith: {
        powerSupply: { minWattage: 600 },
        cpu: ['Intel Core i7-12700K', 'Intel Core i5-12600K', 'AMD Ryzen 7 5800X', 'Intel Core i5-12400F']
      },
      description: "RTX 3060 Ti ofron raport të shkëlqyer performancë/çmim për gaming 1440p. Përputhet mirë me CPU të mesëm për shkak të balancës së mirë. Kërkon vetëm PSU 600W. Teknologjia DLSS e bën të mirë për lojëra me RTX."
    },
    {
      _id: 'gpu4',
      name: 'AMD RX 6700 XT',
      scoreValue: 32,
      image: 'https://tpucdn.com/gpu-specs/images/c/3695-bottom.jpg',
      compatibleWith: {
        powerSupply: { minWattage: 650 },
        cpu: ['Intel Core i7-12700K', 'Intel Core i5-12600K', 'AMD Ryzen 7 5800X', 'Intel Core i5-12400F']
      },
      description: "AMD RX 6700 XT është zgjedhje e mirë për gaming 1440p. Përputhet mirë me CPU të mesëm për shkak të balancës së performancës. Kërkon PSU 650W. Performanca e mirë në lojëra pa RTX."
    },
    {
      _id: 'gpu5',
      name: 'NVIDIA RTX 4070',
      scoreValue: 42,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR_luHzpA4-FeROQCMUG3SqCvXnA9eDl4iVw&s',
      compatibleWith: {
        powerSupply: { minWattage: 650 },
        cpu: ['Intel Core i7-12700K', 'Intel Core i5-12600K', 'AMD Ryzen 7 5800X', 'Intel Core i9-12900K'] 
      },
      description: "RTX 4070 është GPU i ri me teknologji të re DLSS 3. Përputhet mirë me CPU të fuqishëm për shkak të performancës së lartë. Kërkon vetëm PSU 650W falë efikasitetit të përmirësuar. Ideal për gaming 1440p dhe 4K me DLSS."
    },
    {
      _id: 'gpu6',
      name: 'Intel Arc A770',
      scoreValue: 28,
      image: 'https://www.guru3d.com/data/publish/221/3436d6bc6121a4eb4c342baa8638ac2c1dad8e/img_0705.jpg',
      compatibleWith: {
        powerSupply: { minWattage: 550 },
        cpu: ['Intel Core i7-12700K', 'Intel Core i5-12600K', 'AMD Ryzen 7 5800X', 'Intel Core i5-12400F'] 
      },
      description: "Intel Arc A770 është zgjedhje ekonomike me mbështetje për ray tracing. Përputhet mirë me CPU të mesëm për shkak të performancës së kufizuar. Kërkon vetëm PSU 550W. I përshtatshëm për gaming 1080p dhe 1440p."
    }
  ],
  ssd: [
    {
      _id: 'ssd1',
      name: 'Samsung 980 Pro 1TB',
      scoreValue: 15,
      image: 'https://www.albagame.al/cdn/shop/products/samsung-980-pro-1tb-ssd-with-heat-sink-nvme-m-2-mz-v8p1t0cw-eu.jpg?v=1716398869',
      compatibleWith: {},
      description: "Samsung 980 Pro 1TB është një nga SSD-të më të shpejtë NVMe në treg. Shpejtësia e lartë e leximit/shkrimit e bën ideal për gaming dhe punë profesionale. Përputhet me të gjitha motherboard modernë me slot M.2 NVMe."
    },
    {
      _id: 'ssd2',
      name: 'WD Black SN850 2TB',
      scoreValue: 20,
      image: 'https://m.media-amazon.com/images/I/41PiQxCFXqL._AC_UF1000,1000_QL80_DpWeblab_.jpg',
      compatibleWith: {},
      description: "WD Black SN850 2TB ofron kapacitet të madh dhe performancë të shkëlqyer për workstation. Përputhet mirë me sisteme të performancës së lartë për shkak të shpejtësisë së lartë PCIe 4.0. Ideal për ruajtje të shpejtë të të dhënave."
    },
    {
      _id: 'ssd3',
      name: 'Crucial P5 Plus 500GB',
      scoreValue: 10,
      image: 'https://lv4tech.com/wp-content/uploads/2023/09/p5p500g-2.png',
      compatibleWith: {},
      description: "Crucial P5 Plus 500GB është zgjedhje ekonomike për sistemet bazë. Përputhet mirë me budget builds për shkak të çmimit të volitshëm. Kapaciteti 500GB është i mjaftueshëm për sistemin operativ dhe disa lojëra."
    },
    {
      _id: 'ssd4',
      name: 'Sabrent Rocket Q 1TB',
      scoreValue: 14,
      image: 'https://gzhls.at/i/05/44/2180544-n3.jpg',
      compatibleWith: {},
      description: "Sabrent Rocket Q 1TB ofron raport të mirë performancë/çmim. Përputhet mirë me sisteme gaming për shkak të shpejtësisë së mirë për lojëra. Teknologjia QLC siguron kapacitet të madh në çmim të volitshëm."
    },
    {
      _id: 'ssd5',
      name: 'ADATA XPG GAMMIX S70 Blade 2TB',
      scoreValue: 22,
      image: 'https://webapi3.adata.com/storage/product/s70_blade_a05.png',
      compatibleWith: {},
      description: "ADATA XPG GAMMIX S70 Blade 2TB është SSD shumë i shpejtë për gaming dhe punë kreative. Përputhet mirë me workstation për shkak të kapacitetit të madh dhe shpejtësisë së lartë. Dizajni pa heatsink e bën të përshtatshëm për shumicën e sistemeve."
    },
    {
      _id: 'ssd6',
      name: 'Kingston KC3000 1TB',
      scoreValue: 18,
      image: 'https://gv466hf5ah.gjirafa.net/image/2955/2955417.jpg',
      compatibleWith: {},
      description: "Kingston KC3000 1TB ofron performancë të besueshme për përdoruesit e përditshëm. Përputhet mirë me sisteme të ndryshme për shkak të kompatibilitetit të gjerë. Shpejtësia e lartë e leximit/shkrimit përmirëson përvojën e përdorimit."
    }
  ],
  motherboard: [
    {
      _id: 'mobo1',
      name: 'ASUS ROG Strix Z690-E',
      scoreValue: 25,
      image: 'https://dlcdnwebimgs.asus.com/files/media/F06BD967-FC83-4514-8AC4-760944D051CC/v2/img/style/id-design.png',
      compatibleWith: { cpu: ['Intel Core i7-12700K', 'Intel Core i5-12600K', 'Intel Core i9-12900K', 'Intel Core i5-12400F'] },
      description: "ASUS ROG Strix Z690-E është motherboard premium për Intel 12th/13th Gen. Përputhet mirë me CPU Intel për shkak të soketit LGA1700. Ofron shumë opsione për overclocking dhe PCIe 5.0 për komponente të ardhshme."
    },
    {
      _id: 'mobo2',
      name: 'MSI MPG B550 Gaming Edge',
      scoreValue: 20,
      image: 'https://asset.msi.com/resize/image/global/product/product_6_20200603173652_5ed76f343312c.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png',
      compatibleWith: { cpu: ['AMD Ryzen 7 5800X', 'AMD Ryzen 9 5900X'] },
      description: "MSI MPG B550 Gaming Edge është zgjedhje e mirë për AMD Ryzen. Përputhet mirë me CPU AMD për shkak të soketit AM4 dhe mbështetjes për PCIe 4.0. Ofron cooling të mirë për VRM dhe opsione të mira për gaming."
    },
    {
      _id: 'mobo3',
      name: 'Gigabyte Z790 Aorus Elite',
      scoreValue: 30,
      image: 'https://www.gigabyte.com/FileUpload/Global/KeyFeature/2499/innergigabyte/images/product/rgb/cover.png',
      compatibleWith: { cpu: ['Intel Core i7-12700K', 'Intel Core i5-12600K', 'Intel Core i9-12900K'] },
      description: "Gigabyte Z790 Aorus Elite është motherboard i fuqishëm për Intel 12th/13th Gen. Përputhet mirë me CPU të fuqishëm për shkak të dizajnit të fortë VRM. Ofron shumë porta dhe mbështetje për overclocking."
    },
    {
      _id: 'mobo4',
      name: 'ASRock B550 Phantom Gaming',
      scoreValue: 22,
      image: 'https://pg.asrock.com/mb/photo/B550%20Phantom%20Gaming%204(L2).png',
      compatibleWith: { cpu: ['AMD Ryzen 7 5800X'] },
      description: "ASRock B550 Phantom Gaming është zgjedhje e mirë për AMD Ryzen me çmim të volitshëm. Përputhet mirë me Ryzen 7 5800X për shkak të optimizimeve të BIOS. Ofron performancë të qëndrueshme për gaming."
    },
    {
      _id: 'mobo5',
      name: 'MSI Z690 PRO',
      scoreValue: 27,
      image: 'https://asset.msi.com/resize/image/global/product/product_17011617939d6202da2891bc20ecae8fb3682781dc.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png',
      compatibleWith: { cpu: ['Intel Core i7-12700K' ] },
      description: "MSI Z690 PRO është motherboard i mirë për Intel 12th Gen. Përputhet mirë me i7-12700K për shkak të dizajnit të bilancuar VRM. Ofron të gjitha karakteristikat kryesore pa koston e lartë të modeleve premium."
    },
    {
      _id: 'mobo6',
      name: 'ASUS TUF Gaming B550-PLUS',
      scoreValue: 24,
      image: 'https://www.asus.com/websites/global/products/dvy2c3hgqjvmpugy/img/kv/x570.png',
      compatibleWith: { cpu: ['AMD Ryzen 9 5900X'] },
      description: "ASUS TUF Gaming B550-PLUS është motherboard i qëndrueshëm për AMD Ryzen. Përputhet mirë me Ryzen 9 5900X për shkak të coolingut të mirë VRM. Dizajni i fortë i bën të përshtatshëm për sisteme gaming intensive."
    }
  ],
  powerSupply: [
    {
      _id: 'psu1',
      name: 'Corsair RM750x 750W',
      scoreValue: 15,
      image: 'https://www.foleja.com/cdn-cgi/image/fit=scale-down,format=auto,height=1600,width=1600/media/1d/01/21/1729166905/corsair-rm750x-cp-9020285-eu-kom-200202056-0.webp',
      compatibleWith: {},
      description: "Corsair RM750x 750W është PSU me efikasitet të lartë 80+ Gold. Përputhet mirë me sisteme gaming të mesme për shkak të fuqisë së mjaftueshme për GPU të mesme. Kabllot modulare e bëjnë instalimin më të lehtë."
    },
    {
      _id: 'psu2',
      name: 'EVGA SuperNOVA 850W',
      scoreValue: 20,
      image: 'https://www.singular.com.cy/images/detailed/328/EVGA_SuperNOVA_850_GA_Power_supply_220-GA-0850-X2-391787.jpg',
      compatibleWith: {},
      description: "EVGA SuperNOVA 850W është PSU i besueshëm për sisteme të fuqishme. Përputhet mirë me GPU të fuqishme për shkak të fuqisë së lartë dhe cilësisë së lartë. 80+ Gold certification siguron efikasitet të mirë."
    },
    {
      _id: 'psu3',
      name: 'Seasonic Focus GX-650W',
      scoreValue: 12,
      image: 'https://www.dekada.com/en/images/seasonic_atx31_focus_gx_850_v4_01_15AeTk.jpg',
      compatibleWith: {},
      description: "Seasonic Focus GX-650W është zgjedhje e mirë për sisteme me buxhet të kufizuar. Përputhet mirë me konfigurime bazë për shkak të efikasitetit dhe cilësisë së mirë në çmim të volitshëm. 80+ Gold certification për kursim energjie."
    },
    {
      _id: 'psu4',
      name: 'Thermaltake Toughpower GF 750W',
      scoreValue: 17,
      image: 'https://images.anandtech.com/doci/21073/THERMALTAKE_TOUGHPOWER_GF_A3_750W_05.jpg',
      compatibleWith: {},
      description: "Thermaltake Toughpower GF 750W ofron fuqi të mjaftueshme për shumicën e sistemeve gaming. Përputhet mirë me sisteme të mesme për shkak të cilësisë së mirë dhe çmimit të arsyeshëm. Kabllot plotësisht modulare për menaxhim më të mirë të kabllove."
    },
    {
      _id: 'psu5',
      name: 'Cooler Master MWE Gold 650W',
      scoreValue: 13,
      image: 'https://a.storyblok.com/f/281110/22f859adec/mwe-gold-650-v2-full-modular-gallery-5.png/m/960x0/smart',
      compatibleWith: {},
      description: "Cooler Master MWE Gold 650W është zgjedhje ekonomike për sisteme bazë. Përputhet mirë me PC me buxhet të kufizuar për shkak të çmimit të volitshëm dhe cilësisë së pranueshme. 80+ Gold certification për efikasitet."
    },
    {
      _id: 'psu6',
      name: 'Be Quiet! Straight Power 850W',
      scoreValue: 22,
      image: 'https://www.bequiet.com/volumes/pim/powersupply/straightpower/straightpower12/XR/750W-1000W/004.jpg',
      compatibleWith: {},
      description: "Be Quiet! Straight Power 850W është PSU i qetë dhe i fuqishëm. Përputhet mirë me sisteme workstation për shkak të fuqisë së lartë dhe operimit të qetë. 80+ Platinum certification për efikasitet maksimal."
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