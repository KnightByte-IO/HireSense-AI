/**
 * models/Resume.js
 *
 * Resume document ka database schema.
 *
 * Fields kyu hain:
 * - userId      → Kis user ki resume hai (har user apni resume dekhe)
 * - fileName    → Original PDF ka naam (UI me dikhane ke liye)
 * - resumeText  → PDF se nikala hua plain text (Gemini ko bhejte hain)
 * - extractedSkills → AI ne nikale technical + soft skills
 * - education   → Degree, college, year wagairah
 * - experience  → Jobs, internships, company names
 * - projects    → Personal / college projects
 * - uploadedAt  → Kab upload hui (sorting & dashboard ke liye)
 */

const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // userId se fast search
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    // AI analysis — nested object me technical aur soft skills alag
    extractedSkills: {
      technicalSkills: { type: [String], default: [] },
      softSkills: { type: [String], default: [] },
    },
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
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    analysisStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
