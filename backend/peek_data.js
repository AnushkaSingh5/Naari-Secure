const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const checkFirst = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.useDb('risk_map');
        const doc = await db.collection('areas').findOne();
        console.log('Sample Document:', JSON.stringify(doc, null, 2));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkFirst();
