const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://adimaskil:123@cluster0.pllj1ix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDB;
