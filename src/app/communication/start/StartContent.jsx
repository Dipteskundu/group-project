"use client";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { MessageSquare, Clock, FileQuestion, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function StartContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const jobId = searchParams.get("jobId");
  const jobTitle = searchParams.get("jobTitle") || "this role";
  const company = searchParams.get("company") || "the company";

  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push(
        `/signin?redirect=/communication/start?jobId=${jobId}&jobTitle=${encodeURIComponent(jobTitle)}&company=${encodeURIComponent(company)}`
      );
      return;
    }
    if (!jobId) {
      setError("Missing job ID. Please apply from the job listing.");
    }
  }, [authLoading, isAuthenticated, router, jobId, jobTitle, company]);

  const handleStartTest = async () => {
    if (!jobId || !user) return;
    setError("");
    setStarting(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${apiBase}/api/communication/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: user.uid,
          jobId,
          jobTitle,
          company,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to start test");
      }

      router.push(`/communication/test?sessionId=${data.sessionId}&jobId=${jobId}`);
    } catch (err) {
      setError(err.message || "Failed to start test");
    } finally {
      setStarting(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fdfdfe] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfdfe]">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-24 max-w-2xl">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 premium-shadow p-10 sm:p-14">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Communication Skill Test</h1>
                <p className="text-slate-500 font-medium text-sm sm:text-base">
                  {jobTitle} at {company}
                </p>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-3 text-slate-600">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold">Duration: 10 minutes</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <FileQuestion className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold">Questions: 5</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                You will answer professional communication scenarios including
                email writing, conflict resolution, teamwork, and client
                explanation. Your responses will be evaluated by AI for clarity,
                tone, grammar, and structure.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleStartTest}
                disabled={starting || !jobId}
                className="flex-1 py-4 px-8 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all active:scale-95 premium-shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {starting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Start Test <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <Link
                href="/jobs"
                className="py-4 px-8 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-colors text-center"
              >
                Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
