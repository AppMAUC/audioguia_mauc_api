const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const db = process.env.DB_NAME;
/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * 
 * @requires mongoose
 * 
 * @constant {string} dbUser - The database username from environment variables.
 * @constant {string} dbPassword - The database password from environment variables.
 * 
 * @async
 * @function conn
 * @returns {Promise<import('mongoose').Mongoose>} The Mongoose connection instance.
 * @throws Will log an error message if the connection fails.
 * 
 */

const conn = async () => {
    try {
        const dbConn = await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@apicluster.35r3x0a.mongodb.net/${db}?retryWrites=true&w=majority&appName=APICluster`);
        console.log('Conectou com o banco');
        return dbConn;
    } catch (error) {
        console.log(error);
    }
};

conn();

module.exports = conn;
