const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

const conn = async () => {
    try {
        const dbConn = await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@apicluster.35r3x0a.mongodb.net/?retryWrites=true&w=majority&appName=APICluster`);
        console.log('Conectou com o banco');
        return dbConn;
    } catch (error) {
        console.log(error);
    }
};

conn();

module.exports = conn;
