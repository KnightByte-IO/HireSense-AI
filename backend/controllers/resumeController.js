/**
 * controllers/resumeController.js
 *
 * Resume HTTP requests handle karta hai.
 */

const resumeService = require("../services/resumeService");

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file upload karo. Field name: resume",
      });
    }

    const resume = await resumeService.saveResumeUpload(req.user._id, req.file);

    res.status(201).json({
      success: true,
      message: "Resume successfully upload ho gayi!",
      data: {
        id: resume._id,
        fileName: resume.fileName,
        filePath: resume.filePath,
        fileSize: resume.fileSize,
        uploadedAt: resume.uploadedAt,
        analysisCompleted: resume.analysisCompleted,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMyResume = async (req, res, next) => {
  try {
    const resume = await resumeService.getLatestResumeByUser(req.user._id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Abhi tak koi resume upload nahi hui",
      });
    }

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

const getResumeSummary = async (req, res, next) => {
  try {
    const resume = await resumeService.getLatestResumeByUser(req.user._id);

    if (!resume) {
      return res.status(200).json({
        success: true,
        data: {
          hasResume: false,
          analysisCompleted: false,
          skillsCount: 0,
          projectsCount: 0,
          lastAnalysisDate: null,
          fileName: null,
        },
      });
    }

    const skillsCount =
      (resume.technicalSkills?.length || 0) + (resume.softSkills?.length || 0);

    res.status(200).json({
      success: true,
      data: {
        hasResume: true,
        fileName: resume.fileName,
        lastUploadDate: resume.uploadedAt,
        filePath: resume.filePath,
        fileSize: resume.fileSize,
        analysisCompleted: resume.analysisCompleted,
        skillsCount,
        projectsCount: resume.projects?.length || 0,
        lastAnalysisDate: resume.analyzedAt,
        resumeId: resume._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/resume/analyze/:resumeId
 * PDF parse → Gemini → save analysis
 */
const analyzeResume = async (req, res, next) => {
  try {
    const { resumeId } = req.params;

    const resume = await resumeService.analyzeResume(resumeId, req.user._id);

    res.status(200).json({
      success: true,
      message: "Resume analysis successful!",
      data: {
        id: resume._id,
        fileName: resume.fileName,
        summary: resume.summary,
        technicalSkills: resume.technicalSkills,
        softSkills: resume.softSkills,
        education: resume.education,
        experience: resume.experience,
        projects: resume.projects,
        analysisCompleted: resume.analysisCompleted,
        analyzedAt: resume.analyzedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  getMyResume,
  getResumeSummary,
  analyzeResume,
};
