const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();

        const result = [];
        for (let dbData of dbs.databases) {
            const dbName = dbData.name;
            if (['admin', 'local', 'config'].includes(dbName)) continue;

            const dbObj = { name: dbName, collections: [] };
            const db = mongoose.connection.useDb(dbName);
            const collections = await db.db.listCollections().toArray();

            for (let coll of collections) {
                const count = await db.db.collection(coll.name).countDocuments();
                const sample = count > 0 ? await db.db.collection(coll.name).findOne() : null;
                dbObj.collections.push({
                    name: coll.name,
                    count: count,
                    fields: sample ? Object.keys(sample) : []
                });
            }
            result.push(dbObj);
        }
        fs.writeFileSync('db_info.json', JSON.stringify(result, null, 2));
        console.log('Done! Info saved to db_info.json');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
