require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: 'Return ONLY JSON: {"ok":true,"message":"hello"}',
  });

  console.log("NEW SDK OK:", (response.text || "").slice(0, 120));
}

main().catch((e) => {
  console.error("NEW SDK FAIL:", e.message);
  process.exit(1);
});
