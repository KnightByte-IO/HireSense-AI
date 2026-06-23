/**
 * services/interviewEvaluationService.js
 *
 * Interview evaluation — 1 Gemini batch call, fast results.
 */

const Interview = require("../models/Interview");
const Resume = require("../models/Resume");
const { evaluateInterviewBatch } = require("./interviewEvaluationGeminiService");

const inProgress = new Set();

const calculateAverageScore = (scores) => {
  if (!scores.length) return 0;
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
};

const calculateCategoryScore = (evaluations, questions, category) => {
  const scores = evaluations
    .filter((ev) => questions[ev.questionIndex]?.category === category)
    .map((ev) => ev.score);

  return calculateAverageScore(scores);
};

const aggregateThemes = (evaluations, field) => {
  const all = evaluations.flatMap((ev) => ev[field] || []);
  return [...new Set(all)].slice(0, 8);
};

const evaluateInterview = async (interviewId, userId) => {
  const lockKey = String(interviewId);

  if (inProgress.has(lockKey)) {
    const error = new Error(
      "Evaluation already chal rahi hai. Thoda wait karo..."
    );
    error.statusCode = 409;
    throw error;
  }

  const interview = await Interview.findOne({ _id: interviewId, userId });

  if (!interview) {
    const error = new Error("Interview nahi mili ya access nahi hai");
    error.statusCode = 404;
    throw error;
  }

  if (!interview.completed) {
    const error = new Error("Pehle saare questions answer karo");
    error.statusCode = 400;
    throw error;
  }

  if (interview.evaluated) {
    return interview;
  }

  inProgress.add(lockKey);

  try {
    const resume = await Resume.findById(interview.resumeId);
    const resumeSkills = [
      ...(resume?.technicalSkills || []),
      ...(resume?.softSkills || []),
    ];

    for (let i = 0; i < interview.questions.length; i++) {
      const answerEntry = interview.answers.find((a) => a.questionIndex === i);
      if (!answerEntry?.answer) {
        const error = new Error(`Question ${i + 1} ka answer missing hai`);
        error.statusCode = 400;
        throw error;
      }
    }

    console.log(`Batch evaluating interview ${interviewId} (1 API call)...`);

    const { evaluations, report: aiReport, evaluationMethod } =
      await evaluateInterviewBatch({
      questions: interview.questions,
      answers: interview.answers,
      resumeSkills,
    });

    const overallScore =
      aiReport.overallScore ??
      Math.round(evaluations.reduce((s, e) => s + e.score, 0) / evaluations.length);
    const technicalScore =
      aiReport.technicalScore ??
      calculateCategoryScore(evaluations, interview.questions, "Technical");
    const behavioralScore =
      aiReport.behavioralScore ??
      calculateCategoryScore(evaluations, interview.questions, "Behavioral");

    interview.evaluations = evaluations;
    interview.report = {
      overallScore,
      technicalScore,
      behavioralScore,
      strengths: aiReport.strengths.length
        ? aiReport.strengths
        : aggregateThemes(evaluations, "strengths"),
      weaknesses: aiReport.weaknesses.length
        ? aiReport.weaknesses
        : aggregateThemes(evaluations, "weaknesses"),
      skillWiseAnalysis: aiReport.skillWiseAnalysis,
      recommendation: aiReport.recommendation,
    };
    interview.score = overallScore;
    interview.evaluationMethod = evaluationMethod || "gemini";
    interview.evaluated = true;
    interview.evaluatedAt = new Date();

    await interview.save();
    console.log(
      `Interview ${interviewId} evaluated — score: ${overallScore} (${interview.evaluationMethod})`
    );

    return interview;
  } finally {
    inProgress.delete(lockKey);
  }
};

const getInterviewResults = async (interviewId, userId) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });

  if (!interview) {
    const error = new Error("Interview nahi mili");
    error.statusCode = 404;
    throw error;
  }

  if (!interview.evaluated) {
    const error = new Error("Interview abhi evaluate nahi hui. Pehle evaluate karo.");
    error.statusCode = 400;
    throw error;
  }

  return interview;
};

const getPerformanceSummary = async (userId) => {
  const latestEvaluated = await Interview.findOne({
    userId,
    evaluated: true,
  }).sort({ evaluatedAt: -1 });

  const totalInterviews = await Interview.countDocuments({
    userId,
    completed: true,
  });
  const evaluatedCount = await Interview.countDocuments({
    userId,
    evaluated: true,
  });

  if (!latestEvaluated) {
    return {
      hasEvaluation: false,
      totalInterviews,
      evaluatedCount,
      latestScore: null,
      technicalScore: null,
      behavioralScore: null,
      lastEvaluatedAt: null,
      recommendation: null,
    };
  }

  return {
    hasEvaluation: true,
    totalInterviews,
    evaluatedCount,
    latestScore: latestEvaluated.report?.overallScore ?? latestEvaluated.score,
    technicalScore: latestEvaluated.report?.technicalScore,
    behavioralScore: latestEvaluated.report?.behavioralScore,
    lastEvaluatedAt: latestEvaluated.evaluatedAt,
    recommendation: latestEvaluated.report?.recommendation,
    latestInterviewId: latestEvaluated._id,
    skillWiseAnalysis: latestEvaluated.report?.skillWiseAnalysis || [],
  };
};

module.exports = {
  evaluateInterview,
  getInterviewResults,
  getPerformanceSummary,
};
