/**
 * routes/resumeRoutes.js
 *
 * Resume API endpoints — sab JWT protected.
 */

const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { uploadResume: uploadMiddleware } = require("../middleware/uploadMiddleware");
const {
  uploadResume,
  getMyResume,
  getResumeSummary,
  analyzeResume,
} = require("../controllers/resumeController");

const router = express.Router();

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
router.post("/analyze/:resumeId", protect, analyzeResume);
router.get("/me", protect, getMyResume);
router.get("/me/summary", protect, getResumeSummary);

module.exports = router;
