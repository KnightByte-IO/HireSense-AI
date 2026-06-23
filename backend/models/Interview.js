/**
 * models/Interview.js
 *
 * AI Interview session + evaluation results ka MongoDB schema.
 */

const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    questions: {
      type: [
        {
          question: { type: String, required: true },
          difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
          },
          category: {
            type: String,
            enum: ["Technical", "Behavioral"],
            required: true,
          },
        },
      ],
      default: [],
    },
    answers: {
      type: [
        {
          questionIndex: { type: Number, required: true },
          answer: { type: String, default: "" },
          answeredAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    // Per-question AI evaluation
    evaluations: {
      type: [
        {
          questionIndex: { type: Number, required: true },
          score: { type: Number, default: 0 },
          strengths: { type: [String], default: [] },
          weaknesses: { type: [String], default: [] },
          idealAnswer: { type: String, default: "" },
          feedback: { type: String, default: "" },
        },
      ],
      default: [],
    },
    // Overall interview report
    report: {
      overallScore: { type: Number, default: null },
      technicalScore: { type: Number, default: null },
      behavioralScore: { type: Number, default: null },
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      skillWiseAnalysis: {
        type: [
          {
            skill: String,
            score: Number,
            feedback: String,
          },
        ],
        default: [],
      },
      recommendation: { type: String, default: "" },
    },
    score: { type: Number, default: null },
    evaluationMethod: {
      type: String,
      enum: ["gemini", "local"],
      default: "gemini",
    },
    completed: { type: Boolean, default: false },
    evaluated: { type: Boolean, default: false },
    evaluatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;
