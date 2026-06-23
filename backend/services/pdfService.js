/**
 * services/pdfService.js
 *
 * PDF file se plain text extract karta hai (pdf-parse library).
 *
 * Do tareeke se kaam karta hai:
 * 1. extractTextFromBuffer(buffer) — memory se
 * 2. extractTextFromFile(filePath) — disk par saved PDF se
 */

const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

/**
 * PDF buffer se text nikalo
 */
const extractTextFromBuffer = async (buffer) => {
  if (!buffer || buffer.length === 0) {
    const error = new Error("PDF file khali hai");
    error.statusCode = 400;
    throw error;
  }

  const data = await pdfParse(buffer);
  return validateAndReturnText(data.text);
};

/**
 * Disk par saved PDF file se text nikalo
 * @param {string} filePath - e.g. "uploads/1234-resume.pdf"
 */
const extractTextFromFile = async (filePath) => {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(__dirname, "..", filePath);

  if (!fs.existsSync(absolutePath)) {
    const error = new Error(`PDF file nahi mili: ${filePath}`);
    error.statusCode = 404;
    throw error;
  }

  const buffer = fs.readFileSync(absolutePath);
  const data = await pdfParse(buffer);
  const text = validateAndReturnText(data.text);

  // Terminal me text dikhao — testing ke liye (STEP 1 requirement)
  console.log("\n========== PDF EXTRACTED TEXT (TEST) ==========");
  console.log(text.slice(0, 500));
  if (text.length > 500) console.log("... (truncated for terminal)");
  console.log(`Total characters: ${text.length}`);
  console.log("================================================\n");

  return text;
};

/** Text validate karo — bahut kam text = scanned PDF ho sakti hai */
const validateAndReturnText = (rawText) => {
  const text = rawText?.trim();

  if (!text || text.length < 50) {
    const error = new Error(
      "PDF se kaafi text nahi mila. Text-based PDF use karo (scanned image PDF nahi)."
    );
    error.statusCode = 400;
    throw error;
  }

  return text;
};

module.exports = {
  extractTextFromBuffer,
  extractTextFromFile,
};
