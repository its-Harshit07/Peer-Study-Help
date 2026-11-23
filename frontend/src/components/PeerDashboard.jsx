import React, { useState, useEffect } from 'react';
import { Award, Zap, Star, CheckCircle, Clock, MapPin, ChevronRight, ShieldCheck, BellRing, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function PeerDashboard({ user, activeRequest, onOpenAlert, onOpenActive, onAccept, onDecline, isNightMode }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    api.getLeaderboard().then(setLeaderboard).catch(console.error);
  }, [user.xp]);

  const hasPendingAlert = activeRequest && activeRequest.status === 'pending';
  const hasActiveSession = activeRequest && (activeRequest.status === 'accepted' || activeRequest.status === 'in_progress');

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Top Banner Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b ${
        isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'
      }`}>
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-terracotta-600 block">
            PEER EXPLAINER PORTAL • HOSTEL BH 13
          </span>
          <h1 className={`text-3xl sm:text-4xl font-serif font-bold leading-tight ${
            isNightMode ? 'text-white' : 'text-slate-900'
          }`}>
            Welcome back, {user.name.split(' ')[0]}. <span className="italic text-[#22C55E]">Ready to explain?</span>
          </h1>
          <p className={`text-xs sm:text-sm font-sans ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {user.title || 'Senior Peer • C++'} • Hostel BH 13 • Avg response: &lt; 45s
          </p>
        </div>

        {/* Online Status Toggle */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all border self-start sm:self-center shadow-xs ${
            isOnline
              ? 'bg-[#1B4332] text-white border-[#1B4332]'
              : isNightMode
              ? 'bg-slate-900 text-slate-300 border-slate-800'
              : 'bg-white text-slate-600 border-[#EAE4D7]'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-300 animate-pulse' : 'bg-slate-400'}`}></span>
          <span>{isOnline ? 'Online & Accepting Doubts' : 'Away (Paused)'}</span>
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-2xl p-5 border shadow-xs space-y-2 ${
          isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
        }`}>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
            Hostel Rank
          </span>
          <span className="text-3xl font-black font-serif text-amber-500 block">
            #{user.rank || 2}
          </span>
          <span className={`text-[11px] ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>BH 13 Leaderboard</span>
        </div>

        <div className={`rounded-2xl p-5 border shadow-xs space-y-2 ${
          isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
        }`}>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
            Total XP
          </span>
          <span className="text-3xl font-black font-serif text-[#22C55E] block">
            {user.xp || 1300} <span className="text-xs font-sans font-semibold text-slate-400">XP</span>
          </span>
          <span className={`text-[11px] ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>+50 XP per 5★ rating</span>
        </div>

        <div className={`rounded-2xl p-5 border shadow-xs space-y-2 ${
          isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
        }`}>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
            Rating
          </span>
          <div className="flex items-center space-x-1.5">
            <span className={`text-3xl font-black font-serif ${isNightMode ? 'text-white' : 'text-slate-900'}`}>{user.rating || 4.9}</span>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <span className={`text-[11px] ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>({user.ratingCount || 28} reviews)</span>
        </div>

        <div className={`rounded-2xl p-5 border shadow-xs space-y-2 ${
          isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
        }`}>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
            Doubts Cleared
          </span>
          <span className={`text-3xl font-black font-serif ${isNightMode ? 'text-white' : 'text-slate-900'}`}>
            {user.solvedCount || 28}
          </span>
          <span className={`text-[11px] ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>Micro-sessions</span>
        </div>
      </div>

      {/* Main Grid: Queue (Left) & Leaderboard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Queue / Doubt Radar */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pending Doubt Alert Card */}
          {hasPendingAlert && (
            <div className={`rounded-3xl p-7 border-2 shadow-md space-y-5 ${
              isNightMode ? 'bg-[#111827] border-[#22C55E]' : 'bg-white border-[#1B4332]'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${
                isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'
              }`}>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping"></span>
                  <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
                    PEER EXPLAINER ALERT
                  </span>
                </div>
                <span className={`px-3 py-1 border text-xs font-bold rounded-full flex items-center ${
                  isNightMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-[#FAF8F5] border-[#EAE4D7] text-slate-700'
                }`}>
                  <Clock className="w-3.5 h-3.5 mr-1 text-[#22C55E]" />
                  {activeRequest.distance || '3 min away'}
                </span>
              </div>

              <div>
                <h3 className={`text-xl font-bold font-serif ${isNightMode ? 'text-white' : 'text-slate-900'}`}>Nearby Student Needs Help!</h3>
                <p className={`text-xs mt-0.5 ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>A classmate in Hostel BH 13 posted this question.</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-3 ${
                isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#EAE4D7]'
              }`}>
                <div className={`flex items-center space-x-3 pb-3 border-b ${
                  isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'
                }`}>
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    {activeRequest.studentAvatar || 'AS'}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isNightMode ? 'text-white' : 'text-slate-900'}`}>{activeRequest.studentName}</h4>
                    <p className={`text-xs ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>{activeRequest.studentLocation || 'Hostel BH 13'}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-md border text-xs font-bold ${
                    isNightMode ? 'bg-slate-800 border-slate-700 text-[#22C55E]' : 'bg-white border-[#EAE4D7] text-[#1B4332]'
                  }`}>
                    {activeRequest.course}
                  </span>
                  <h4 className={`text-sm font-bold pt-1 ${isNightMode ? 'text-white' : 'text-slate-900'}`}>{activeRequest.doubtTitle}</h4>
                  <p className={`text-xs leading-relaxed ${isNightMode ? 'text-slate-300' : 'text-slate-700'}`}>{activeRequest.doubtDetail}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-1">
                <button
                  type="button"
                  onClick={() => onDecline(activeRequest.id)}
                  className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold transition-colors border ${
                    isNightMode
                      ? 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      : 'bg-[#FAF8F5] text-slate-600 hover:text-slate-900 hover:bg-[#EAE4D7] border-[#EAE4D7]'
                  }`}
                >
                  Decline
                </button>
                <button
                  type="button"
                  onClick={() => onAccept(activeRequest.id)}
                  className="flex-[2] py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-[#1B4332] hover:bg-[#143527] transition-all flex items-center justify-center space-x-2 shadow-sm zomato-pulsing"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Accept & Help (Join Chat)</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Session in Progress */}
          {hasActiveSession && (
            <div className={`rounded-3xl p-7 border shadow-sm space-y-4 ${
              isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${
                isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'
              }`}>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1B4332]/10 text-[#22C55E]">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
                  <span>SESSION ACTIVE</span>
                </span>
                <span className={`text-xs font-medium ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>Meeting: BH 13 Common Room</span>
              </div>

              <div>
                <h3 className={`text-lg font-bold font-serif ${isNightMode ? 'text-white' : 'text-slate-900'}`}>{activeRequest.doubtTitle}</h3>
                <p className={`text-xs mt-0.5 ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>Student: {activeRequest.studentName} ({activeRequest.studentLocation})</p>
              </div>

              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#EAE4D7]'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {activeRequest.studentAvatar || 'AS'}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isNightMode ? 'text-white' : 'text-slate-900'}`}>Chat active with {activeRequest.studentName}</p>
                    <p className={`text-[11px] ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>Share code & clear concepts</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenActive}
                  className="px-4 py-2 bg-[#1B4332] hover:bg-[#143527] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Open Live Chat &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Idle Radar Card */}
          {!hasPendingAlert && !hasActiveSession && (
            <div className={`rounded-3xl p-10 border text-center space-y-4 shadow-sm ${
              isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
            }`}>
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto text-[#22C55E] ${
                isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#EAE4D7]'
              }`}>
                <BellRing className="w-7 h-7" />
              </div>

              <div>
                <h3 className={`text-lg font-bold font-serif ${isNightMode ? 'text-white' : 'text-slate-900'}`}>Listening for Nearby Doubts</h3>
                <p className={`text-xs mt-1 max-w-md mx-auto leading-relaxed ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  When a student in Hostel BH 13 posts a doubt in C++ or Data Structures, an audio alert will appear here immediately.
                </p>
              </div>

              <div className={`inline-flex items-center space-x-2 px-3 py-1 border rounded-full text-xs ${
                isNightMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-[#FAF8F5] border-[#EAE4D7] text-slate-600'
              }`}>
                <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                <span>Radar active for Hostel BH 13</span>
              </div>
            </div>
          )}

          {/* Guidelines */}
          <div className={`rounded-3xl p-6 border shadow-sm space-y-3 ${
            isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
          }`}>
            <h3 className={`text-sm font-bold font-serif flex items-center space-x-2 ${
              isNightMode ? 'text-white' : 'text-slate-900'
            }`}>
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Peer Explainer Guidelines</span>
            </h3>
            <ul className={`text-xs space-y-2 list-disc list-inside leading-relaxed ${
              isNightMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <li>Use the built-in <strong>+ Share C++ Code Snippet</strong> tool to illustrate memory and logic clearly.</li>
              <li>Ask the student to re-explain the concept to confirm they understand.</li>
              <li>Suggest meeting at the <strong>BH 13 Common Room</strong> whiteboard if diagrams are needed.</li>
              <li>Each 5-star rating awards you <strong>+50 XP</strong> and moves you up on the hostel leaderboard!</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`rounded-3xl p-6 border shadow-sm space-y-4 ${
            isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'
            }`}>
              <div>
                <h3 className={`text-base font-bold font-serif ${isNightMode ? 'text-white' : 'text-slate-900'}`}>Leaderboard</h3>
                <p className={`text-xs mt-0.5 ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>Hostel BH 13 • Weekly Ranking</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                BH 13 • XP
              </span>
            </div>

            <div className={`divide-y ${isNightMode ? 'divide-slate-800' : 'divide-[#EAE4D7]'}`}>
              {leaderboard.length > 0 ? (
                leaderboard.map((tutor, idx) => {
                  const isCurrentUser = tutor.id === user.id;
                  return (
                    <div
                      key={tutor.id}
                      className={`py-3.5 flex items-center justify-between ${
                        isCurrentUser ? (isNightMode ? 'bg-slate-900 -mx-3 px-3 rounded-xl' : 'bg-[#FAF8F5] -mx-3 px-3 rounded-xl') : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-5 text-center text-xs font-bold ${
                          idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          #{idx + 1}
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-[#1B4332] text-white font-bold text-xs flex items-center justify-center">
                          {tutor.avatar || 'T'}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isNightMode ? 'text-white' : 'text-slate-900'}`}>
                            {tutor.name} {isCurrentUser && <span className="text-[#22C55E] font-semibold">(You)</span>}
                          </p>
                          <p className={`text-[11px] ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>{tutor.title || 'Peer'}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#22C55E]">{tutor.xp} XP</span>
                        <p className="text-[10px] text-slate-400">{tutor.solvedCount || 0} solved</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">Loading leaderboard...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
