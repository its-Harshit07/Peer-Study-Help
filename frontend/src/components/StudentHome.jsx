import React, { useState } from 'react';
import { Send, MapPin, Check, Clock, ShieldCheck, ChevronRight } from 'lucide-react';

export default function StudentHome({ user, activeRequest, onBroadcast, onOpenActive, isNightMode }) {
  const [selectedCourse, setSelectedCourse] = useState('Programming (C++)');
  const [doubtTitle, setDoubtTitle] = useState('Pointer logic');
  const [doubtDetail, setDoubtDetail] = useState('Stuck on Question 3 pointer logic error');
  const [hostelLocation, setHostelLocation] = useState('Hostel BH 13');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const courses = ['Programming (C++)', 'Data Structures', 'Engineering Math', 'Database Systems'];

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (isBroadcasting) return;
    setIsBroadcasting(true);
    try {
      await onBroadcast({
        course: selectedCourse,
        doubtTitle,
        doubtDetail,
        hostelLocation
      });
    } finally {
      setIsBroadcasting(false);
    }
  };

  const hasActiveSession = activeRequest && activeRequest.status !== 'completed' && activeRequest.status !== 'declined';

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Top Hero Banner */}
      <div className="max-w-3xl space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-terracotta-600 block">
          CAMPUS DOUBT RESOLUTION • HOSTEL BH 13
        </span>

        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight ${
          isNightMode ? 'text-white' : 'text-slate-900'
        }`}>
          Late-night help, from the <span className="italic text-[#22C55E]">room next door.</span>
        </h1>

        <p className={`text-sm sm:text-base leading-relaxed font-sans ${
          isNightMode ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Select your course, describe where you are stuck, and broadcast your question. The nearest peer explainer in Hostel BH 13 will respond in real time.
        </p>

        {/* 3 Metric Pills */}
        <div className={`pt-4 grid grid-cols-3 gap-6 max-w-sm border-t ${
          isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'
        }`}>
          <div>
            <span className={`text-xl font-bold font-serif block ${isNightMode ? 'text-white' : 'text-slate-900'}`}>45s</span>
            <span className={`text-[11px] block ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>avg response</span>
          </div>
          <div>
            <span className="text-xl font-bold font-serif text-[#22C55E] block">+50 XP</span>
            <span className={`text-[11px] block ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>peer reward</span>
          </div>
          <div>
            <span className={`text-xl font-bold font-serif block ${isNightMode ? 'text-white' : 'text-slate-900'}`}>1-to-1</span>
            <span className={`text-[11px] block ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>live chat</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Broadcast Form (Left) & Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Broadcast Form Card */}
        <div className={`lg:col-span-7 rounded-3xl p-7 sm:p-9 border shadow-sm space-y-6 ${
          isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
        }`}>
          <div className={`flex items-center justify-between pb-4 border-b ${
            isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'
          }`}>
            <h2 className={`text-lg font-bold font-serif ${isNightMode ? 'text-white' : 'text-slate-900'}`}>
              Broadcast a Doubt
            </h2>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              HOSTEL BH 13
            </span>
          </div>

          {/* Active Courses */}
          <div>
            <label className={`text-xs font-bold tracking-wider uppercase block mb-2.5 ${
              isNightMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              YOUR ACTIVE COURSES
            </label>
            <div className="flex flex-wrap gap-2">
              {courses.map((course) => {
                const isSelected = selectedCourse === course;
                return (
                  <button
                    key={course}
                    type="button"
                    onClick={() => setSelectedCourse(course)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-[#1B4332] text-white shadow-xs'
                        : isNightMode
                        ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                        : 'bg-[#FAF8F5] text-slate-700 border border-[#EAE4D7] hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{course}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className={`text-xs font-bold block mb-1.5 ${isNightMode ? 'text-slate-300' : 'text-slate-700'}`}>
                What concept or question are you stuck on?
              </label>
              <input
                type="text"
                value={doubtTitle}
                onChange={(e) => setDoubtTitle(e.target.value)}
                placeholder="e.g. Pointer logic, recursion error, memory leak"
                className={`w-full px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl focus:outline-none transition-colors border ${
                  isNightMode
                    ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-[#22C55E]'
                    : 'bg-[#FAF8F5] border-[#EAE4D7] text-slate-900 placeholder-slate-400 focus:border-[#1B4332] focus:bg-white'
                }`}
              />
            </div>

            <div>
              <label className={`text-xs font-bold block mb-1.5 ${isNightMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Explain the problem or paste error context
              </label>
              <textarea
                value={doubtDetail}
                onChange={(e) => setDoubtDetail(e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 text-xs sm:text-sm rounded-xl focus:outline-none resize-none leading-relaxed transition-colors border ${
                  isNightMode
                    ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-[#22C55E]'
                    : 'bg-[#FAF8F5] border-[#EAE4D7] text-slate-800 placeholder-slate-400 focus:border-[#1B4332] focus:bg-white'
                }`}
                placeholder="Explain where you are stuck so nearby peers can review quickly and bring solutions..."
              />
            </div>

            <div className={`flex items-center space-x-2 text-xs pt-1 ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
              <span>Nearby peer explainers in Hostel BH 13 will receive an instant notification</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleBroadcast}
              disabled={isBroadcasting}
              className="w-full sm:flex-1 bg-[#1B4332] hover:bg-[#143527] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              {isBroadcasting ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Broadcasting to peers...</span>
                </span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Broadcast Doubt to Nearby Peers</span>
                </>
              )}
            </button>

            <div className={`flex items-center space-x-2 text-xs font-medium px-4 py-3.5 rounded-2xl border ${
              isNightMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-[#FAF8F5] border-[#EAE4D7] text-slate-600'
            }`}>
              <MapPin className="w-4 h-4 text-terracotta-600" />
              <span>{hostelLocation}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Active Session & Leaderboard */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Session Status Card */}
          {hasActiveSession ? (
            <div className={`rounded-3xl p-6 border-2 shadow-sm space-y-4 ${
              isNightMode ? 'bg-[#111827] border-[#22C55E]' : 'bg-white border-[#1B4332]'
            }`}>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1B4332]/10 text-[#22C55E]">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping"></span>
                  <span>{activeRequest.status === 'pending' ? 'BROADCASTING' : 'MATCH CONFIRMED'}</span>
                </span>
                <span className={`text-xs font-medium ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {activeRequest.distance || '3 min away'}
                </span>
              </div>

              <div>
                <h3 className={`text-base font-bold font-serif ${isNightMode ? 'text-white' : 'text-slate-900'}`}>
                  {activeRequest.doubtTitle}
                </h3>
                <p className={`text-xs mt-0.5 ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>{activeRequest.course}</p>
                <p className={`text-xs mt-2 p-3 rounded-xl border leading-relaxed ${
                  isNightMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-[#FAF8F5] border-[#EAE4D7] text-slate-700'
                }`}>
                  {activeRequest.doubtDetail}
                </p>
              </div>

              {activeRequest.status === 'accepted' && (
                <div className={`p-3 rounded-xl flex items-center space-x-3 border ${
                  isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className="w-9 h-9 rounded-full bg-[#1B4332] text-white flex items-center justify-center font-bold text-xs">
                    {activeRequest.peerAvatar || 'RM'}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isNightMode ? 'text-white' : 'text-slate-900'}`}>
                      Connected with {activeRequest.peerName}
                    </p>
                    <p className={`text-[11px] ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {activeRequest.peerTitle || 'Senior Peer'}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={onOpenActive}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#1B4332] hover:bg-[#143527] transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <span>{activeRequest.status === 'accepted' ? 'Open Live Chat Session' : 'View Broadcast Status'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Explainer Online Preview */
            <div className={`rounded-3xl p-6 border shadow-sm space-y-4 ${
              isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${
                isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'
              }`}>
                <h3 className={`text-base font-bold font-serif ${isNightMode ? 'text-white' : 'text-slate-900'}`}>Nearby Explainer</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#22C55E]">
                  ONLINE NOW
                </span>
              </div>

              <div className={`p-3.5 rounded-2xl border flex items-center space-x-3.5 ${
                isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#EAE4D7]'
              }`}>
                <div className="w-11 h-11 rounded-2xl bg-[#1B4332] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  RM
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-1.5">
                    <h4 className={`text-xs font-bold ${isNightMode ? 'text-white' : 'text-slate-900'}`}>Rahul M.</h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                  </div>
                  <p className={`text-[11px] ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>Senior Peer • C++ & DSA</p>
                  <p className="text-[11px] text-[#22C55E] font-semibold mt-0.5">📍 3 min away (Hostel BH 13)</p>
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Rahul is currently in Hostel BH 13 and accepting questions in C++ and Data Structures.
              </p>
            </div>
          )}

          {/* How it works Card */}
          <div className={`rounded-3xl p-6 border shadow-sm space-y-3 ${
            isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'
            }`}>
              <h3 className={`text-base font-bold font-serif ${isNightMode ? 'text-white' : 'text-slate-900'}`}>How it works</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">THE LOOP</span>
            </div>
            <div className={`space-y-2 text-xs ${isNightMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <p><strong className={isNightMode ? 'text-white' : 'text-slate-900'}>1. Broadcast:</strong> Post your doubt with error context.</p>
              <p><strong className={isNightMode ? 'text-white' : 'text-slate-900'}>2. Match:</strong> Nearby peer gets an audio alert.</p>
              <p><strong className={isNightMode ? 'text-white' : 'text-slate-900'}>3. Chat & Meet:</strong> Solve it with code & BH 13 Common Room meetup.</p>
              <p><strong className={isNightMode ? 'text-white' : 'text-slate-900'}>4. Credit:</strong> Rate 5 stars to boost peer rank & XP.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
