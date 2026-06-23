/**
 * middleware/uploadMiddleware.js
 *
 * Multer configuration — PDF file receive aur disk par save karne ke liye.
 *
 * Kyu disk storage?
 * - PDF uploads/ folder me save hoti hai
 * - filePath MongoDB me store hota hai
 * - Baad me file download ya process kar sakte ho
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// uploads folder ka path — backend/uploads
const uploadDir = path.join(__dirname, "../uploads");

// Folder nahi hai to bana do (pehli baar server start par)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Disk par file kaise save hogi
const storage = multer.diskStorage({
  // File kahan save hogi
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  // File ka unique naam — same name clash avoid karne ke liye
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Sirf PDF files allow karo
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

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
});

// Form field name = "resume" (frontend se match hona chahiye)
const uploadResume = upload.single("resume");

module.exports = { uploadResume, uploadDir };
