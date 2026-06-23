/**
 * scripts/testPdfParse.js
 *
 * Terminal se PDF parsing test karne ke liye.
 *
 * Usage:
 *   node scripts/testPdfParse.js uploads/your-file.pdf
 */

require("dotenv").config();
const { extractTextFromFile } = require("../services/pdfService");

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node scripts/testPdfParse.js uploads/your-resume.pdf");
  process.exit(1);
}

extractTextFromFile(filePath)
  .then((text) => {
    console.log("\nFull extracted text:\n");
    console.log(text);
    console.log("\nTest successful!");
  })
  .catch((err) => {
    console.error("Test failed:", err.message);
    process.exit(1);
  });
