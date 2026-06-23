/**
 * routes/interviewRoutes.js
 *
 * Interview API endpoints — sab JWT protected.
 */

const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  generateInterview,
  getInterview,
  submitAnswer,
  evaluateInterview,
  getInterviewResults,
  getPerformanceSummary,
} = require("../controllers/interviewController");

const router = express.Router();

router.get("/me/summary", protect, getPerformanceSummary);
router.post("/generate", protect, generateInterview);
router.post("/:interviewId/evaluate", protect, evaluateInterview);
router.get("/:interviewId/results", protect, getInterviewResults);
router.get("/:interviewId", protect, getInterview);
router.post("/:interviewId/answer", protect, submitAnswer);

module.exports = router;
