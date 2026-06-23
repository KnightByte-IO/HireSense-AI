/**
 * controllers/authController.js
 *
 * Kyu exist karta hai?
 * - HTTP request receive karta hai aur response bhejta hai
 * - Routes sirf URL map karti hain; actual request handling controller me hoti hai
 * - Business logic service layer ko delegate karta hai (clean separation)
 */

const authService = require("../services/authService");

/**
 * POST /api/auth/register
 * Naya user account banata hai
 */
const register = async (req, res, next) => {
  try {
    // req.body se frontend se aaya hua data nikal lo
    const { name, email, password } = req.body;

    // Basic validation - required fields check karo
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email aur password teeno zaroori hain",
      });
    }

    // Service layer se user register karwao
    const result = await authService.registerUser({ name, email, password });

    // Success response bhejo (201 = Created)
    res.status(201).json({
      success: true,
      message: "Registration successful! Welcome to HireSense AI",
      data: result,
    });
  } catch (error) {
    // Error ko global error handler tak bhejo
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Existing user ko authenticate karta hai
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email aur password dono zaroori hain",
      });
    }

    const result = await authService.loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: "Login successful!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
