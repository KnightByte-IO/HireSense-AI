/**
 * models/Resume.js
 *
 * Resume document ka MongoDB schema.
 *
 * Upload fields:
 * - userId, fileName, filePath, fileSize, uploadedAt
 *
 * Analysis fields (Gemini se aate hain):
 * - resumeText        → pdf-parse se nikala text
 * - technicalSkills   → JS, React, Node wagairah
 * - softSkills        → Communication, Leadership
 * - education         → Degree, college, year
 * - experience        → Jobs, internships
 * - projects          → Personal projects
 * - summary           → AI generated short overview
 * - analysisCompleted → true jab analysis ho chuki ho
 * - analyzedAt        → Kab analysis hui
 */

const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileName: { type: String, required: true, trim: true },
    filePath: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },

    // PDF se extract hua raw text
    resumeText: { type: String, default: "" },

    // Gemini analysis results
    technicalSkills: { type: [String], default: [] },
    softSkills: { type: [String], default: [] },
    education: {
      type: [
        {
          degree: String,
          institution: String,
          year: String,
        },
      ],
      default: [],
    },
    experience: {
      type: [
        {
          role: String,
          company: String,
          duration: String,
          description: String,
        },
      ],
      default: [],
    },
    projects: {
      type: [
        {
          name: String,
          description: String,
          technologies: [String],
        },
      ],
      default: [],
    },
    summary: { type: String, default: "" },
    analysisCompleted: { type: Boolean, default: false },
    analyzedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
