/**
 * services/geminiService.js
 *
 * Google Gemini API se resume text analyze karta hai.
 * Output: structured JSON only (skills, education, experience, projects, summary)
 */

const { callGeminiJson } = require("./geminiClient");

const EMPTY_ANALYSIS = {
  technicalSkills: [],
  softSkills: [],
  education: [],
  experience: [],
  projects: [],
  summary: "",
};

/**
 * Parsed data ko safe structure me lao
 */
const normalizeAnalysis = (parsed) => ({
  technicalSkills: Array.isArray(parsed.technicalSkills)
    ? parsed.technicalSkills
    : [],
  softSkills: Array.isArray(parsed.softSkills) ? parsed.softSkills : [],
  education: Array.isArray(parsed.education) ? parsed.education : [],
  experience: Array.isArray(parsed.experience) ? parsed.experience : [],
  projects: Array.isArray(parsed.projects) ? parsed.projects : [],
  summary: typeof parsed.summary === "string" ? parsed.summary : "",
});

/**
 * Resume text → Gemini → JSON analysis
 * @param {string} resumeText
 */
const analyzeResumeWithGemini = async (resumeText) => {
  if (!resumeText || resumeText.length < 50) {
    const error = new Error("Analysis ke liye resume text bahut chhota hai.");
    error.statusCode = 400;
    throw error;
  }

  const trimmedText = resumeText.slice(0, 12000);

  const prompt = `You are an expert resume analyzer for HireSense AI.

Extract information from the resume text below.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no code fences, no explanation.
- Extract ONLY information clearly present in the resume. Do NOT invent data.
- Use empty array [] or empty string "" if a section is missing.
- technicalSkills = programming languages, frameworks, tools, databases
- softSkills = communication, leadership, teamwork, problem solving, etc.
- summary = 2-3 sentence professional overview of the candidate

Required JSON format:
{
  "technicalSkills": ["JavaScript", "React"],
  "softSkills": ["Communication", "Teamwork"],
  "education": [{ "degree": "", "institution": "", "year": "" }],
  "experience": [{ "role": "", "company": "", "duration": "", "description": "" }],
  "projects": [{ "name": "", "description": "", "technologies": ["React"] }],
  "summary": "Short professional summary here"
}

RESUME TEXT:
${trimmedText}`;

  const parsed = await callGeminiJson(prompt);
  return normalizeAnalysis(parsed);
};

module.exports = { analyzeResumeWithGemini, EMPTY_ANALYSIS };
