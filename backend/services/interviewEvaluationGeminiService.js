/**
 * services/interviewEvaluationGeminiService.js
 *
 * Accurate LLM evaluation:
 * - Per-question rubric scoring (2 parallel at a time)
 * - Separate report generation
 * - Local fallback only in auto mode if Gemini fails
 */

const { callGeminiJson } = require("./geminiClient");
const { evaluateLocally } = require("./localEvaluationService");
const {
  buildSingleQuestionPrompt,
  buildReportPrompt,
} = require("./evaluationRubric");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeAnswerEvaluation = (parsed, index) => {
  const score = Math.min(100, Math.max(0, Number(parsed.score) || 0));

  return {
    questionIndex: index,
    score,
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3) : [],
    weaknesses: Array.isArray(parsed.weaknesses)
      ? parsed.weaknesses.slice(0, 3)
      : [],
    idealAnswer:
      typeof parsed.idealAnswer === "string" ? parsed.idealAnswer : "",
    feedback: typeof parsed.feedback === "string" ? parsed.feedback : "",
  };
};

/** Ek question accurately evaluate karo — full rubric */
const evaluateOneQuestion = async ({
  questionIndex,
  question,
  userAnswer,
  resumeSkills,
}) => {
  const prompt = buildSingleQuestionPrompt({
    question: question.question,
    userAnswer,
    difficulty: question.difficulty,
    category: question.category,
    resumeSkills,
  });

  const parsed = await callGeminiJson(prompt, {
    maxRetries: 2,
    timeoutMs: 60000,
  });

  return normalizeAnswerEvaluation(parsed, questionIndex);
};

/** 2 questions parallel — accurate + reasonable speed */
const evaluateQuestionsAccurate = async ({
  questions,
  answers,
  resumeSkills,
}) => {
  const evaluations = new Array(questions.length);
  const concurrency = 2;

  for (let i = 0; i < questions.length; i += concurrency) {
    const indices = [i, i + 1].filter((idx) => idx < questions.length);

    console.log(
      `LLM evaluating questions ${indices.map((x) => x + 1).join(", ")}/${questions.length}...`
    );

    const batchResults = await Promise.all(
      indices.map(async (idx) => {
        const q = questions[idx];
        const ans = answers.find((a) => a.questionIndex === idx)?.answer || "";

        return evaluateOneQuestion({
          questionIndex: idx,
          question: q,
          userAnswer: ans,
          resumeSkills,
        });
      })
    );

    batchResults.forEach((ev) => {
      evaluations[ev.questionIndex] = ev;
    });

    if (i + concurrency < questions.length) {
      await sleep(500);
    }
  }

  return evaluations;
};

const generateReportFromEvaluations = async ({
  evaluations,
  questions,
  resumeSkills,
}) => {
  const prompt = buildReportPrompt({ evaluations, questions, resumeSkills });
  const parsed = await callGeminiJson(prompt, { maxRetries: 2, timeoutMs: 45000 });

  return {
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    skillWiseAnalysis: Array.isArray(parsed.skillWiseAnalysis)
      ? parsed.skillWiseAnalysis.map((s) => ({
          skill: s.skill || "General",
          score: Math.min(100, Math.max(0, Number(s.score) || 0)),
          feedback: s.feedback || "",
        }))
      : [],
    recommendation:
      typeof parsed.recommendation === "string" ? parsed.recommendation : "",
  };
};

const evaluateInterviewBatch = async ({ questions, answers, resumeSkills }) => {
  const mode = (process.env.EVALUATION_MODE || "auto").toLowerCase();

  if (mode === "local") {
    console.log("EVALUATION_MODE=local — rule-based (not LLM)");
    return evaluateLocally({ questions, answers, resumeSkills });
  }

  const runGemini = async () => {
    const evaluations = await evaluateQuestionsAccurate({
      questions,
      answers,
      resumeSkills,
    });

    const aiReport = await generateReportFromEvaluations({
      evaluations,
      questions,
      resumeSkills,
    });

    return {
      evaluations,
      report: aiReport,
      evaluationMethod: "gemini",
    };
  };

  if (mode === "gemini") {
    return runGemini();
  }

  // auto: accurate LLM first, local only if Gemini completely fails
  try {
    console.log("Starting accurate LLM evaluation (rubric-based)...");
    return await runGemini();
  } catch (error) {
    console.warn(`LLM evaluation failed: ${error.message}`);
    console.warn("Falling back to rule-based scoring (less accurate).");
    const local = evaluateLocally({ questions, answers, resumeSkills });
    local.report.recommendation =
      `[Note: AI evaluation unavailable — scores are approximate] ${local.report.recommendation}`;
    return local;
  }
};

module.exports = { evaluateInterviewBatch, evaluateOneQuestion };
