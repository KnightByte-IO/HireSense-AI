/**
 * pages/ResumeUpload.jsx
 *
 * User yahan PDF resume upload karta hai.
 * Flow: file select → API call → loading → success/error → text preview
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
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setError("");
    setSuccess("");
    setPreview(null);

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
      setSuccess(response.message || "Resume uploaded successfully!");
      setPreview(response.data);
    } catch (err) {
      setError(err.message || "Upload fail ho gaya");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Upload Resume" subtitle="AI-powered skill extraction">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Upload Resume</h1>
            <p className="mt-2 text-slate-400">
              PDF upload karo — HireSense AI automatically skills, education aur experience extract karega.
            </p>
          </div>

          {/* Upload card */}
          <div className="card">
            <div
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition ${
                file ? "border-brand-500/50 bg-brand-500/5" : "border-slate-700 hover:border-slate-600"
              }`}
            >
              <svg className="h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m3 0h3.75m-3.75 0v-3.375c0-.621-.504-1.125-1.125-1.125h-1.5c-.621 0-1.125.504-1.125 1.125v3.375m6 0V9.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 9.75v8.25A2.25 2.25 0 006.75 20.25h10.5A2.25 2.25 0 0019.5 18v-3.75z" />
              </svg>

              <p className="mt-4 text-sm font-medium text-slate-300">
                {file ? file.name : "PDF resume yahan drag karo ya select karo"}
              </p>
              <p className="mt-1 text-xs text-slate-500">Max size: 5MB · PDF only</p>

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

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="btn-primary mt-6 w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Analyzing with AI...
                </span>
              ) : (
                "Upload & Analyze Resume"
              )}
            </button>
          </div>

          {/* Resume text preview */}
          {preview?.resumeText && (
            <div className="card mt-6">
              <h2 className="text-lg font-semibold text-white">Resume Text Preview</h2>
              <p className="mt-1 text-sm text-slate-400">
                PDF se extract hua text (pehle 800 characters)
              </p>
              <pre className="mt-4 max-h-64 overflow-auto rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs leading-relaxed text-slate-400 whitespace-pre-wrap">
                {preview.resumeText.slice(0, 800)}
                {preview.resumeText.length > 800 && "..."}
              </pre>

              <Link
                to="/resume/analysis"
                className="btn-primary mt-6 inline-flex !text-sm"
              >
                View Full AI Analysis →
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeUpload;
