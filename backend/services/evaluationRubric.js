/**
 * services/evaluationRubric.js
 *
 * Interview scoring rubric — Gemini ko accurate evaluation ke liye.
 * Score sirf answer length se NAHI, content quality se.
 */

const SCORING_RUBRIC = `
SCORING RUBRIC (total 0-100 per answer):

1. RELEVANCE (0-25): Does the answer directly address the question asked?
   - 0-8: Off-topic or doesn't answer the question
   - 9-16: Partially relevant
   - 17-25: Fully addresses the question

2. ACCURACY (0-25): Is the content factually/technically correct?
   - Technical: correct concepts, no major errors
   - Behavioral: realistic, credible examples
   - 0-8: Major errors or fabricated claims
   - 17-25: Accurate and well-reasoned

3. DEPTH (0-25): Quality of explanation and examples
   - 0-8: One-liner, no examples
   - 9-16: Some detail but shallow
   - 17-25: Strong examples, reasoning, structure (STAR for behavioral)

4. CLARITY (0-25): Communication quality
   - 0-8: Confusing or disorganized
   - 17-25: Clear, structured, professional

PENALTIES (subtract from total):
- -15: Answer is completely wrong or nonsense
- -10: Copy-paste generic answer unrelated to question
- -10: Says "I don't know" with no attempt

IMPORTANT:
- Do NOT give high scores just because the answer is long
- Empty or 1-line answers: score 10-25 max
- Score must reflect actual answer quality, not politeness
`;

const buildSingleQuestionPrompt = ({
  question,
  userAnswer,
  difficulty,
  category,
  resumeSkills,
}) => `You are a strict, fair technical interviewer evaluating ONE answer.

${SCORING_RUBRIC}

QUESTION (${difficulty}, ${category}):
${question}

CANDIDATE ANSWER:
${userAnswer}

CANDIDATE SKILLS (for context only):
${JSON.stringify(resumeSkills.slice(0, 6))}

Return ONLY valid JSON:
{
  "score": 72,
  "relevanceScore": 20,
  "accuracyScore": 18,
  "depthScore": 17,
  "clarityScore": 17,
  "strengths": ["specific strength from their answer"],
  "weaknesses": ["specific gap in their answer"],
  "idealAnswer": "What a strong candidate would say (3-5 sentences, specific to this question)",
  "feedback": "Constructive feedback referencing what they wrote"
}

Rules:
- score should approximately equal relevanceScore + accuracyScore + depthScore + clarityScore (max 100)
- strengths/weaknesses must reference THIS answer, not generic advice
- idealAnswer must be specific to THIS question`;

const buildChunkPrompt = ({ qaPairs, resumeSkills }) => `You are a strict, fair technical interviewer.

${SCORING_RUBRIC}

Evaluate EACH answer below independently. Apply the rubric strictly.

Return ONLY valid JSON:
{
  "evaluations": [
    {
      "questionIndex": 0,
      "score": 72,
      "relevanceScore": 20,
      "accuracyScore": 18,
      "depthScore": 17,
      "clarityScore": 17,
      "strengths": ["..."],
      "weaknesses": ["..."],
      "idealAnswer": "...",
      "feedback": "..."
    }
  ]
}

CANDIDATE SKILLS: ${JSON.stringify(resumeSkills.slice(0, 8))}

QUESTIONS AND ANSWERS:
${JSON.stringify(qaPairs, null, 2)}`;

const buildReportPrompt = ({ evaluations, questions, resumeSkills }) => {
  const summary = evaluations.map((ev) => ({
    q: questions[ev.questionIndex]?.question?.slice(0, 100),
    category: questions[ev.questionIndex]?.category,
    score: ev.score,
    strengths: ev.strengths,
    weaknesses: ev.weaknesses,
  }));

  return `Based on interview evaluation results, create an overall report.

Return ONLY valid JSON:
{
  "strengths": ["top 5 overall strengths across all answers"],
  "weaknesses": ["top 5 areas to improve"],
  "skillWiseAnalysis": [
    { "skill": "React", "score": 75, "feedback": "based on technical answers" }
  ],
  "recommendation": "2-3 sentences hiring readiness advice"
}

RESUME SKILLS: ${JSON.stringify(resumeSkills)}
EVALUATION SUMMARY: ${JSON.stringify(summary, null, 2)}`;
};

module.exports = {
  SCORING_RUBRIC,
  buildSingleQuestionPrompt,
  buildChunkPrompt,
  buildReportPrompt,
};
