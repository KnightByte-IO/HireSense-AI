/**
 * controllers/resumeController.js
 *
 * Resume HTTP requests handle karta hai.
 */

const resumeService = require("../services/resumeService");

/**
 * POST /api/resume/upload
 * PDF upload → parse → Gemini → save → response
 */
const uploadResume = async (req, res, next) => {
  try {
    // Multer ne file req.file me daali hogi
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file upload karo. Field name: resume",
      });
    }

    const resume = await resumeService.processResumeUpload(
      req.user._id,
      req.file
    );

    res.status(201).json({
      success: true,
      message: "Resume upload aur AI analysis successful!",
      data: {
        id: resume._id,
        fileName: resume.fileName,
        resumeText: resume.resumeText,
        extractedSkills: resume.extractedSkills,
        education: resume.education,
        experience: resume.experience,
        projects: resume.projects,
        uploadedAt: resume.uploadedAt,
        analysisStatus: resume.analysisStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/resume/me
 * Logged-in user ki latest resume
 */
const getMyResume = async (req, res, next) => {
  try {
    const resume = await resumeService.getLatestResumeByUser(req.user._id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Abhi tak koi resume upload nahi hui",
      });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/resume/me/summary
 * Dashboard cards ke liye short stats
 */
const getResumeSummary = async (req, res, next) => {
  try {
    const resume = await resumeService.getLatestResumeByUser(req.user._id);

    if (!resume) {
      return res.status(200).json({
        success: true,
        data: {
          hasResume: false,
          totalSkills: 0,
          lastUploadDate: null,
          fileName: null,
        },
      });
    }

    const totalSkills =
      (resume.extractedSkills?.technicalSkills?.length || 0) +
      (resume.extractedSkills?.softSkills?.length || 0);

    res.status(200).json({
      success: true,
      data: {
        hasResume: true,
        totalSkills,
        lastUploadDate: resume.uploadedAt,
        fileName: resume.fileName,
        analysisStatus: resume.analysisStatus,
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
};
