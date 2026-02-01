const products = [
    // Ramesh Farmer (Seller Index 0) - Vegetables & Fruits
    {
        name: "Fresh Baby Spinach",
        description: "Tender, organic baby spinach leaves harvested at dawn for maximum nutrients.",
        price: 180,
        category: "Vegetables",
        quantity: 50,
        unit: "kg",
        image_url: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 0
    },
    {
        name: "Vine-Ripened Heirloom Tomatoes",
        description: "Sun-drenched tomatoes with an authentic, deep flavor perfect for salads and sauces.",
        price: 120,
        category: "Vegetables",
        quantity: 100,
        unit: "kg",
        image_url: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 0
    },
    {
        name: "Organic Red Fuji Apples",
        description: "Crisp, sweet, and incredibly juicy apples grown in the high-altitude orchards.",
        price: 280,
        category: "Fruits",
        quantity: 80,
        unit: "kg",
        image_url: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 0
    },
    {
        name: "Alphonso Mango Gold",
        description: "The king of mangoes. Extremely fragrant and buttery texture.",
        price: 850,
        category: "Fruits",
        quantity: 40,
        unit: "dozen",
        image_url: "https://images.pexels.com/photos/2294477/pexels-photo-2294477.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 0
    },
    {
        name: "Purple Spring Broccoli",
        description: "Vibrant purple broccoli heads packed with antioxidants and crunch.",
        price: 150,
        category: "Vegetables",
        quantity: 30,
        unit: "kg",
        image_url: "https://images.pexels.com/photos/1359326/pexels-photo-1359326.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 0
    },
    {
        name: "Sweet Ruby Pomegranates",
        description: "Bursting with juicy red arils. Hand-picked for perfect ripeness.",
        price: 190,
        category: "Fruits",
        quantity: 60,
        unit: "kg",
        image_url: "https://images.pexels.com/photos/65254/pomegranate-open-fruit-fruit-65254.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 0
    },
    {
        name: "Rainbow Carrots",
        description: "A beautiful mix of purple, orange, and yellow organic carrots.",
        price: 140,
        category: "Vegetables",
        quantity: 45,
        unit: "kg",
        image_url: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 0
    },
    {
        name: "Zesty Thai Green Chilies",
        description: "Small but potent chilies to add that perfect heat to your dishes.",
        price: 60,
        category: "Vegetables",
        quantity: 200,
        unit: "g",
        image_url: "https://images.pexels.com/photos/928251/pexels-photo-928251.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 0
    },
    {
        name: "Thompson Seedless Grapes",
        description: "Firm, sweet, and seedless green grapes grown in low-pesticide estates.",
        price: 220,
        category: "Fruits",
        quantity: 75,
        unit: "kg",
        image_url: "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 0
    },
    {
        name: "Butternut Squash",
        description: "Creamy and nutty squash, ideal for roasting or making soups.",
        price: 110,
        category: "Vegetables",
        quantity: 35,
        unit: "kg",
        image_url: "https://images.pexels.com/photos/2893635/pexels-photo-2893635.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 0
    },

    // Rang Tools (Seller Index 1) - Seeds & Tools
    {
        name: "Wildflower Bee-Friendly Seeds",
        description: "A specially curated mix of seeds to attract bees and butterflies to your garden.",
        price: 350,
        category: "Seeds",
        quantity: 100,
        unit: "packet",
        image_url: "https://images.pexels.com/photos/169523/pexels-photo-169523.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 1
    },
    {
        name: "Titan Giant Sunflower Seeds",
        description: "Grow massive sunflowers up to 12 feet tall with these premium seeds.",
        price: 150,
        category: "Seeds",
        quantity: 150,
        unit: "packet",
        image_url: "https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 1
    },
    {
        name: "Stainless Steel Hand Trowel",
        description: "Ergonomic, rust-resistant trowel for all your planting and weeding needs.",
        price: 450,
        category: "Tools",
        quantity: 25,
        unit: "unit",
        image_url: "https://images.pexels.com/photos/36940/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 1
    },
    {
        name: "Precision Pruning Shears",
        description: "Carbon steel blades for clean, easy cuts on your valuable plants.",
        price: 750,
        category: "Tools",
        quantity: 15,
        unit: "unit",
        image_url: "https://images.pexels.com/photos/2561213/pexels-photo-2561213.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 1
    },
    {
        name: "Copper Watering Can - 2L",
        description: "Elegant and durable copper watering can with a long spout for precise watering.",
        price: 1250,
        category: "Tools",
        quantity: 10,
        unit: "unit",
        image_url: "https://images.pexels.com/photos/4505171/pexels-photo-4505171.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 1
    },
    {
        name: "Organic Red Chili Seeds",
        description: "Bird's eye chili seeds with high germination rate and exceptional spice.",
        price: 120,
        category: "Seeds",
        quantity: 200,
        unit: "packet",
        image_url: "https://images.pexels.com/photos/2090900/pexels-photo-2090900.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 1
    },
    {
        name: "Heavy Duty Garden Rake",
        description: "14-tine forged steel rake with a sturdy ash wood handle.",
        price: 950,
        category: "Tools",
        quantity: 12,
        unit: "unit",
        image_url: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 1
    },
    {
        name: "Hybrid Cherry Tomato Seeds",
        description: "Producing clusters of sweet, bite-sized tomatoes throughout the summer.",
        price: 200,
        category: "Seeds",
        quantity: 120,
        unit: "packet",
        image_url: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 1
    },
    {
        name: "Genovese Basil Seeds",
        description: "The classic large-leaf basil, perfect for pesto and cooking.",
        price: 95,
        category: "Seeds",
        quantity: 300,
        unit: "packet",
        image_url: "https://images.pexels.com/photos/1087902/pexels-photo-1087902.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 1
    },
    {
        name: "Digital Soil pH Meter",
        description: "Instant and accurate reading of your soil acidity for expert gardening.",
        price: 1850,
        category: "Tools",
        quantity: 8,
        unit: "unit",
        image_url: "https://images.pexels.com/photos/5945660/pexels-photo-5945660.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 1
    },

    // Green Valley Dairy (Seller Index 2) - Dairy & Mix
    {
        name: "A2 Desi Cow Milk",
        description: "Farm-fresh milk from grass-fed desi cows, delivered within hours of milking.",
        price: 95,
        category: "Dairy",
        quantity: 100,
        unit: "liter",
        image_url: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 2
    },
    {
        name: "Pure Bilona Cow Ghee",
        description: "Ancient Bilona method ghee, hand-churned for medicinal properties.",
        price: 1450,
        category: "Dairy",
        quantity: 50,
        unit: "kg",
        image_url: "https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 2
    },
    {
        name: "Fresh Malai Paneer",
        description: "Exceedingly soft and fresh cottage cheese made without any preservatives.",
        price: 250,
        category: "Dairy",
        quantity: 40,
        unit: "g",
        image_url: "https://images.pexels.com/photos/4109911/pexels-photo-4109911.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 2
    },
    {
        name: "Organic Forest Honey",
        description: "Raw, unpasteurized honey collected from deep forest wild beehives.",
        price: 550,
        category: "Pantry",
        quantity: 30,
        unit: "kg",
        image_url: "https://images.pexels.com/photos/3475653/pexels-photo-3475653.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 2
    },
    {
        name: "Fresh Farm Eggs (Cage Free)",
        description: "Healthy, nutrition-rich eggs from free-range hormone-free hens.",
        price: 160,
        category: "Dairy",
        quantity: 40,
        unit: "dozen",
        image_url: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 2
    },
    {
        name: "Organic Alpino Strawberries",
        description: "Sweet and tangy strawberries grown using strictly organic methods.",
        price: 350,
        category: "Fruits",
        quantity: 25,
        unit: "box",
        image_url: "https://images.pexels.com/photos/70737/pexels-photo-70737.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 2
    },
    {
        name: "Thick Probiotic Curd",
        description: "Creamy curd with live probiotic cultures for better gut health.",
        price: 85,
        category: "Dairy",
        quantity: 60,
        unit: "g",
        image_url: "https://images.pexels.com/photos/139746/pexels-photo-139746.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 2
    },
    {
        name: "Greek Style Plain Yogurt",
        description: "Strained yogurt with high protein and zero added sugar.",
        price: 140,
        category: "Dairy",
        quantity: 45,
        unit: "g",
        image_url: "https://images.pexels.com/photos/6309854/pexels-photo-6309854.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 2
    },
    {
        name: "Garden Digging Spade",
        description: "Polished carbon steel blade with a classic D-handle for heavy tasks.",
        price: 650,
        category: "Tools",
        quantity: 20,
        unit: "unit",
        image_url: "https://images.pexels.com/photos/1105018/pexels-photo-1105018.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 2
    },
    {
        name: "Organic Salted Butter",
        description: "Churned from fresh cream with a touch of Himalayan pink salt.",
        price: 320,
        category: "Dairy",
        quantity: 35,
        unit: "g",
        image_url: "https://images.pexels.com/photos/6310022/pexels-photo-6310022.jpeg?auto=compress&cs=tinysrgb&w=800",
        sellerIndex: 2
    }
];

module.exports = products;
