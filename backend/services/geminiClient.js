/**
 * services/geminiClient.js
 *
 * Gemini client — structured JSON, low temperature, multi-version retry.
 */

const { GoogleGenAI } = require("@google/genai");

const DEPRECATED_MODELS = new Set([
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro",
  "gemini-pro",
]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getApiKey = () => {
  const key =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    "";

  return key.trim();
};

const getModelCandidates = () => {
  const defaults = [
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
  ];

  const candidates = [process.env.GEMINI_MODEL, ...defaults].filter(Boolean);

  return [...new Set(candidates.filter((m) => !DEPRECATED_MODELS.has(m)))];
};

const parseJsonResponse = (rawText) => {
  const cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
};

const isModelNotFound = (message = "") =>
  message.includes("404") || message.includes("not found");

const isRetryable = (message = "") =>
  message.includes("503") ||
  message.includes("429") ||
  message.includes("high demand") ||
  message.includes("overloaded") ||
  message.includes("Resource exhausted") ||
  message.includes("timeout");

const isAuthError = (message = "") =>
  message.includes("401") ||
  message.includes("UNAUTHENTICATED") ||
  message.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED") ||
  message.includes("invalid authentication") ||
  message.includes("API_KEY_INVALID");

const createClients = () => {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    const error = new Error("GEMINI_API_KEY .env me valid key set karo.");
    error.statusCode = 500;
    throw error;
  }

  return [
    new GoogleGenAI({ apiKey, apiVersion: "v1beta" }),
    new GoogleGenAI({ apiKey, apiVersion: "v1" }),
    new GoogleGenAI({ apiKey }),
  ];
};

const callGeminiJson = async (
  prompt,
  { maxRetries = 2, timeoutMs = 90000, useJsonMode = true } = {}
) => {
  const modelCandidates = getModelCandidates();

  if (!modelCandidates.length) {
    const error = new Error("Koi valid Gemini model configure nahi hai.");
    error.statusCode = 500;
    throw error;
  }

  const clients = createClients();
  let lastError = null;

  for (const ai of clients) {
    for (const modelName of modelCandidates) {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const config = {
            temperature: 0.2,
            topP: 0.9,
          };

          if (useJsonMode) {
            config.responseMimeType = "application/json";
          }

          const generatePromise = ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config,
          });

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Gemini request timeout")),
              timeoutMs
            )
          );

          const response = await Promise.race([generatePromise, timeoutPromise]);
          const rawText = response.text;

          if (!rawText) {
            throw new Error("Gemini ne koi response nahi diya");
          }

          const parsed = parseJsonResponse(rawText);
          console.log(`Gemini OK: ${modelName} (attempt ${attempt + 1})`);
          return parsed;
        } catch (error) {
          lastError = error;
          const message = error.message || String(error);

          if (isAuthError(message)) {
            break;
          }

          if (error instanceof SyntaxError && attempt < maxRetries - 1) {
            await sleep(1000);
            continue;
          }

          if (isModelNotFound(message)) {
            break;
          }

          if (isRetryable(message) && attempt < maxRetries - 1) {
            await sleep(2000 * (attempt + 1));
            continue;
          }

          if (isRetryable(message)) {
            break;
          }

          break;
        }
      }
    }
  }

  const message = lastError?.message || "Gemini API unavailable";

  if (isAuthError(message)) {
    const err = new Error(
      "Gemini API key invalid ya AQ. key abhi support nahi ho rahi. AI Studio se nayi key banao: https://aistudio.google.com/apikey"
    );
    err.statusCode = 401;
    throw err;
  }

  const err = new Error(
    isRetryable(message)
      ? "Gemini API busy hai. 1 minute baad try karo."
      : message
  );
  err.statusCode = isRetryable(message) ? 503 : 502;
  throw err;
};

module.exports = { callGeminiJson, getModelCandidates, getApiKey };
