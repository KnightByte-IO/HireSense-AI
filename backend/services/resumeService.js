/**
 * services/resumeService.js
 *
 * Resume upload + analysis ka poora business logic.
 */

const Resume = require("../models/Resume");
const { extractTextFromFile } = require("./pdfService");
const { analyzeResumeWithGemini } = require("./geminiService");
const path = require("path");

/** PDF upload save karo */
const saveResumeUpload = async (userId, file) => {
  const filePath = path.join("uploads", file.filename).replace(/\\/g, "/");

  return Resume.create({
    userId,
    fileName: file.originalname,
    filePath,
    fileSize: file.size,
  });
};

/** User ki latest resume */
const getLatestResumeByUser = async (userId) => {
  return Resume.findOne({ userId }).sort({ uploadedAt: -1 });
};

/** ID se resume dhoondo — sirf usi user ki */
const getResumeByIdForUser = async (resumeId, userId) => {
  return Resume.findOne({ _id: resumeId, userId });
};

/**
 * POST /api/resume/analyze/:resumeId
 * Flow: Fetch → Parse PDF → Gemini → Save → Return
 */
const analyzeResume = async (resumeId, userId) => {
  // Step 1: Resume fetch karo
  const resume = await getResumeByIdForUser(resumeId, userId);

  if (!resume) {
    const error = new Error("Resume nahi mili ya aapke paas access nahi hai");
    error.statusCode = 404;
    throw error;
  }

  // Step 2: PDF se text extract karo (terminal me bhi print hoga)
  const resumeText = await extractTextFromFile(resume.filePath);
  resume.resumeText = resumeText;

  // Step 3: Gemini ko bhejo
  const analysis = await analyzeResumeWithGemini(resumeText);

  // Step 4: MongoDB me save karo
  resume.technicalSkills = analysis.technicalSkills;
  resume.softSkills = analysis.softSkills;
  resume.education = analysis.education;
  resume.experience = analysis.experience;
  resume.projects = analysis.projects;
  resume.summary = analysis.summary;
  resume.analysisCompleted = true;
  resume.analyzedAt = new Date();

  await resume.save();

  return resume;
};

module.exports = {
  saveResumeUpload,
  getLatestResumeByUser,
  getResumeByIdForUser,
  analyzeResume,
};
