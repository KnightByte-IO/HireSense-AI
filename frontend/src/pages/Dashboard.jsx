import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getResumeSummary } from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [resumeSummary, setResumeSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getResumeSummary();
        setResumeSummary(response.data);
      } catch {
        setResumeSummary({ hasResume: false, totalSkills: 0 });
      }
    };
    fetchSummary();
  }, []);

  const stats = [
    {
      title: "Resume Uploaded",
      value: resumeSummary?.hasResume ? "Yes" : "No",
      change: resumeSummary?.fileName || "Upload your resume",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      accent: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      title: "Total Skills Found",
      value: resumeSummary?.totalSkills ?? "—",
      change: "From AI resume analysis",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
      accent: "from-violet-500/20 to-violet-600/5 border-violet-500/20",
      iconColor: "text-violet-400",
    },
    {
      title: "Last Upload",
      value: resumeSummary?.lastUploadDate
        ? new Date(resumeSummary.lastUploadDate).toLocaleDateString()
        : "—",
      change: resumeSummary?.analysisStatus || "Not uploaded yet",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      accent: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      title: "Interviews",
      value: "12",
      change: "Demo data",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      ),
      accent: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/20",
      iconColor: "text-indigo-400",
    },
  ];

  return (
    <DashboardLayout title="Dashboard" subtitle="Overview">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-brand-600/10 via-slate-900 to-violet-600/10 p-6 sm:p-8">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-brand-300">Good to see you back</p>
              <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                Welcome back, {user?.name || "User"}
              </h1>
              <p className="mt-2 max-w-xl text-slate-400">
                Upload your resume for AI skill extraction, then practice interviews to improve.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/resume/upload" className="btn-primary !text-sm">
                Upload Resume
              </Link>
              {resumeSummary?.hasResume && (
                <Link to="/resume/analysis" className="btn-secondary !text-sm">
                  View Analysis
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.title} className={`card bg-gradient-to-br ${stat.accent} border`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                  <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{stat.change}</p>
                </div>
                <div className={`rounded-xl bg-slate-900/60 p-2.5 ${stat.iconColor}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-white">Resume AI Pipeline</h2>
            <p className="mt-1 text-sm text-slate-400">How HireSense processes your resume</p>
            <ol className="mt-6 space-y-4">
              {[
                { step: "1", text: "Upload PDF resume" },
                { step: "2", text: "pdf-parse extracts text" },
                { step: "3", text: "Gemini AI analyzes skills & experience" },
                { step: "4", text: "Results saved to your dashboard" },
              ].map((item) => (
                <li key={item.step} className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-sm font-bold text-brand-400">
                    {item.step}
                  </span>
                  <span className="text-sm text-slate-300">{item.text}</span>
                </li>
              ))}
            </ol>
            <Link to="/resume/upload" className="btn-primary mt-6 inline-flex !text-sm">
              Start Upload →
            </Link>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-white">Quick Tips</h2>
            <p className="mt-1 text-sm text-slate-400">Get better AI extraction results</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-400">
              <li className="flex gap-2"><span className="text-brand-400">•</span> Use text-based PDF (not scanned images)</li>
              <li className="flex gap-2"><span className="text-brand-400">•</span> Keep file under 5MB</li>
              <li className="flex gap-2"><span className="text-brand-400">•</span> Include skills, projects & education clearly</li>
              <li className="flex gap-2"><span className="text-brand-400">•</span> Re-upload when resume is updated</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
