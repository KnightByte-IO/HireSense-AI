/**
 * middleware/uploadMiddleware.js
 *
 * Multer configuration — PDF file receive karne ke liye.
 *
 * Kyu memory storage?
 * - PDF ko disk par save karne ki zaroorat nahi
 * - Buffer seedha pdf-parse ko de dete hain
 * - Server par extra files manage nahi karni padti
 */

const multer = require("multer");
const path = require("path");

// File memory me store hogi (disk par nahi)
const storage = multer.memoryStorage();

// Sirf PDF allow karo — security ke liye
const fileFilter = (req, file, cb) => {
  const isPdf =
    file.mimetype === "application/pdf" ||
    path.extname(file.originalname).toLowerCase() === ".pdf";

  if (isPdf) {
    cb(null, true);
  } else {
    const error = new Error("Sirf PDF file upload kar sakte ho");
    error.statusCode = 400;
    cb(error, false);
  }
};

// Max 5MB — bade files se server slow ho sakta hai
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 'resume' = form field ka naam (frontend se same hona chahiye)
const uploadResume = upload.single("resume");

module.exports = { uploadResume };
