const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const AreaSchema = new mongoose.Schema({
    state: String,
    city: String,
    area: String,
    risk_level: String,
    risk_score: Number,
    lat: Number,
    lng: Number
}, { collection: 'areas' });

const seedData = [
    // Una (Himachal Pradesh) area
    { state: "Himachal Pradesh", city: "Una", area: "Una Central Mall", risk_level: "safe", risk_score: 15, lat: 31.4685, lng: 76.2708 },
    { state: "Himachal Pradesh", city: "Una", area: "Una Police Station Area", risk_level: "safe", risk_score: 5, lat: 31.4720, lng: 76.2800 },
    { state: "Himachal Pradesh", city: "Una", area: "Dark Alley near Highway", risk_level: "high", risk_score: 75, lat: 31.4620, lng: 76.2650 },
    { state: "Himachal Pradesh", city: "Una", area: "Industrial Outer Ring", risk_level: "Critical", risk_score: 90, lat: 31.4580, lng: 76.2550 },
    { state: "Himachal Pradesh", city: "Una", area: "Una Railway Station Rd", risk_level: "moderate", risk_score: 45, lat: 31.4780, lng: 76.2750 },

    // New Delhi area
    { state: "Delhi", city: "New Delhi", area: "Central Harmony Heights", risk_level: "Critical", risk_score: 85, lat: 28.6139, lng: 77.2090 },
    { state: "Delhi", city: "New Delhi", area: "Connaught Place Inner Circle", risk_level: "safe", risk_score: 12, lat: 28.6304, lng: 77.2177 },
    { state: "Delhi", city: "New Delhi", area: "India Gate Lawns", risk_level: "safe", risk_score: 8, lat: 28.6129, lng: 77.2295 },
    { state: "Delhi", city: "New Delhi", area: "Outer Ring Road Junction", risk_level: "high", risk_score: 68, lat: 28.6420, lng: 77.1850 },
    { state: "Delhi", city: "New Delhi", area: "Metro Station Parking Lot (Dimly Lit)", risk_level: "Critical", risk_score: 92, lat: 28.6250, lng: 77.2250 },
    { state: "Delhi", city: "New Delhi", area: "Rajpath Crossroad", risk_level: "moderate", risk_score: 35, lat: 28.6115, lng: 77.2185 },
    { state: "Delhi", city: "New Delhi", area: "Vasant Kunj Forest Border", risk_level: "high", risk_score: 72, lat: 28.5250, lng: 77.1550 },
    { state: "Delhi", city: "New Delhi", area: "Dwarka Sector 21 Outer", risk_level: "moderate", risk_score: 55, lat: 28.5520, lng: 77.0650 },
    { state: "Delhi", city: "New Delhi", area: "Chandni Chowk Market Area", risk_level: "moderate", risk_score: 42, lat: 28.6505, lng: 77.2300 }
];

const seedDB = async () => {
    try {
        console.log('Connecting to local risk database...');
        const conn = await mongoose.createConnection(process.env.RISK_MAP_DB_URI);
        
        const Area = conn.model('Area', AreaSchema);
        
        console.log('Clearing existing areas...');
        await Area.deleteMany({});
        
        console.log(`Inserting ${seedData.length} mock areas...`);
        await Area.insertMany(seedData);
        
        console.log('Database successfully seeded!');
        await conn.close();
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedDB();
