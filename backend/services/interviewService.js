/**
 * services/interviewService.js
 *
 * Interview generation + answer saving ka business logic.
 */

const Interview = require("../models/Interview");
const Resume = require("../models/Resume");
const { generateInterviewQuestions } = require("./interviewGeminiService");

/** User ki resume fetch karo — analysis complete honi chahiye */
const getAnalyzedResumeForUser = async (userId, resumeId) => {
  const query = resumeId ? { _id: resumeId, userId } : { userId, analysisCompleted: true };

  const resume = resumeId
    ? await Resume.findOne({ _id: resumeId, userId })
    : await Resume.findOne(query).sort({ analyzedAt: -1 });

  if (!resume) {
    const error = new Error("Analyzed resume nahi mili. Pehle resume analyze karo.");
    error.statusCode = 404;
    throw error;
  }

  if (!resume.analysisCompleted) {
    const error = new Error("Resume analysis complete nahi hai. Pehle analyze karo.");
    error.statusCode = 400;
    throw error;
  }

  return resume;
};

/**
 * POST /api/interview/generate
 * Flow: Resume Analysis → Gemini → Save Interview → Return
 */
const generateInterview = async (userId, resumeId) => {
  const resume = await getAnalyzedResumeForUser(userId, resumeId);

  const questions = await generateInterviewQuestions({
    summary: resume.summary,
    technicalSkills: resume.technicalSkills,
    softSkills: resume.softSkills,
    education: resume.education,
    experience: resume.experience,
    projects: resume.projects,
  });

  const interview = await Interview.create({
    userId,
    resumeId: resume._id,
    questions,
    answers: [],
    completed: false,
  });

  return interview;
};

/** Interview fetch — sirf owner */
const getInterviewById = async (interviewId, userId) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });

  if (!interview) {
    const error = new Error("Interview nahi mili ya access nahi hai");
    error.statusCode = 404;
    throw error;
  }

  return interview;
};

/**
 * Ek question ka answer save karo
 * Har submission par MongoDB update hota hai
 */
const saveAnswer = async (interviewId, userId, questionIndex, answer) => {
  const interview = await getInterviewById(interviewId, userId);

  if (questionIndex < 0 || questionIndex >= interview.questions.length) {
    const error = new Error("Invalid question index");
    error.statusCode = 400;
    throw error;
  }

  if (!answer || !answer.trim()) {
    const error = new Error("Answer likhna zaroori hai");
    error.statusCode = 400;
    throw error;
  }

  const existingIndex = interview.answers.findIndex(
    (a) => a.questionIndex === questionIndex
  );

  const answerEntry = {
    questionIndex,
    answer: answer.trim(),
    answeredAt: new Date(),
  };

  if (existingIndex >= 0) {
    interview.answers[existingIndex] = answerEntry;
  } else {
    interview.answers.push(answerEntry);
  }

  const answeredCount = interview.answers.length;
  if (answeredCount >= interview.questions.length) {
    interview.completed = true;
  }

  await interview.save();
  return interview;
};

module.exports = {
  generateInterview,
  getInterviewById,
  saveAnswer,
};
