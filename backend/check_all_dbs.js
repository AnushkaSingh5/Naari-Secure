const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const checkDBs = async () => {
    try {
        await mongoose.connect(process.env.USER_DB_URI);
        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();

        for (let dbData of dbs.databases) {
            const dbName = dbData.name;
            if (['admin', 'local', 'config'].includes(dbName)) continue;

            const db = mongoose.connection.useDb(dbName);
            const collections = await db.db.listCollections().toArray();

            for (let coll of collections) {
                const count = await db.db.collection(coll.name).countDocuments();
                if (coll.name === 'areas') {
                    console.log(`Database: ${dbName}, Collection: ${coll.name}, Count: ${count}`);
                    if (count > 0) {
                        const sample = await db.db.collection(coll.name).findOne();
                        console.log(`  Sample: ${JSON.stringify(sample)}`);
                    }
                }
            }
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDBs();
