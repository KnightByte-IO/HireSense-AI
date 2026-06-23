/**
 * controllers/interviewController.js
 *
 * Interview HTTP requests handle karta hai.
 */

const interviewService = require("../services/interviewService");
const interviewEvaluationService = require("../services/interviewEvaluationService");

/** POST /api/interview/generate */
const generateInterview = async (req, res, next) => {
  try {
    const { resumeId } = req.body;

    const interview = await interviewService.generateInterview(
      req.user._id,
      resumeId
    );

    res.status(201).json({
      success: true,
      message: "Interview questions generate ho gaye!",
      data: {
        id: interview._id,
        resumeId: interview.resumeId,
        questions: interview.questions,
        answers: interview.answers,
        completed: interview.completed,
        createdAt: interview.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/** GET /api/interview/:interviewId */
const getInterview = async (req, res, next) => {
  try {
    const interview = await interviewService.getInterviewById(
      req.params.interviewId,
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};

/** POST /api/interview/:interviewId/answer */
const submitAnswer = async (req, res, next) => {
  try {
    const { questionIndex, answer } = req.body;

    if (questionIndex === undefined || questionIndex === null) {
      return res.status(400).json({
        success: false,
        message: "questionIndex required hai",
      });
    }

    const interview = await interviewService.saveAnswer(
      req.params.interviewId,
      req.user._id,
      Number(questionIndex),
      answer
    );

    res.status(200).json({
      success: true,
      message: "Answer save ho gaya!",
      data: {
        id: interview._id,
        answers: interview.answers,
        completed: interview.completed,
      },
    });
  } catch (error) {
    next(error);
  }
};

/** POST /api/interview/:interviewId/evaluate */
const evaluateInterview = async (req, res, next) => {
  try {
    const interview = await interviewEvaluationService.evaluateInterview(
      req.params.interviewId,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Interview evaluation complete!",
      data: {
        id: interview._id,
        score: interview.score,
        report: interview.report,
        evaluations: interview.evaluations,
        evaluated: interview.evaluated,
        evaluatedAt: interview.evaluatedAt,
        evaluationMethod: interview.evaluationMethod,
      },
    });
  } catch (error) {
    next(error);
  }
};

/** GET /api/interview/:interviewId/results */
const getInterviewResults = async (req, res, next) => {
  try {
    const interview = await interviewEvaluationService.getInterviewResults(
      req.params.interviewId,
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: {
        id: interview._id,
        questions: interview.questions,
        answers: interview.answers,
        evaluations: interview.evaluations,
        report: interview.report,
        score: interview.score,
        evaluatedAt: interview.evaluatedAt,
        evaluationMethod: interview.evaluationMethod,
        createdAt: interview.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/** GET /api/interview/me/summary */
const getPerformanceSummary = async (req, res, next) => {
  try {
    const summary = await interviewEvaluationService.getPerformanceSummary(
      req.user._id
    );

    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateInterview,
  getInterview,
  submitAnswer,
  evaluateInterview,
  getInterviewResults,
  getPerformanceSummary,
};
