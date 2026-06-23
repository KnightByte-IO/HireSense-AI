/**
 * routes/resumeRoutes.js
 *
 * Resume related API endpoints.
 * Saari routes protected hain — JWT zaroori hai.
 */

const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { uploadResume: uploadMiddleware } = require("../middleware/uploadMiddleware");
const {
  uploadResume,
  getMyResume,
  getResumeSummary,
} = require("../controllers/resumeController");

const router = express.Router();

// Multer errors ko catch karne ke liye wrapper
const handleUpload = (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      err.statusCode = err.statusCode || 400;
      return next(err);
    }
    next();
  });
};

router.post("/upload", protect, handleUpload, uploadResume);
router.get("/me", protect, getMyResume);
router.get("/me/summary", protect, getResumeSummary);

module.exports = router;
