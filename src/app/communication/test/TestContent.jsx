"use client";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { Clock, Send, ChevronLeft, ChevronRight } from "lucide-react";

const TIME_LIMIT_SECONDS = 10 * 60; // 10 minutes

export default function TestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const sessionId = searchParams.get("sessionId");
  const jobId = searchParams.get("jobId");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }
    if (!sessionId) {
      setError("Missing session. Please start the test again.");
      setLoading(false);
      return;
    }

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    fetch(`${apiBase}/api/communication/session/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.redirectToResult) {
          router.push(`/communication/result?sessionId=${sessionId}`);
          return;
        }
        if (data.success && data.questions) {
          setQuestions(data.questions);
          const initial = {};
          data.questions.forEach((q) => {
            initial[q.id] = "";
          });
          setAnswers(initial);
        } else {
          setError(data.message || "Failed to load questions");
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load test");
      })
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated, sessionId, router]);

  useEffect(() => {
    if (!questions.length || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [questions.length, timeLeft]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!sessionId) return;
    setError("");
    setSubmitting(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
      const answersArray = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] || "",
      }));

      const res = await fetch(`${apiBase}/api/communication/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, answers: answersArray }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit");
      }

      router.push(`/communication/result?sessionId=${sessionId}`);
    } catch (err) {
      setError(err.message || "Failed to submit test");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fdfdfe] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfdfe] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading test...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-[#fdfdfe]">
      <Navbar />
      <main className="pt-28 pb-24">
        <div className="container mx-auto px-6 lg:px-24 max-w-3xl">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 premium-shadow overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600 font-bold">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span className={timeLeft < 120 ? "text-red-600" : ""}>{formatTime(timeLeft)}</span>
              </div>
              <span className="text-sm text-slate-500 font-medium">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
            <div className="p-8 sm:p-12">
              {currentQ && (
                <>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">{currentQ.text}</h2>
                  <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-6">{currentQ.type}</p>
                  <textarea
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    placeholder="Type your response here..."
                    rows={8}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none resize-none font-medium placeholder:text-slate-400"
                  />
                </>
              )}
              {error && <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-medium">{error}</div>}
              <div className="mt-10 flex items-center justify-between gap-4">
                <button
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>
                {isLast ? (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || timeLeft <= 0}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Submit Test <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
                  >
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
              {timeLeft <= 0 && !submitting && <p className="mt-4 text-center text-red-600 font-medium">Time&apos;s up! Please submit your answers.</p>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
