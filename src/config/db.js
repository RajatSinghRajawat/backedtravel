const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://stechoozeofficial:p8ueAOsdF6vuwyt0@cluster0.epuiima.mongodb.net/travel-Database")
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
