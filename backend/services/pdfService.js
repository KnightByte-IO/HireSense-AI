/**
 * services/pdfService.js
 *
 * PDF buffer se plain text nikalne ka kaam.
 * pdf-parse library PDF ke andar ka text extract karti hai.
 */

const pdfParse = require("pdf-parse");

/**
 * PDF buffer ko text me convert karo
 * @param {Buffer} buffer - Multer se mila hua file buffer
 * @returns {string} - Resume ka plain text
 */
const extractTextFromPdf = async (buffer) => {
  if (!buffer || buffer.length === 0) {
    const error = new Error("PDF file khali hai");
    error.statusCode = 400;
    throw error;
  }

  const data = await pdfParse(buffer);
  const text = data.text?.trim();

  if (!text || text.length < 50) {
    const error = new Error(
      "PDF se kaafi text nahi mila. Scanned image PDF ho sakti hai — text-based PDF use karo."
    );
    error.statusCode = 400;
    throw error;
  }

  return text;
};

module.exports = { extractTextFromPdf };
