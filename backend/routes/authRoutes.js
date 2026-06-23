/**
 * routes/authRoutes.js
 *
 * Kyu exist karta hai?
 * - API endpoints (URLs) ko controller functions se connect karta hai
 * - Saari auth related routes ek jagah grouped rehti hain
 * - Example: POST /api/auth/register, POST /api/auth/login
 */

const express = require("express");
const { register, login } = require("../controllers/authController");

// Express Router - mini app jaisa kaam karta hai
const router = express.Router();

// Register route - naya user banane ke liye
router.post("/register", register);

// Login route - existing user ke liye
router.post("/login", login);

module.exports = router;
