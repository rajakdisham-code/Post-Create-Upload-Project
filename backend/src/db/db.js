const mongoose = require("mongoose");
const dotenv = require('dotenv').config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { 
            maxPoolSize: 10,
            minPoolSize: 5,
        });  
        console.log("connected to DB");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;