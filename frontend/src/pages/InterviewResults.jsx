/**
 * pages/InterviewResults.jsx
 *
 * AI Interview evaluation report — scores, strengths, weaknesses,
 * skill-wise analysis, per-question feedback.
 */

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { evaluateInterview, getInterviewResults } from "../services/api";

const ScoreRing = ({ score, label, color }) => {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-28">
        <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{score}</span>
          <span className="text-[10px] text-slate-500">/ 100</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-400">{label}</p>
    </div>
  );
};

const ProgressBar = ({ label, score, color }) => (
  <div>
    <div className="mb-1 flex justify-between text-sm">
      <span className="text-slate-300">{label}</span>
      <span className="font-semibold text-white">{score}%</span>
    </div>
    <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
      <div
        className={`h-full rounded-full ${color} transition-all duration-700`}
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

const InterviewResults = () => {
  const { interviewId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");
  const [expandedQ, setExpandedQ] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const response = await getInterviewResults(interviewId);
        setResults(response.data);
      } catch (err) {
        if (err.status === 400) {
          setResults(null);
        } else {
          setError(err.message || "Results load nahi ho paye");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [interviewId]);

  const handleEvaluate = async () => {
    if (evaluating) return;

    setEvaluating(true);
    setError("");

    try {
      await evaluateInterview(interviewId);
      const response = await getInterviewResults(interviewId);
      setResults(response.data);
    } catch (err) {
      if (err.status === 409) {
        setError("Evaluation already running. 30 sec wait karo.");
      } else {
        setError(err.message || "Evaluation fail ho gayi");
      }
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Interview Results" subtitle="Loading...">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!results) {
    return (
      <DashboardLayout title="Interview Results" subtitle="AI Evaluation">
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
          <h1 className="text-2xl font-bold text-white">Ready for AI Evaluation</h1>
          <p className="mt-2 max-w-md text-slate-400">
            Gemini har answer ko score karega, strengths/weaknesses batayega, aur ideal
            answer suggest karega.
          </p>
          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <button
            onClick={handleEvaluate}
            disabled={evaluating}
            className="btn-primary mt-6 !text-sm"
          >
            {evaluating ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                AI evaluating with rubric... (~1 min)
              </span>
            ) : (
              "Start AI Evaluation"
            )}
          </button>
          <p className="mt-3 max-w-md text-xs text-slate-500">
            Each answer scored on relevance, accuracy, depth & clarity — not just length.
          </p>
          <Link to={`/interview/${interviewId}`} className="mt-4 text-sm text-brand-400 hover:text-brand-300">
            ← Back to Interview
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const { report, evaluations, questions, answers } = results;

  return (
    <DashboardLayout title="Interview Results" subtitle="AI Performance Report">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Overall score cards */}
          <div className="card">
            <h1 className="text-xl font-bold text-white sm:text-2xl">Overall Performance</h1>
            <p className="mt-1 text-sm text-slate-400">
              Evaluated on {new Date(results.evaluatedAt).toLocaleString()}
              {results.evaluationMethod === "local" ? (
                <span className="ml-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                  Approximate scores (Gemini unavailable)
                </span>
              ) : (
                <span className="ml-2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                  AI rubric evaluation
                </span>
              )}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-8 sm:gap-12">
              <ScoreRing score={report.overallScore} label="Overall" color="#6366f1" />
              <ScoreRing score={report.technicalScore} label="Technical" color="#8b5cf6" />
              <ScoreRing score={report.behavioralScore} label="Behavioral" color="#10b981" />
            </div>
          </div>

          {/* Progress charts */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white">Score Breakdown</h2>
            <div className="mt-6 space-y-4">
              <ProgressBar label="Overall Score" score={report.overallScore} color="bg-indigo-500" />
              <ProgressBar label="Technical Questions" score={report.technicalScore} color="bg-violet-500" />
              <ProgressBar label="Behavioral Questions" score={report.behavioralScore} color="bg-emerald-500" />
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card">
              <h2 className="text-lg font-semibold text-emerald-400">Strengths</h2>
              <ul className="mt-4 space-y-2">
                {report.strengths?.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-1 text-emerald-400">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h2 className="text-lg font-semibold text-amber-400">Areas to Improve</h2>
              <ul className="mt-4 space-y-2">
                {report.weaknesses?.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-1 text-amber-400">→</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skill-wise analysis */}
          {report.skillWiseAnalysis?.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-white">Skill-wise Analysis</h2>
              <div className="mt-6 space-y-4">
                {report.skillWiseAnalysis.map((skill) => (
                  <div key={skill.skill} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{skill.skill}</span>
                      <span className="rounded-full bg-brand-500/10 px-3 py-0.5 text-sm font-bold text-brand-300">
                        {skill.score}%
                      </span>
                    </div>
                    <ProgressBar label="" score={skill.score} color="bg-brand-500" />
                    {skill.feedback && (
                      <p className="mt-2 text-sm text-slate-400">{skill.feedback}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation */}
          {report.recommendation && (
            <div className="card border-brand-500/30 bg-gradient-to-r from-brand-600/10 to-violet-600/10">
              <h2 className="text-lg font-semibold text-brand-300">Overall Recommendation</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {report.recommendation}
              </p>
            </div>
          )}

          {/* Per-question details */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white">Question-wise Feedback</h2>
            <div className="mt-6 space-y-3">
              {evaluations?.map((ev) => {
                const q = questions[ev.questionIndex];
                const ans = answers?.find((a) => a.questionIndex === ev.questionIndex);
                const isOpen = expandedQ === ev.questionIndex;

                return (
                  <div
                    key={ev.questionIndex}
                    className="rounded-xl border border-slate-800 bg-slate-900/40"
                  >
                    <button
                      onClick={() => setExpandedQ(isOpen ? null : ev.questionIndex)}
                      className="flex w-full items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded-lg bg-brand-500/10 px-2 py-1 text-xs font-bold text-brand-300">
                          Q{ev.questionIndex + 1}
                        </span>
                        <span className="text-sm text-slate-300 line-clamp-1">{q?.question}</span>
                      </div>
                      <span
                        className={`ml-4 flex-shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                          ev.score >= 70
                            ? "bg-emerald-500/10 text-emerald-400"
                            : ev.score >= 50
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {ev.score}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-800 px-4 pb-4 pt-3 space-y-3">
                        <div>
                          <p className="text-xs font-semibold uppercase text-slate-500">Your Answer</p>
                          <p className="mt-1 text-sm text-slate-300">{ans?.answer}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-slate-500">Feedback</p>
                          <p className="mt-1 text-sm text-slate-300">{ev.feedback}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-slate-500">Ideal Answer</p>
                          <p className="mt-1 text-sm text-brand-200">{ev.idealAnswer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/dashboard" className="btn-primary !text-sm">
              View Dashboard
            </Link>
            <Link to="/resume/analysis" className="btn-secondary !text-sm">
              Practice Again
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewResults;
