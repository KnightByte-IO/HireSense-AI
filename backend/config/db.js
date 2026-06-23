/**
 * config/db.js
 *
 * Kyu exist karta hai?
 * - MongoDB se connect karne ka kaam alag file me rakha hai
 * - Baad me agar database change karna ho to sirf yahi file edit karni padegi
 */

const mongoose = require("mongoose");

// Database se connection banane wala function
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI environment variable missing hai");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);

    if (error.message.includes("whitelist") || error.message.includes("Could not connect")) {
      console.error(
        "Fix: MongoDB Atlas → Network Access → Add IP → Allow 0.0.0.0/0 (for Render/cloud deploy)"
      );
    }

    process.exit(1);
  }
};

module.exports = connectDB;
