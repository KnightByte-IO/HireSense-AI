/**
 * services/localEvaluationService.js
 *
 * Gemini fail hone par instant rule-based evaluation.
 * No API call — hamesha result deta hai.
 */

const scoreAnswer = (question, answer) => {
  const text = (answer || "").trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = text.length;

  let score = 35;

  if (wordCount >= 10) score += 10;
  if (wordCount >= 25) score += 15;
  if (wordCount >= 50) score += 15;
  if (wordCount >= 80) score += 10;
  if (charCount >= 200) score += 5;

  const questionLower = question.question.toLowerCase();
  const answerLower = text.toLowerCase();

  const techKeywords = [
    "react", "node", "javascript", "api", "database", "project",
    "team", "experience", "because", "example", "implemented",
  ];

  const matched = techKeywords.filter(
    (kw) => questionLower.includes(kw) || answerLower.includes(kw)
  ).length;

  score += Math.min(15, matched * 3);

  if (question.difficulty === "Hard" && wordCount < 30) score -= 10;
  if (question.difficulty === "Easy" && wordCount >= 20) score += 5;

  if (!text) return 0;

  return Math.min(92, Math.max(28, Math.round(score)));
};

const buildFeedback = (question, answer, score) => {
  const words = (answer || "").trim().split(/\s+/).filter(Boolean).length;

  if (score >= 75) {
    return "Solid answer with good detail. Keep using specific examples.";
  }
  if (words < 15) {
    return "Answer is too short. Expand with examples and reasoning.";
  }
  if (question.category === "Technical") {
    return "Add technical depth — explain how and why, not just what.";
  }
  return "Use the STAR method: Situation, Task, Action, Result.";
};

const evaluateLocally = ({ questions, answers, resumeSkills }) => {
  const evaluations = questions.map((q, i) => {
    const ans = answers.find((a) => a.questionIndex === i)?.answer || "";
    const score = scoreAnswer(q, ans);
    const words = ans.trim().split(/\s+/).filter(Boolean).length;

    const strengths = [];
    const weaknesses = [];

    if (words >= 30) strengths.push("Detailed response");
    else weaknesses.push("Answer too brief");

    if (words >= 50) strengths.push("Good effort and length");
    if (score >= 70) strengths.push("Covers key points");
    if (score < 50) weaknesses.push("Needs more depth and examples");
    if (q.category === "Behavioral" && !ans.toLowerCase().includes("team")) {
      weaknesses.push("Add teamwork or collaboration examples");
    }

    if (!strengths.length) strengths.push("Attempted the question");

    return {
      questionIndex: i,
      score,
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      idealAnswer: `For this ${q.difficulty} ${q.category} question, structure your answer clearly, use real examples from projects or experience, and explain your reasoning step by step.`,
      feedback: buildFeedback(q, ans, score),
    };
  });

  const overallScore = Math.round(
    evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length
  );

  const technicalScores = evaluations.filter(
    (_, i) => questions[i].category === "Technical"
  );
  const behavioralScores = evaluations.filter(
    (_, i) => questions[i].category === "Behavioral"
  );

  const avg = (arr) =>
    arr.length
      ? Math.round(arr.reduce((s, e) => s + e.score, 0) / arr.length)
      : 0;

  const skillWiseAnalysis = (resumeSkills || []).slice(0, 5).map((skill, idx) => ({
    skill,
    score: Math.min(95, Math.max(30, overallScore - idx * 3)),
    feedback: `Practice more interview questions related to ${skill}.`,
  }));

  const allStrengths = [...new Set(evaluations.flatMap((e) => e.strengths))].slice(0, 5);
  const allWeaknesses = [...new Set(evaluations.flatMap((e) => e.weaknesses))].slice(0, 5);

  let recommendation = "";
  if (overallScore >= 75) {
    recommendation =
      "Strong interview performance. Continue practicing with harder technical questions.";
  } else if (overallScore >= 55) {
    recommendation =
      "Decent foundation. Focus on longer, example-driven answers for behavioral and technical questions.";
  } else {
    recommendation =
      "Keep practicing. Write fuller answers with project examples and clear structure.";
  }

  return {
    evaluations,
    report: {
      strengths: allStrengths,
      weaknesses: allWeaknesses,
      skillWiseAnalysis,
      recommendation,
      overallScore,
      technicalScore: avg(technicalScores),
      behavioralScore: avg(behavioralScores),
    },
    evaluationMethod: "local",
  };
};

module.exports = { evaluateLocally };
