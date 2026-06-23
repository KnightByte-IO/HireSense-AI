/**
 * middleware/errorMiddleware.js
 *
 * Kyu exist karta hai?
 * - Poore app me errors ek hi format me handle hote hain
 * - Har controller me alag-alag try-catch response likhne ki zaroorat nahi
 * - next(error) call hone par ye middleware response bhejta hai
 */

// Express error handler - 4 parameters wala function
const errorHandler = (err, req, res, next) => {
  // Agar error me statusCode set hai to use karo, warna 500 (Server Error)
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Kuch galat ho gaya. Baad me try karo.",
    // Development me stack trace dikhao debugging ke liye
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
