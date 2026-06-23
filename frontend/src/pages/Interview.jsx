/**
 * pages/Interview.jsx
 *
 * AI Interview page — ek-ek karke questions dikhata hai.
 * Har answer submit par backend me save hota hai.
 */

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import {
  generateInterview,
  getInterview,
  submitInterviewAnswer,
} from "../services/api";

const difficultyStyles = {
  Easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Hard: "bg-red-500/10 text-red-400 border-red-500/30",
};

const categoryStyles = {
  Technical: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
  Behavioral: "bg-violet-500/10 text-violet-300 border-violet-500/30",
};

const Interview = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadInterview = async (id) => {
    const response = await getInterview(id);
    setInterview(response.data);

    const firstUnanswered = response.data.questions.findIndex(
      (_, i) =>
        !response.data.answers?.some((a) => a.questionIndex === i)
    );
    setCurrentIndex(firstUnanswered >= 0 ? firstUnanswered : 0);

    const saved = response.data.answers?.find(
      (a) => a.questionIndex === (firstUnanswered >= 0 ? firstUnanswered : 0)
    );
    setAnswer(saved?.answer || "");
  };

  useEffect(() => {
    const init = async () => {
      try {
        setError("");
        if (interviewId) {
          await loadInterview(interviewId);
        }
      } catch (err) {
        setError(err.message || "Interview load nahi ho payi");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [interviewId]);

  const handleGenerate = async (resumeId) => {
    setGenerating(true);
    setError("");

    try {
      const response = await generateInterview(resumeId);
      navigate(`/interview/${response.data.id}`, { replace: true });
      setInterview(response.data);
      setCurrentIndex(0);
      setAnswer("");
    } catch (err) {
      setError(err.message || "Questions generate nahi ho paye");
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!interview?._id && !interview?.id) return;

    const id = interview._id || interview.id;

    setSubmitting(true);
    setError("");

    try {
      const response = await submitInterviewAnswer(id, currentIndex, answer);
      setInterview((prev) => ({
        ...prev,
        answers: response.data.answers,
        completed: response.data.completed,
      }));

      const isLast = currentIndex >= interview.questions.length - 1;

      if (isLast) {
        return;
      }

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      const saved = response.data.answers?.find(
        (a) => a.questionIndex === nextIndex
      );
      setAnswer(saved?.answer || "");
    } catch (err) {
      setError(err.message || "Answer save nahi ho paya");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="AI Interview" subtitle="Loading...">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!interviewId && !interview) {
    return (
      <DashboardLayout title="AI Interview" subtitle="Get started">
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
          <h1 className="text-2xl font-bold text-white">AI Mock Interview</h1>
          <p className="mt-2 max-w-md text-slate-400">
            Resume analysis page se &quot;Start AI Interview&quot; dabao, ya yahan se
            naya interview generate karo.
          </p>
          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <button
            onClick={() => handleGenerate()}
            disabled={generating}
            className="btn-primary mt-6 !text-sm"
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating Questions...
              </span>
            ) : (
              "Generate Interview Questions"
            )}
          </button>
          <Link to="/resume/analysis" className="mt-4 text-sm text-brand-400 hover:text-brand-300">
            ← Back to Resume Analysis
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  if (!interview) {
    return (
      <DashboardLayout title="AI Interview" subtitle="Error">
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
          <p className="text-slate-400">{error || "Interview nahi mili"}</p>
          <Link to="/resume/analysis" className="btn-primary mt-6 !text-sm">
            Resume Analysis
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const currentQuestion = interview.questions[currentIndex];
  const totalQuestions = interview.questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentIndex >= totalQuestions - 1;
  const isCompleted = interview.completed;

  return (
    <DashboardLayout
      title="AI Interview"
      subtitle={`Question ${currentIndex + 1} of ${totalQuestions}`}
    >
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm text-slate-400">
              <span>Progress</span>
              <span>
                {currentIndex + 1} / {totalQuestions}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {isCompleted && isLastQuestion ? (
            <div className="card text-center py-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">Interview Complete!</h2>
              <p className="mt-2 text-slate-400">
                Saare {totalQuestions} questions ke answers save ho gaye.
              </p>
              <Link
                to={`/interview/${interview._id || interview.id}/results`}
                className="btn-primary mt-6 inline-flex !text-sm"
              >
                Get AI Evaluation →
              </Link>
              <Link to="/dashboard" className="mt-3 block text-sm text-slate-400 hover:text-white">
                Skip to Dashboard
              </Link>
            </div>
          ) : (
            <div className="card">
              {/* Question number + badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-brand-500/10 px-3 py-1 text-sm font-bold text-brand-300">
                  Q{currentIndex + 1}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    difficultyStyles[currentQuestion.difficulty]
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    categoryStyles[currentQuestion.category]
                  }`}
                >
                  {currentQuestion.category}
                </span>
              </div>

              {/* Question text */}
              <h2 className="mt-6 text-lg font-semibold leading-relaxed text-white sm:text-xl">
                {currentQuestion.question}
              </h2>

              {/* Answer textarea */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Your Answer
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={6}
                  placeholder="Apna jawab yahan likho..."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Next button */}
              <button
                onClick={handleNext}
                disabled={!answer.trim() || submitting}
                className="btn-primary mt-6 w-full"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </span>
                ) : isLastQuestion ? (
                  "Submit & Finish"
                ) : (
                  "Next Question →"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Interview;
