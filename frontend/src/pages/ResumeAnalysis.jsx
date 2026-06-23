/**
 * pages/ResumeAnalysis.jsx
 *
 * Resume AI analysis dikhata hai.
 * Agar analysis nahi hui to "Analyze" button — loading spinner ke saath.
 */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { getMyResume, analyzeResume, generateInterview } from "../services/api";

const SkillPills = ({ skills, variant = "tech" }) => {
  if (!skills?.length) {
    return <p className="text-sm text-slate-500">Koi skill detect nahi hui</p>;
  }

  const styles = {
    tech: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
    soft: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  };

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className={`rounded-full border px-3 py-1 text-sm font-medium ${styles[variant]}`}
        >
          {skill}
        </span>
      ))}
    </div>
  );
};

const ResumeAnalysis = () => {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [startingInterview, setStartingInterview] = useState(false);
  const [error, setError] = useState("");

  const fetchResume = async () => {
    try {
      setError("");
      const response = await getMyResume();
      setResume(response.data);
    } catch (err) {
      if (err.status === 404) {
        setError("Pehle resume upload karo");
      } else {
        setError(err.message || "Resume load nahi ho payi");
      }
      setResume(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleAnalyze = async () => {
    if (!resume?._id) return;

    setAnalyzing(true);
    setError("");

    try {
      const response = await analyzeResume(resume._id);
      setResume((prev) => ({ ...prev, ...response.data }));
    } catch (err) {
      setError(err.message || "Analysis fail ho gayi");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStartInterview = async () => {
    if (!resume?._id) return;

    setStartingInterview(true);
    setError("");

    try {
      const response = await generateInterview(resume._id);
      navigate(`/interview/${response.data.id}`);
    } catch (err) {
      setError(err.message || "Interview start nahi ho payi");
    } finally {
      setStartingInterview(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Resume Analysis" subtitle="AI insights">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (error && !resume) {
    return (
      <DashboardLayout title="Resume Analysis" subtitle="AI insights">
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
          <p className="text-slate-400">{error}</p>
          <Link to="/resume/upload" className="btn-primary mt-6 !text-sm">
            Upload Resume
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isAnalyzed = resume?.analysisCompleted;

  return (
    <DashboardLayout title="Resume Analysis" subtitle={resume?.fileName}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header + Analyze button */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-brand-600/10 to-violet-600/10 p-6">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Resume Analysis</h1>
            <p className="mt-1 text-sm text-slate-400">
              {resume.fileName} · Uploaded{" "}
              {new Date(resume.uploadedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                isAnalyzed
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}
            >
              {isAnalyzed ? "Analysis Complete" : "Pending Analysis"}
            </span>

            {!isAnalyzed && (
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="btn-primary !py-2 !text-sm"
              >
                {analyzing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Analyzing Resume...
                  </span>
                ) : (
                  "Analyze Resume"
                )}
              </button>
            )}

            {isAnalyzed && (
              <button
                onClick={handleStartInterview}
                disabled={startingInterview}
                className="btn-primary !py-2 !text-sm"
              >
                {startingInterview ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Generating Questions...
                  </span>
                ) : (
                  "Start AI Interview"
                )}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Analyzing overlay */}
        {analyzing && (
          <div className="card mb-6 flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            <p className="mt-4 text-lg font-medium text-white">Analyzing Resume...</p>
            <p className="mt-2 text-sm text-slate-400">
              PDF parse ho raha hai → Gemini AI skills extract kar raha hai
            </p>
          </div>
        )}

        {!isAnalyzed && !analyzing && (
          <div className="card text-center py-12">
            <p className="text-slate-400">
              Resume upload ho chuki hai. Analysis start karne ke liye button dabao.
            </p>
          </div>
        )}

        {isAnalyzed && !analyzing && (
          <div className="grid gap-6">
            {/* Summary */}
            {resume.summary && (
              <div className="card">
                <h2 className="text-lg font-semibold text-white">Resume Summary</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {resume.summary}
                </p>
                {resume.analyzedAt && (
                  <p className="mt-3 text-xs text-slate-500">
                    Analyzed on {new Date(resume.analyzedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="card">
                <h2 className="text-lg font-semibold text-white">Technical Skills</h2>
                <div className="mt-4">
                  <SkillPills skills={resume.technicalSkills} variant="tech" />
                </div>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-white">Soft Skills</h2>
                <div className="mt-4">
                  <SkillPills skills={resume.softSkills} variant="soft" />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-white">Education</h2>
              {resume.education?.length ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {resume.education.map((edu, i) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                      <p className="font-medium text-white">{edu.degree}</p>
                      <p className="mt-1 text-sm text-slate-400">{edu.institution}</p>
                      {edu.year && <p className="mt-1 text-xs text-brand-400">{edu.year}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Education detect nahi hui</p>
              )}
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-white">Experience</h2>
              {resume.experience?.length ? (
                <div className="mt-4 space-y-4">
                  {resume.experience.map((exp, i) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                      <p className="font-medium text-white">{exp.role}</p>
                      <p className="text-sm text-brand-400">{exp.company}</p>
                      {exp.duration && (
                        <p className="mt-1 text-xs text-slate-500">{exp.duration}</p>
                      )}
                      {exp.description && (
                        <p className="mt-2 text-sm text-slate-400">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Experience detect nahi hui</p>
              )}
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-white">Projects</h2>
              {resume.projects?.length ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {resume.projects.map((proj, i) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                      <p className="font-medium text-white">{proj.name}</p>
                      {proj.description && (
                        <p className="mt-2 text-sm text-slate-400">{proj.description}</p>
                      )}
                      {proj.technologies?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {proj.technologies.map((t) => (
                            <span
                              key={t}
                              className="rounded-md bg-violet-500/10 px-2 py-0.5 text-xs text-violet-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Projects detect nahi hue</p>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResumeAnalysis;
