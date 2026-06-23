/**
 * app.js
 *
 * Kyu exist karta hai?
 * - Express application setup yahan hota hai (middleware, routes)
 * - server.js sirf server start karta hai; app logic yahan rehta hai
 * - Testing ke time bhi app.js ko import kar sakte ho bina server chalaye
 */

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const errorHandler = require("./middleware/errorMiddleware");

// Express app instance banao
const app = express();

// CORS - frontend (React) alag port se request bhej sake isliye
app.use(cors());

// JSON body parser - req.body me JSON data aane ke liye
app.use(express.json());

// Simple health check route - server chal raha hai ya nahi check karne ke liye
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HireSense AI API chal rahi hai!",
  });
});

// Auth routes - /api/auth/register aur /api/auth/login
app.use("/api/auth", authRoutes);

// Resume routes - upload + AI analysis
app.use("/api/resume", resumeRoutes);

// Jo bhi unknown route hit ho uske liye 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route nahi mila: ${req.originalUrl}`,
  });
});

// Sabse last me error handler lagao (order matter karta hai)
app.use(errorHandler);

module.exports = app;
