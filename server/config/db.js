const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/seoAnalyzer";

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
            family: 4
        });
        console.log("MongoDB Connected");
        return true;
    } catch (error) {
        console.warn("MongoDB Connection Error:", error.message);
        return false;
    }
};

module.exports = connectDB;