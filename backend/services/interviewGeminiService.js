/**
 * services/interviewGeminiService.js
 *
 * Resume analysis se Gemini ko 10 interview questions generate karwata hai.
 */

const { callGeminiJson } = require("./geminiClient");

const normalizeQuestions = (parsed) => {
  if (!Array.isArray(parsed.questions)) {
    throw new SyntaxError("questions array missing");
  }

  const validDifficulty = ["Easy", "Medium", "Hard"];
  const validCategory = ["Technical", "Behavioral"];

  const questions = parsed.questions
    .filter((q) => q && typeof q.question === "string" && q.question.trim())
    .map((q) => ({
      question: q.question.trim(),
      difficulty: validDifficulty.includes(q.difficulty) ? q.difficulty : "Medium",
      category: validCategory.includes(q.category) ? q.category : "Technical",
    }));

  if (questions.length < 5) {
    throw new SyntaxError("Not enough valid questions");
  }

  return questions.slice(0, 10);
};

const generateInterviewQuestions = async (resumeAnalysis) => {
  const analysisPayload = {
    summary: resumeAnalysis.summary || "",
    technicalSkills: resumeAnalysis.technicalSkills || [],
    softSkills: resumeAnalysis.softSkills || [],
    education: resumeAnalysis.education || [],
    experience: resumeAnalysis.experience || [],
    projects: resumeAnalysis.projects || [],
  };

  const prompt = `You are an expert technical interviewer for HireSense AI.

Based on the candidate's resume analysis below, generate exactly 10 interview questions.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no code fences, no explanation.
- Generate exactly 10 questions.
- Mix difficulty: ~3 Easy, ~4 Medium, ~3 Hard.
- Mix category: ~5 Technical, ~5 Behavioral.
- Technical questions should relate to their skills, projects, and experience.
- Behavioral questions should relate to teamwork, leadership, soft skills.
- Questions must be personalized to THIS candidate's profile.
- Do NOT invent skills or experience not in the analysis.

Required JSON format:
{
  "questions": [
    {
      "question": "Explain how React virtual DOM works.",
      "difficulty": "Medium",
      "category": "Technical"
    },
    {
      "question": "Tell me about a time you worked in a team.",
      "difficulty": "Easy",
      "category": "Behavioral"
    }
  ]
}

RESUME ANALYSIS:
${JSON.stringify(analysisPayload, null, 2)}`;

  const parsed = await callGeminiJson(prompt);
  return normalizeQuestions(parsed);
};

module.exports = { generateInterviewQuestions };
