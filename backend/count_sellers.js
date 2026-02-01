const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Seller = require('./models/Seller');

dotenv.config();

const countSellers = async () => {
    try {
        console.log('Connecting to Registry Database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connection Established.');
        const totalSellers = await Seller.countDocuments({});
        const activeSellers = await Seller.countDocuments({ status: 'active' });
        const pendingSellers = await Seller.countDocuments({ status: 'pending' });

        const report = `--- OneKart Seller Accounts Report ---
Total Seller Accounts: ${totalSellers}
Active Estates: ${activeSellers}
Pending Approval: ${pendingSellers}
--------------------------------------`;

        require('fs').writeFileSync('seller_report.txt', report);
        process.exit();
    } catch (error) {
        console.error('Error counting sellers:', error);
        process.exit(1);
    }
};

countSellers();
