"use client";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import HeroSlider from "./components/Hero/HeroSlider";
import Link from "next/link";
import { Search, MapPin, Building2, Star, Users, Briefcase, TrendingUp, PartyPopper, X } from "lucide-react";
import { useState, useEffect } from "react";
import ApplyModal from "./components/form/ApplyModal";
import { useAuth } from "./lib/AuthContext";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob] = useState({ title: "Senior Product Designer", company: "TechFlow AI" });

  /* ── Welcome Popup ─────────────────────────────── */
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeLeaving, setWelcomeLeaving] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only show if the user was just redirected from sign-in
    if (typeof window !== "undefined" && sessionStorage.getItem("showWelcome") === "1") {
      sessionStorage.removeItem("showWelcome");
      // Wait a tick for the user object to populate from Firebase
      const show = setTimeout(() => setShowWelcome(true), 400);
      return () => clearTimeout(show);
    }
  }, []);

  const dismissWelcome = () => {
    setWelcomeLeaving(true);
    setTimeout(() => {
      setShowWelcome(false);
      setWelcomeLeaving(false);
    }, 400);
  };

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (!showWelcome) return;
    const hide = setTimeout(() => dismissWelcome(), 4000);
    return () => clearTimeout(hide);
  }, [showWelcome]);

  // Derive friendly name
  const displayName = user?.displayName
    ? user.displayName.split(" ")[0]
    : user?.email?.split("@")[0] ?? "there";

  const handleApply = () => setIsModalOpen(true);

  return (
    <div className="min-h-screen bg-[#fdfdfe] selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      {/* ── Welcome Back Popup ── */}
      {showWelcome && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] transition-all duration-400 ${welcomeLeaving
            ? "opacity-0 translate-y-4 scale-95"
            : "opacity-100 translate-y-0 scale-100"
            }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }}
          role="status"
          aria-live="polite"
        >
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 h-[3px] bg-indigo-600/20 w-full rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full animate-welcome-bar" />
          </div>

          <div className="flex items-center gap-4 bg-white border border-slate-100 shadow-2xl shadow-slate-200/60 rounded-2xl px-5 py-4 min-w-[300px] max-w-[420px]">
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <PartyPopper className="w-5 h-5 text-indigo-600" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">
                Welcome back 👋
              </p>
              <p className="text-[16px] font-black text-slate-900 truncate">
                {displayName}!
              </p>
            </div>

            {/* Close */}
            <button
              onClick={dismissWelcome}
              className="shrink-0 p-1.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <main>
        {/* Hero Section */}
        <HeroSlider />

        {/* Stats / Proof Section */}
        <section className="py-12 sm:py-16 bg-white border-y border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[
                { label: "Active Jobs", value: "15k+", icon: <Briefcase className="w-5 h-5 text-indigo-600" /> },
                { label: "Companies", value: "500+", icon: <Building2 className="w-5 h-5 text-indigo-600" /> },
                { label: "Success Rate", value: "98%", icon: <TrendingUp className="w-5 h-5 text-indigo-600" /> },
                { label: "Happy Users", value: "50k+", icon: <Users className="w-5 h-5 text-indigo-600" /> },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-1 sm:space-y-2 p-4 sm:p-6 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="p-2.5 sm:p-3 bg-indigo-50 rounded-xl mb-1 sm:mb-2">{stat.icon}</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="py-14 sm:py-20 lg:py-24 bg-slate-50/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-14 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Latest Job Openings</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                Discover your next career move with top-tier companies worldwide. Our AI matches your profile with roles you&apos;ll actually love.
              </p>
            </div>

            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[
                { title: "Senior Product Designer", company: "TechFlow AI", location: "San Francisco", salary: "$120k – $160k", type: "Full Time", typeColor: "bg-green-50 text-green-700" },
                { title: "Frontend Engineer", company: "Nexus Labs", location: "Remote", salary: "$100k – $140k", type: "Remote", typeColor: "bg-blue-50 text-blue-700" },
                { title: "AI/ML Researcher", company: "DeepMind Corp", location: "New York", salary: "$140k – $200k", type: "Full Time", typeColor: "bg-green-50 text-green-700" },
              ].map((job, i) => (
                <div
                  key={i}
                  className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 premium-shadow hover:border-indigo-200 hover:shadow-lg transition-all duration-300 group flex flex-col"
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${job.typeColor}`}>{job.type}</span>
                  </div>

                  {/* Job Info */}
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-2 text-left group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {job.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6">
                      <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {job.company}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {job.location}</span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex justify-between items-center pt-4 sm:pt-5 border-t border-slate-100 mt-auto">
                    <span className="text-sm sm:text-base lg:text-lg font-bold text-slate-900">{job.salary}</span>
                    <button
                      onClick={handleApply}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 bg-slate-900 text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm hover:bg-indigo-600 transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* View All CTA */}
            <div className="mt-10 sm:mt-12 text-center">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline underline-offset-4 transition-all text-sm sm:text-base"
              >
                View All 1,240 Jobs <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <ApplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobTitle={selectedJob.title}
        companyName={selectedJob.company}
      />
    </div>
  );
}

function ChevronRight({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
