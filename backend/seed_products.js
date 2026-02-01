const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
    // Seller 1: Ramesh Farmer (Vegetables & Fruits) - 697da5b8a737d2b57a0458d1
    {
        name: "Fresh Baby Spinach",
        description: "Tender, organic baby spinach leaves harvested at dawn for maximum nutrients.",
        price: 180,
        category: "Vegetables",
        quantity: 50,
        unit: "kg",
        image_url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=1000",
        seller: "697da5b8a737d2b57a0458d1"
    },
    {
        name: "Vine-Ripened Heirloom Tomatoes",
        description: "Sun-drenched tomatoes with an authentic, deep flavor perfect for salads and sauces.",
        price: 120,
        category: "Vegetables",
        quantity: 100,
        unit: "kg",
        image_url: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=1000",
        seller: "697da5b8a737d2b57a0458d1"
    },
    {
        name: "Organic Red Fuji Apples",
        description: "Crisp, sweet, and incredibly juicy apples grown in the high-altitude orchards.",
        price: 280,
        category: "Fruits",
        quantity: 80,
        unit: "kg",
        image_url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?q=80&w=1000",
        seller: "697da5b8a737d2b57a0458d1"
    },
    {
        name: "Alphonso Mango Gold",
        description: "The king of mangoes. Extremely fragrant and buttery texture.",
        price: 850,
        category: "Fruits",
        quantity: 40,
        unit: "dozen",
        image_url: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1000",
        seller: "697da5b8a737d2b57a0458d1"
    },
    {
        name: "Purple Spring Broccoli",
        description: "Vibrant purple broccoli heads packed with antioxidants and crunch.",
        price: 150,
        category: "Vegetables",
        quantity: 30,
        unit: "kg",
        image_url: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=1000",
        seller: "697da5b8a737d2b57a0458d1"
    },
    {
        name: "Sweet Ruby Pomegranates",
        description: "Bursting with juicy red arils. Hand-picked for perfect ripeness.",
        price: 190,
        category: "Fruits",
        quantity: 60,
        unit: "kg",
        image_url: "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?q=80&w=1000",
        seller: "697da5b8a737d2b57a0458d1"
    },
    {
        name: "Rainbow Carrots",
        description: "A beautiful mix of purple, orange, and yellow organic carrots.",
        price: 140,
        category: "Vegetables",
        quantity: 45,
        unit: "kg",
        image_url: "https://images.unsplash.com/photo-1444312645910-ffa973656eba?q=80&w=1000",
        seller: "697da5b8a737d2b57a0458d1"
    },
    {
        name: "Zesty Thai Green Chilies",
        description: "Small but potent chilies to add that perfect heat to your dishes.",
        price: 60,
        category: "Vegetables",
        quantity: 200,
        unit: "g",
        image_url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?q=80&w=1000",
        seller: "697da5b8a737d2b57a0458d1"
    },
    {
        name: "Thompson Seedless Grapes",
        description: "Firm, sweet, and seedless green grapes grown in low-pesticide estates.",
        price: 220,
        category: "Fruits",
        quantity: 75,
        unit: "kg",
        image_url: "https://images.unsplash.com/photo-1537640538966-79f369bd41f5?q=80&w=1000",
        seller: "697da5b8a737d2b57a0458d1"
    },
    {
        name: "Butternut Squash",
        description: "Creamy and nutty squash, ideal for roasting or making soups.",
        price: 110,
        category: "Vegetables",
        quantity: 35,
        unit: "kg",
        image_url: "https://images.unsplash.com/photo-1543326162-42c676af740d?q=80&w=1000",
        seller: "697da5b8a737d2b57a0458d1"
    },

    // Seller 2: Rang (Seeds & Tools) - 697da884e806e3a7cee08f0b
    {
        name: "Wildflower Bee-Friendly Seeds",
        description: "A specially curated mix of seeds to attract bees and butterflies to your garden.",
        price: 350,
        category: "Seeds",
        quantity: 100,
        unit: "packet",
        image_url: "https://images.unsplash.com/photo-1599148482840-d71701404c23?q=80&w=1000",
        seller: "697da884e806e3a7cee08f0b"
    },
    {
        name: "Titan Giant Sunflower Seeds",
        description: "Grow massive sunflowers up to 12 feet tall with these premium seeds.",
        price: 150,
        category: "Seeds",
        quantity: 150,
        unit: "packet",
        image_url: "https://images.unsplash.com/photo-1470406852800-b97e5d92e2aa?q=80&w=1000",
        seller: "697da884e806e3a7cee08f0b"
    },
    {
        name: "Stainless Steel Hand Trowel",
        description: "Ergonomic, rust-resistant trowel for all your planting and weeding needs.",
        price: 450,
        category: "Tools",
        quantity: 25,
        unit: "unit",
        image_url: "https://images.unsplash.com/photo-1617576621334-91608666504a?q=80&w=1000",
        seller: "697da884e806e3a7cee08f0b"
    },
    {
        name: "Precision Pruning Shears",
        description: "Carbon steel blades for clean, easy cuts on your valuable plants.",
        price: 750,
        category: "Tools",
        quantity: 15,
        unit: "unit",
        image_url: "https://images.unsplash.com/photo-1589133880922-ebb2584104be?q=80&w=1000",
        seller: "697da884e806e3a7cee08f0b"
    },
    {
        name: "Copper Watering Can - 2L",
        description: "Elegant and durable copper watering can with a long spout for precise watering.",
        price: 1250,
        category: "Tools",
        quantity: 10,
        unit: "unit",
        image_url: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=1000",
        seller: "697da884e806e3a7cee08f0b"
    },
    {
        name: "Organic Red Chili Seeds",
        description: "Bird's eye chili seeds with high germination rate and exceptional spice.",
        price: 120,
        category: "Seeds",
        quantity: 200,
        unit: "packet",
        image_url: "https://images.unsplash.com/photo-1528666113571-001097e3fb6b?q=80&w=1000",
        seller: "697da884e806e3a7cee08f0b"
    },
    {
        name: "Heavy Duty Garden Rake",
        description: "14-tine forged steel rake with a sturdy ash wood handle.",
        price: 950,
        category: "Tools",
        quantity: 12,
        unit: "unit",
        image_url: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?q=80&w=1000",
        seller: "697da884e806e3a7cee08f0b"
    },
    {
        name: "Hybrid Cherry Tomato Seeds",
        description: "Producing clusters of sweet, bite-sized tomatoes throughout the summer.",
        price: 200,
        category: "Seeds",
        quantity: 120,
        unit: "packet",
        image_url: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=1000",
        seller: "697da884e806e3a7cee08f0b"
    },
    {
        name: "Genovese Basil Seeds",
        description: "The classic large-leaf basil, perfect for pesto and cooking.",
        price: 95,
        category: "Seeds",
        quantity: 300,
        unit: "packet",
        image_url: "https://images.unsplash.com/photo-1618376168163-967aa04677fd?q=80&w=1000",
        seller: "697da884e806e3a7cee08f0b"
    },
    {
        name: "Digital Soil pH Meter",
        description: "Instant and accurate reading of your soil acidity for expert gardening.",
        price: 1850,
        category: "Tools",
        quantity: 8,
        unit: "unit",
        image_url: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=1000",
        seller: "697da884e806e3a7cee08f0b"
    },

    // Seller 3: Green Valley Farms (Dairy & Mix) - 697dab4f7fe8137381770ccf
    {
        name: "A2 Desi Cow Milk",
        description: "Farm-fresh milk from grass-fed desi cows, delivered within hours of milking.",
        price: 95,
        category: "Organic Dairy",
        quantity: 100,
        unit: "liter",
        image_url: "https://images.unsplash.com/photo-1550583724-125581fe2f8a?q=80&w=1000",
        seller: "697dab4f7fe8137381770ccf"
    },
    {
        name: "Pure Bilona Cow Ghee",
        description: "Ancient Bilona method ghee, hand-churned for medicinal properties.",
        price: 1450,
        category: "Organic Dairy",
        quantity: 50,
        unit: "ml",
        image_url: "https://images.unsplash.com/photo-1589133880922-ebb2584104be?q=80&w=1000",
        seller: "697dab4f7fe8137381770ccf"
    },
    {
        name: "Fresh Malai Paneer",
        description: "Exceedingly soft and fresh cottage cheese made without any preservatives.",
        price: 250,
        category: "Organic Dairy",
        quantity: 40,
        unit: "g",
        image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1000",
        seller: "697dab4f7fe8137381770ccf"
    },
    {
        name: "Organic Forest Honey",
        description: "Raw, unpasteurized honey collected from deep forest wild beehives.",
        price: 550,
        category: "Organic Dairy",
        quantity: 30,
        unit: "g",
        image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1000",
        seller: "697dab4f7fe8137381770ccf"
    },
    {
        name: "Fresh Farm Eggs (Cage Free)",
        description: "Healthy, nutrition-rich eggs from free-range hormone-free hens.",
        price: 160,
        category: "Organic Dairy",
        quantity: 40,
        unit: "dozen",
        image_url: "https://images.unsplash.com/photo-1582722472200-d336a14e9f73?q=80&w=1000",
        seller: "697dab4f7fe8137381770ccf"
    },
    {
        name: "Organic Alpino Strawberries",
        description: "Sweet and tangy strawberries grown using strictly organic methods.",
        price: 350,
        category: "Fruits",
        quantity: 25,
        unit: "box",
        image_url: "https://images.unsplash.com/photo-1464960320293-d785f877e8a2?q=80&w=1000",
        seller: "697dab4f7fe8137381770ccf"
    },
    {
        name: "Thick Probiotic Curd",
        description: "Creamy curd with live probiotic cultures for better gut health.",
        price: 85,
        category: "Organic Dairy",
        quantity: 60,
        unit: "g",
        image_url: "https://images.unsplash.com/photo-1481931098730-11263884c592?q=80&w=1000",
        seller: "697dab4f7fe8137381770ccf"
    },
    {
        name: "Greek Style Plain Yogurt",
        description: "Strained yogurt with high protein and zero added sugar.",
        price: 140,
        category: "Organic Dairy",
        quantity: 45,
        unit: "g",
        image_url: "https://images.unsplash.com/photo-1573033527506-6f8e79c0903c?q=80&w=1000",
        seller: "697dab4f7fe8137381770ccf"
    },
    {
        name: "Garden Digging Spade",
        description: "Polished carbon steel blade with a classic D-handle for heavy tasks.",
        price: 650,
        category: "Tools",
        quantity: 20,
        unit: "unit",
        image_url: "https://images.unsplash.com/photo-1594488630128-44-6b0994fd747ef?q=80&w=1000",
        seller: "697dab4f7fe8137381770ccf"
    },
    {
        name: "Organic Salted Butter",
        description: "Churned from fresh cream with a touch of Himalayan pink salt.",
        price: 320,
        category: "Organic Dairy",
        quantity: 35,
        unit: "g",
        image_url: "https://images.unsplash.com/photo-1589114934421-3d91943759ee?q=80&w=1000",
        seller: "697dab4f7fe8137381770ccf"
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB...');

        // Clear existing products to ensure a fresh, consistent inventory as requested
        await Product.deleteMany({});

        await Product.insertMany(products);
        require('fs').writeFileSync('seed_result.txt', '30 Premium entries registered successfully!');
        process.exit();
    } catch (err) {
        require('fs').writeFileSync('seed_result.txt', `Error: ${err.message}`);
        process.exit(1);
    }
};

seedProducts();
