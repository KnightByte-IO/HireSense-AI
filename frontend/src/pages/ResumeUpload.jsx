/**
 * pages/ResumeUpload.jsx
 *
 * User yahan PDF resume upload karta hai.
 * Flow: file select → FormData → API → success/error message
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { uploadResume } from "../services/api";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadedData, setUploadedData] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setError("");
    setSuccess("");
    setUploadedData(null);

    if (!selected) {
      setFile(null);
      return;
    }

    if (selected.type !== "application/pdf") {
      setError("Sirf PDF file select karo");
      setFile(null);
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("File 5MB se chhoti honi chahiye");
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Pehle PDF file select karo");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await uploadResume(file);
      setSuccess(response.message || "Resume upload successful!");
      setUploadedData(response.data);
      setFile(null);
    } catch (err) {
      setError(err.message || "Upload fail ho gaya");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "—";
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <DashboardLayout title="Resume" subtitle="Upload PDF">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Upload Resume</h1>
            <p className="mt-2 text-slate-400">
              Apni PDF resume upload karo. File server par save hogi aur MongoDB me record banega.
            </p>
          </div>

          <div className="card">
            <div
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition ${
                file ? "border-brand-500/50 bg-brand-500/5" : "border-slate-700 hover:border-slate-600"
              }`}
            >
              <svg className="h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>

              <p className="mt-4 text-sm font-medium text-slate-300">
                {file ? file.name : "PDF resume select karo"}
              </p>
              <p className="mt-1 text-xs text-slate-500">PDF only · Max 5MB</p>

              <label className="btn-primary mt-6 cursor-pointer !text-sm">
                Choose PDF
                <input type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                {success}
              </div>
            )}

            <button onClick={handleUpload} disabled={!file || loading} className="btn-primary mt-6 w-full">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Uploading...
                </span>
              ) : (
                "Upload Resume"
              )}
            </button>
          </div>

          {/* Upload success details */}
          {uploadedData && (
            <div className="card mt-6">
              <h2 className="text-lg font-semibold text-white">Upload Details</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-800 py-2">
                  <span className="text-slate-400">File Name</span>
                  <span className="font-medium text-white">{uploadedData.fileName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 py-2">
                  <span className="text-slate-400">Saved Path</span>
                  <span className="font-medium text-brand-300">{uploadedData.filePath}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 py-2">
                  <span className="text-slate-400">File Size</span>
                  <span className="text-white">{formatFileSize(uploadedData.fileSize)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Uploaded At</span>
                  <span className="text-white">
                    {new Date(uploadedData.uploadedAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <Link to="/resume/analysis" className="btn-primary mt-6 inline-flex !text-sm">
                Analyze Resume with AI →
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeUpload;
