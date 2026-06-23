/**
 * middleware/authMiddleware.js
 *
 * Kyu exist karta hai?
 * - Protected routes ke liye JWT verify karta hai
 * - Abhi register/login public hain, lekin baad me profile/jobs wagairah
 *   ke liye ye middleware use hoga
 * - Agar token valid nahi hai to request aage nahi badhegi
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * protect middleware - sirf logged-in users ko allow karta hai
 */
const protect = async (req, res, next) => {
  let token;

  // Authorization header me "Bearer <token>" format hota hai
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // "Bearer " hata kar sirf token nikal lo
    token = req.headers.authorization.split(" ")[1];
  }

  // Token hi nahi mila to unauthorized
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Login zaroori hai. Token nahi mila.",
    });
  }

  try {
    // Token verify karo - invalid/expired ho to error aayega
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token se user id nikal kar database se user lao (password ke bina)
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User nahi mila. Dubara login karo.",
      });
    }

    // Sab theek hai - agla handler (controller) chalao
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalid ya expire ho chuka hai",
    });
  }
};

module.exports = { protect };
