/**
 * models/User.js
 *
 * Kyu exist karta hai?
 * - User ka data structure (schema) define karta hai
 * - Mongoose is schema ko use karke MongoDB me documents save karta hai
 */

const mongoose = require("mongoose");

// User schema - har user document me ye fields hongi
const userSchema = new mongoose.Schema(
  {
  name: {
    type: String,
    required: [true, "Name zaroori hai"], // required matlab field empty nahi ho sakti
    trim: true, // extra spaces start/end se hata deta hai
  },
  email: {
    type: String,
    required: [true, "Email zaroori hai"],
    unique: true, // same email dobara register nahi ho sakti
    lowercase: true, // email hamesha small letters me save hogi
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password zaroori hai"],
    minlength: [6, "Password kam se kam 6 characters ka hona chahiye"],
    select: false, // default queries me password mat bhejo (security)
  },
  },
  {
    timestamps: true, // createdAt aur updatedAt automatically add ho jayenge
  }
);

// "User" collection banega MongoDB me (plural form: users)
const User = mongoose.model("User", userSchema);

module.exports = User;
