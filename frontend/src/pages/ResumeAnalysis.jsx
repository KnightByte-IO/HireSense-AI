/**
 * pages/ResumeAnalysis.jsx
 *
 * Gemini se extract hui resume analysis dikhata hai.
 * Technical skills, soft skills, education, experience, projects — cards me.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { getMyResume } from "../services/api";

const SkillPills = ({ skills, color }) => {
  if (!skills?.length) {
    return <p className="text-sm text-slate-500">Koi skill detect nahi hui</p>;
  }

  const colors = {
    tech: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
    soft: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  };

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className={`rounded-full border px-3 py-1 text-sm font-medium ${colors[color]}`}
        >
          {skill}
        </span>
      ))}
    </div>
  );
};

const ResumeAnalysis = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await getMyResume();
        setResume(response.data);
      } catch (err) {
        if (err.status === 404) {
          setError("Pehle resume upload karo");
        } else {
          setError(err.message || "Resume load nahi ho payi");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Resume Analysis" subtitle="AI extracted insights">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !resume) {
    return (
      <DashboardLayout title="Resume Analysis" subtitle="AI extracted insights">
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
          <p className="text-slate-400">{error || "Koi resume nahi mili"}</p>
          <Link to="/resume/upload" className="btn-primary mt-6 !text-sm">
            Upload Resume
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const { extractedSkills, education, experience, projects } = resume;

  return (
    <DashboardLayout title="Resume Analysis" subtitle={resume.fileName}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Summary bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-brand-600/10 to-violet-600/10 p-6">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Resume Analysis</h1>
            <p className="mt-1 text-sm text-slate-400">
              {resume.fileName} · Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
              resume.analysisStatus === "completed"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-amber-500/10 text-amber-400"
            }`}
          >
            {resume.analysisStatus === "completed" ? "Analysis Complete" : resume.analysisStatus}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Technical Skills */}
          <div className="card">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">Technical Skills</h2>
            </div>
            <SkillPills skills={extractedSkills?.technicalSkills} color="tech" />
          </div>

          {/* Soft Skills */}
          <div className="card">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">Soft Skills</h2>
            </div>
            <SkillPills skills={extractedSkills?.softSkills} color="soft" />
          </div>

          {/* Education */}
          <div className="card lg:col-span-2">
            <h2 className="text-lg font-semibold text-white">Education</h2>
            {education?.length ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {education.map((edu, i) => (
                  <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <p className="font-medium text-white">{edu.degree || "Degree"}</p>
                    <p className="mt-1 text-sm text-slate-400">{edu.institution}</p>
                    {edu.year && <p className="mt-1 text-xs text-brand-400">{edu.year}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Education detect nahi hui</p>
            )}
          </div>

          {/* Experience */}
          <div className="card lg:col-span-2">
            <h2 className="text-lg font-semibold text-white">Experience</h2>
            {experience?.length ? (
              <div className="mt-4 space-y-4">
                {experience.map((exp, i) => (
                  <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-white">{exp.role}</p>
                        <p className="text-sm text-brand-400">{exp.company}</p>
                      </div>
                      {exp.duration && (
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                          {exp.duration}
                        </span>
                      )}
                    </div>
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

          {/* Projects */}
          <div className="card lg:col-span-2">
            <h2 className="text-lg font-semibold text-white">Projects</h2>
            {projects?.length ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {projects.map((proj, i) => (
                  <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <p className="font-medium text-white">{proj.name}</p>
                    {proj.description && (
                      <p className="mt-2 text-sm text-slate-400">{proj.description}</p>
                    )}
                    {proj.technologies?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {proj.technologies.map((t) => (
                          <span key={t} className="rounded-md bg-violet-500/10 px-2 py-0.5 text-xs text-violet-300">
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

        <div className="mt-8 text-center">
          <Link to="/resume/upload" className="btn-secondary !text-sm">
            Upload New Resume
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeAnalysis;
