import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getResumeSummary, getInterviewPerformance } from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeRes, perfRes] = await Promise.all([
          getResumeSummary(),
          getInterviewPerformance(),
        ]);
        setSummary(resumeRes.data);
        setPerformance(perfRes.data);
      } catch {
        setSummary({ hasResume: false, analysisCompleted: false });
        setPerformance({ hasEvaluation: false });
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      title: "Analysis Status",
      value: summary?.analysisCompleted ? "Complete" : summary?.hasResume ? "Pending" : "—",
      change: summary?.hasResume
        ? summary.analysisCompleted
          ? "AI analysis done"
          : "Run analysis on resume page"
        : "Upload resume first",
      accent: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
    },
    {
      title: "Interview Score",
      value: performance?.latestScore != null ? `${performance.latestScore}%` : "—",
      change: performance?.hasEvaluation
        ? `Technical: ${performance.technicalScore}% · Behavioral: ${performance.behavioralScore}%`
        : "Complete an interview",
      accent: "from-violet-500/20 to-violet-600/5 border-violet-500/20",
    },
    {
      title: "Interviews Done",
      value: performance?.evaluatedCount ?? "—",
      change: `${performance?.totalInterviews || 0} completed total`,
      accent: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/20",
    },
    {
      title: "Last Evaluation",
      value: performance?.lastEvaluatedAt
        ? new Date(performance.lastEvaluatedAt).toLocaleDateString()
        : "—",
      change: performance?.hasEvaluation ? "View full report below" : "No evaluation yet",
      accent: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20",
    },
  ];

  return (
    <DashboardLayout title="Dashboard" subtitle="Performance Overview">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-brand-600/10 via-slate-900 to-violet-600/10 p-6 sm:p-8">
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-brand-300">Good to see you back</p>
              <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                Welcome back, {user?.name || "User"}
              </h1>
              <p className="mt-2 max-w-xl text-slate-400">
                Upload resume, practice AI interviews, and track your performance.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/resume/upload" className="btn-primary !text-sm">
                Upload Resume
              </Link>
              {summary?.analysisCompleted && (
                <Link to="/resume/analysis" className="btn-secondary !text-sm">
                  Start Interview
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.title} className={`card bg-gradient-to-br ${stat.accent} border`}>
              <p className="text-sm font-medium text-slate-400">{stat.title}</p>
              <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 truncate text-xs text-slate-500">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Performance section */}
        {performance?.hasEvaluation && (
          <div className="card mt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Interview Performance</h2>
                <p className="mt-1 text-sm text-slate-400">Latest AI evaluation summary</p>
              </div>
              <Link
                to={`/interview/${performance.latestInterviewId}/results`}
                className="btn-secondary !text-sm"
              >
                View Full Report
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Overall", score: performance.latestScore, color: "bg-indigo-500" },
                { label: "Technical", score: performance.technicalScore, color: "bg-violet-500" },
                { label: "Behavioral", score: performance.behavioralScore, color: "bg-emerald-500" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{item.score}%</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {performance.skillWiseAnalysis?.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-slate-400">Top Skills</p>
                <div className="flex flex-wrap gap-2">
                  {performance.skillWiseAnalysis.slice(0, 5).map((s) => (
                    <span
                      key={s.skill}
                      className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-sm text-brand-300"
                    >
                      {s.skill} · {s.score}%
                    </span>
                  ))}
                </div>
              </div>
            )}

            {performance.recommendation && (
              <p className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
                {performance.recommendation}
              </p>
            )}
          </div>
        )}

        <div className="card mt-8">
          <h2 className="text-lg font-semibold text-white">HireSense AI Pipeline</h2>
          <p className="mt-1 text-sm text-slate-400">End-to-end flow</p>
          <ol className="mt-6 space-y-4">
            {[
              "Upload PDF resume → stored in uploads/",
              "AI Resume Analysis → skills, projects, experience",
              "Generate 10 personalized interview questions",
              "Answer questions → AI evaluates → performance report",
            ].map((text, i) => (
              <li key={text} className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-sm font-bold text-brand-400">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-300">{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
