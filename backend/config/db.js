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
  try {
    // process.env.MONGO_URI .env file se aata hai
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Connection successful hone par log print karo
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Agar connection fail ho jaye to error dikhao aur process band karo
    console.error(`Database connection error: ${error.message}`);
    process.exit(1); // 1 = error ke saath exit
  }
};

module.exports = connectDB;
