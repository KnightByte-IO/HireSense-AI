/**
 * services/geminiService.js
 *
 * Google Gemini API se resume analysis karwata hai.
 *
 * Prompt Engineering Decisions:
 * 1. "JSON only" — extra text nahi, parse easy
 * 2. Fixed schema — har baar same structure milega
 * 3. "Only from resume" — AI hallucinate na kare, jo likha hai wahi nikale
 * 4. Empty array if missing — null/error avoid
 * 5. Short resume text limit — token cost control (first 12000 chars)
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Resume text bhej kar structured JSON analysis lao
 * @param {string} resumeText
 * @returns {Object} parsed analysis
 */
const analyzeResumeWithGemini = async (resumeText) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const error = new Error(
      "GEMINI_API_KEY .env me set nahi hai. Gemini API key add karo."
    );
    error.statusCode = 500;
    throw error;
  }

  // Gemini client initialize
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  });

  // Bahut lamba resume ho to tokens bachane ke liye trim
  const trimmedText = resumeText.slice(0, 12000);

  const prompt = `You are an expert resume parser for HireSense AI.

Read the resume text below and extract information.

RULES:
- Return ONLY valid JSON. No markdown, no explanation, no code fences.
- Extract ONLY what is clearly present in the resume. Do NOT invent data.
- If a section is missing, use an empty array [].
- technicalSkills = programming languages, frameworks, tools, databases
- softSkills = communication, leadership, teamwork, etc.
- education = array of { degree, institution, year }
- experience = array of { role, company, duration, description }
- projects = array of { name, description, technologies (array of strings) }

Required JSON format:
{
  "technicalSkills": ["skill1", "skill2"],
  "softSkills": ["skill1", "skill2"],
  "education": [{ "degree": "", "institution": "", "year": "" }],
  "experience": [{ "role": "", "company": "", "duration": "", "description": "" }],
  "projects": [{ "name": "", "description": "", "technologies": ["tech1"] }]
}

RESUME TEXT:
${trimmedText}`;

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // Kabhi-kabhi Gemini ```json ... ``` wrap karta hai — hata do
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    // Default structure ensure karo — missing keys se crash na ho
    return {
      technicalSkills: Array.isArray(parsed.technicalSkills)
        ? parsed.technicalSkills
        : [],
      softSkills: Array.isArray(parsed.softSkills) ? parsed.softSkills : [],
      education: Array.isArray(parsed.education) ? parsed.education : [],
      experience: Array.isArray(parsed.experience) ? parsed.experience : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    };
  } catch (error) {
    console.error("Gemini analysis error:", error.message);

    const err = new Error(
      "Gemini se resume analyze nahi ho payi. API key check karo ya dubara try karo."
    );
    err.statusCode = 502;
    throw err;
  }
};

module.exports = { analyzeResumeWithGemini };
