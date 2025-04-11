const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoURL = "mongodb+srv://malavkansara205:pdn3Ag4gXq_bXy9@cluster0.n7pd1.mongodb.net/oldZ";

async function connectDB() {
    try {
        await mongoose.connect(mongoURL);
        console.log("DATABASE CONNECTED SUCCESSFULLY");
    } catch (dbErr) {
        console.log("NOT ABLE TO CONNECT TO DATABASE");
        process.exit(1);
    }
}

module.exports = connectDB;