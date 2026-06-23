/**
 * services/resumeService.js
 *
 * Resume upload + AI analysis ka poora business logic.
 * Controller slim rehta hai — heavy kaam yahan hota hai.
 */

const Resume = require("../models/Resume");
const { extractTextFromPdf } = require("./pdfService");
const { analyzeResumeWithGemini } = require("./geminiService");

/**
 * PDF upload se lekar MongoDB save + Gemini analysis tak
 */
const processResumeUpload = async (userId, file) => {
  // Step 1: PDF se text nikalo
  const resumeText = await extractTextFromPdf(file.buffer);

  // Step 2: Pehle resume save karo (text ke saath)
  const resume = await Resume.create({
    userId,
    fileName: file.originalname,
    resumeText,
    analysisStatus: "pending",
  });

  try {
    // Step 3: Gemini se analysis lao
    const analysis = await analyzeResumeWithGemini(resumeText);

    // Step 4: Analysis MongoDB me update karo
    resume.extractedSkills = {
      technicalSkills: analysis.technicalSkills,
      softSkills: analysis.softSkills,
    };
    resume.education = analysis.education;
    resume.experience = analysis.experience;
    resume.projects = analysis.projects;
    resume.analysisStatus = "completed";

    await resume.save();

    return resume;
  } catch (error) {
    // Gemini fail ho to bhi resume text saved rahe
    resume.analysisStatus = "failed";
    await resume.save();
    throw error;
  }
};

/**
 * User ki latest resume lao (dashboard ke liye)
 */
const getLatestResumeByUser = async (userId) => {
  return Resume.findOne({ userId }).sort({ uploadedAt: -1 });
};

/**
 * User ki saari resumes (history — optional)
 */
const getResumesByUser = async (userId) => {
  return Resume.find({ userId }).sort({ uploadedAt: -1 });
};

module.exports = {
  processResumeUpload,
  getLatestResumeByUser,
  getResumesByUser,
};
