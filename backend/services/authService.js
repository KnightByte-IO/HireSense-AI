/**
 * services/authService.js
 *
 * Kyu exist karta hai?
 * - Auth se related business logic yahan rakhi hai (password hash, token banana)
 * - Controller slim rehta hai; heavy kaam service layer handle karti hai
 * - Same logic baad me doosri jagah reuse kar sakte ho
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Password ko hash karne ke liye salt rounds (zyada = zyada secure, thoda slow)
const SALT_ROUNDS = 10;

/**
 * Naya user register karo
 * @param {Object} userData - { name, email, password }
 * @returns {Object} - saved user (password ke bina) + JWT token
 */
const registerUser = async ({ name, email, password }) => {
  // Pehle check karo ki email pehle se registered to nahi hai
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Is email se pehle se account bana hua hai");
    error.statusCode = 400; // Bad Request
    throw error;
  }

  // Plain password ko hash karo - database me kabhi plain password mat rakho
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Naya user document create karo
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // JWT token generate karo taaki user login state me rahe
  const token = generateToken(user._id);

  // Response me password mat bhejo
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

/**
 * Existing user ko login karo
 * @param {Object} credentials - { email, password }
 * @returns {Object} - user info + JWT token
 */
const loginUser = async ({ email, password }) => {
  // Email se user dhoondo; .select("+password") se hidden password field bhi lao
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Galat email ya password");
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  // User ne jo password diya aur database wala hash match karo
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    const error = new Error("Galat email ya password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

/**
 * JWT token banane ka helper function
 * @param {string} userId - MongoDB user ki _id
 * @returns {string} - signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // token ke andar user ki id store hoti hai
    process.env.JWT_SECRET, // secret key se sign hota hai
  {
      expiresIn: process.env.JWT_EXPIRE || "7d", // token kitne din valid rahega
    }
  );
};

module.exports = {
  registerUser,
  loginUser,
  generateToken,
};
