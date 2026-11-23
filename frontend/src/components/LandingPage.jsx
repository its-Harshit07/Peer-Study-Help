import React from 'react';
import { ArrowRight, Clock, Zap, MessageSquare, Award, GraduationCap, UserCheck, Moon, Sun } from 'lucide-react';

export default function LandingPage({ onSelectRole, isNightMode, onToggleNightMode }) {
  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col justify-between selection:bg-[#1B4332] selection:text-white ${
      isNightMode ? 'bg-[#0B0F17] text-slate-100' : 'bg-[#FAF8F5] text-slate-800'
    }`}>
      {/* Top Simple Brand Bar */}
      <header className={`px-6 py-5 max-w-6xl w-full mx-auto flex items-center justify-between border-b ${
        isNightMode ? 'border-slate-800 bg-[#0B0F17]' : 'border-[#EAE4D7]/80 bg-[#FAF8F5]'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm">
            PE
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight block font-serif">
              Campus Peer Explainer
            </span>
            <span className={`text-[11px] font-sans ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Hostel BH 13
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Night Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleNightMode}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors border ${
              isNightMode
                ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
                : 'bg-white text-slate-600 border-[#EAE4D7] hover:bg-slate-100'
            }`}
            title="Toggle Night Mode"
          >
            {isNightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-600" />}
            <span className="hidden sm:inline">{isNightMode ? 'Light Mode' : 'Night Mode'}</span>
          </button>

          <div className={`flex items-center space-x-2 text-xs px-3.5 py-1.5 rounded-full font-medium border ${
            isNightMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-[#EAE4D7] text-slate-600 shadow-2xs'
          }`}>
            <span className="w-2 h-2 rounded-full bg-[#1B4332] animate-pulse"></span>
            <span>Hostel BH 13 Active</span>
          </div>
        </div>
      </header>

      {/* Main Hero & Content Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 sm:py-14 space-y-12">
        {/* Hero Copy */}
        <div className="max-w-3xl space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-terracotta-600 block">
            CAMPUS DOUBT RESOLUTION • HOSTEL BH 13
          </span>

          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-[1.15] tracking-tight ${
            isNightMode ? 'text-white' : 'text-slate-900'
          }`}>
            Late-night help, from the <br className="hidden sm:inline" />
            <span className="italic text-[#22C55E]">room next door.</span>
          </h1>

          <p className={`text-base sm:text-lg leading-relaxed font-sans pt-1 ${
            isNightMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Stuck on a pointer bug at 1 a.m.? Broadcast your doubt to classmates in Hostel BH 13 and get a fast, one-to-one explanation — with live chat, formatted code, and credit for the peers who help.
          </p>

          {/* 3 Metrics Strip */}
          <div className={`pt-6 grid grid-cols-3 gap-6 max-w-md border-t ${
            isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'
          }`}>
            <div>
              <span className={`text-2xl font-bold font-serif block ${isNightMode ? 'text-white' : 'text-slate-900'}`}>45s</span>
              <span className={`text-xs block mt-0.5 ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>avg response</span>
            </div>
            <div>
              <span className="text-2xl font-bold font-serif text-[#22C55E] block">+50 XP</span>
              <span className={`text-xs block mt-0.5 ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>per solved doubt</span>
            </div>
            <div>
              <span className={`text-2xl font-bold font-serif block ${isNightMode ? 'text-white' : 'text-slate-900'}`}>1-to-1</span>
              <span className={`text-xs block mt-0.5 ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>chat per doubt</span>
            </div>
          </div>
        </div>

        {/* 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Portal Card */}
          <div className={`lg:col-span-7 rounded-3xl p-7 sm:p-9 border shadow-sm space-y-6 ${
            isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
          }`}>
            <div className={`flex items-center justify-between pb-4 border-b ${
              isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'
            }`}>
              <h2 className={`text-xl font-bold font-serif ${isNightMode ? 'text-white' : 'text-slate-900'}`}>
                Sign in to Platform
              </h2>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                HOSTEL BH 13
              </span>
            </div>

            <p className={`text-xs leading-relaxed ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Select your role to get started. Students can broadcast questions; peer tutors receive instant notifications to explain and earn XP.
            </p>

            {/* Role Selection Buttons */}
            <div className="space-y-4 pt-2">
              <label className={`text-xs font-bold uppercase tracking-wider block ${
                isNightMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                I AM HERE TO...
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Student Action */}
                <button
                  type="button"
                  onClick={() => onSelectRole('student')}
                  className={`p-5 rounded-2xl text-left border-2 transition-all group shadow-sm flex flex-col justify-between space-y-4 ${
                    isNightMode
                      ? 'bg-slate-900 border-[#22C55E]/60 hover:bg-slate-800'
                      : 'bg-white border-[#1B4332] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center font-bold">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#22C55E] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${isNightMode ? 'text-white' : 'text-slate-900'}`}>Get Help (Student)</h3>
                    <p className={`text-xs mt-1 ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>Ask doubts in C++, DSA, and Math to nearby peers.</p>
                  </div>
                  <span className="inline-block text-xs font-bold text-[#22C55E]">
                    Student Sign In &rarr;
                  </span>
                </button>

                {/* Peer Tutor Action */}
                <button
                  type="button"
                  onClick={() => onSelectRole('peer')}
                  className={`p-5 rounded-2xl text-left border-2 transition-all group shadow-sm flex flex-col justify-between space-y-4 ${
                    isNightMode
                      ? 'bg-slate-900 border-slate-700 hover:border-[#22C55E] hover:bg-slate-800'
                      : 'bg-[#FAF8F5] border-[#EAE4D7] hover:border-[#1B4332] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#22C55E] transition-all" />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${isNightMode ? 'text-white' : 'text-slate-900'}`}>Explain & Earn XP</h3>
                    <p className={`text-xs mt-1 ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>Receive alerts, explain concepts, and rank up.</p>
                  </div>
                  <span className={`inline-block text-xs font-bold transition-colors ${
                    isNightMode ? 'text-slate-300 group-hover:text-[#22C55E]' : 'text-slate-700 group-hover:text-[#1B4332]'
                  }`}>
                    Peer Tutor Sign In &rarr;
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Leaderboard & How It Works */}
          <div className="lg:col-span-5 space-y-6">
            {/* Leaderboard Card */}
            <div className={`rounded-3xl p-6 border shadow-sm space-y-4 ${
              isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${
                isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'
              }`}>
                <h3 className={`text-base font-bold font-serif ${isNightMode ? 'text-white' : 'text-slate-900'}`}>Leaderboard</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  BH 13 • XP
                </span>
              </div>

              {/* Top Explainer Profile */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#EAE4D7]'
              }`}>
                <div className="flex items-center space-x-3">
                  <span className="w-5 text-center text-xs font-bold text-amber-500">#1</span>
                  <div className="w-9 h-9 rounded-xl bg-[#1B4332] text-white font-bold text-xs flex items-center justify-center">
                    RM
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isNightMode ? 'text-white' : 'text-slate-900'}`}>Rahul M.</h4>
                    <p className={`text-[11px] ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>Senior Peer • C++</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#22C55E]">1300 XP</span>
                  <p className="text-[10px] text-slate-400">28 solved</p>
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Top explainers in Hostel BH 13 receive priority mentorship badges and verified tutoring credits.
              </p>
            </div>

            {/* How it works Card */}
            <div className={`rounded-3xl p-6 border shadow-sm space-y-4 ${
              isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${
                isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'
              }`}>
                <h3 className={`text-base font-bold font-serif ${isNightMode ? 'text-white' : 'text-slate-900'}`}>How it works</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  THE LOOP
                </span>
              </div>

              <div className={`space-y-3 text-xs ${isNightMode ? 'text-slate-300' : 'text-slate-600'}`}>
                <p>
                  <strong className={isNightMode ? 'text-white' : 'text-slate-900'}>1. Broadcast.</strong> A student posts a doubt with description and course.
                </p>
                <p>
                  <strong className={isNightMode ? 'text-white' : 'text-slate-900'}>2. Match.</strong> Nearest peer explainer in Hostel BH 13 receives an instant audio alert.
                </p>
                <p>
                  <strong className={isNightMode ? 'text-white' : 'text-slate-900'}>3. Chat & Meet.</strong> Live 1-on-1 session with formatted code and common room spot.
                </p>
                <p>
                  <strong className={isNightMode ? 'text-white' : 'text-slate-900'}>4. Credit.</strong> Happy student rates 5 stars, peer tutor earns +50 XP and ranks up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Simple Footer */}
      <footer className={`py-6 px-6 text-center text-xs border-t max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-sans ${
        isNightMode ? 'border-slate-800 text-slate-400 bg-[#0B0F17]' : 'border-[#EAE4D7] text-slate-500 bg-[#FAF8F5]'
      }`}>
        <div>
          <span>© 2026 Campus Peer Explainer • Hostel BH 13</span>
        </div>
        <div>
          <span>Late-Night Study Network</span>
        </div>
      </footer>
    </div>
  );
}
