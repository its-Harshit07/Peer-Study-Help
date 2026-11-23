import React from 'react';
import { Clock, MapPin, MessageSquare, Check, ShieldCheck } from 'lucide-react';

export default function MatchConfirmed({ request, onOpenChat, onCompleteSession, currentUserRole, isNightMode }) {
  const isPeer = currentUserRole === 'peer';
  const partnerName = isPeer ? request.studentName : request.peerName;
  const partnerAvatar = isPeer ? request.studentAvatar : request.peerAvatar;
  const partnerTitle = isPeer ? (request.studentLocation || 'Student') : (request.peerTitle || 'Senior Peer • C++');

  return (
    <div className={`w-full max-w-3xl mx-auto rounded-3xl p-7 sm:p-10 border shadow-sm space-y-6 ${
      isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
    }`}>
      {/* Top Banner */}
      <div className={`rounded-2xl p-5 flex items-center space-x-4 border ${
        isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-emerald-50 border-emerald-200'
      }`}>
        <div className="w-12 h-12 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
          <Check className="w-6 h-6 stroke-[3]" />
        </div>
        <div>
          <h2 className={`text-xl font-bold font-serif ${isNightMode ? 'text-white' : 'text-slate-900'}`}>Match Confirmed!</h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${isNightMode ? 'text-emerald-400' : 'text-emerald-800'}`}>
            Your peer explainer accepted your doubt and is ready to help.
          </p>
        </div>
      </div>

      {/* Connected Partner Card */}
      <div className={`rounded-2xl p-5 border flex items-center space-x-4 ${
        isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#EAE4D7]'
      }`}>
        <div className="w-14 h-14 rounded-2xl bg-[#1B4332] text-white font-bold text-lg flex items-center justify-center shadow-xs">
          {partnerAvatar || 'RM'}
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
            {isPeer ? 'STUDENT' : 'CONNECTED EXPLAINER'}
          </span>
          <div className="flex items-center space-x-2">
            <h3 className={`text-lg font-bold leading-snug ${isNightMode ? 'text-white' : 'text-slate-900'}`}>{partnerName}</h3>
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
          </div>
          <p className={`text-xs mt-0.5 ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>{partnerTitle}</p>
        </div>
        <div className="text-right hidden sm:block">
          <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${
            isNightMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-[#EAE4D7] text-slate-700'
          }`}>
            {request.course}
          </span>
        </div>
      </div>

      {/* Meeting Location & ETA Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`rounded-2xl p-5 border space-y-2 ${
          isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#EAE4D7]'
        }`}>
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
            PHYSICAL MEETING SPOT
          </span>
          <h4 className={`text-base font-bold flex items-center space-x-1.5 ${isNightMode ? 'text-white' : 'text-slate-900'}`}>
            <MapPin className="w-4 h-4 text-terracotta-600" />
            <span>{request.meetingLocation || 'BH 13 Common Room'}</span>
          </h4>
          <p className={`text-xs leading-relaxed ${isNightMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {request.meetingNotes || 'Go to the BH 13 common room by the whiteboard.'}
          </p>
        </div>

        <div className={`rounded-2xl p-5 border space-y-2 ${
          isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#EAE4D7]'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
              ESTIMATED WINDOW
            </span>
            <Clock className="w-4 h-4 text-[#22C55E]" />
          </div>
          <h4 className={`text-base font-bold ${isNightMode ? 'text-white' : 'text-slate-900'}`}>
            {request.estimatedWindow || '10:00'} <span className="text-xs font-normal text-slate-400">minutes</span>
          </h4>
          <p className={`text-xs ${isNightMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Walk time: <strong>{request.walkTime || '3 min'}</strong> (Hostel BH 13)
          </p>
        </div>
      </div>

      {/* Session Timeline Checklist */}
      <div className={`rounded-2xl p-5 border space-y-3 ${
        isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#EAE4D7]'
      }`}>
        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
          SESSION TIMELINE
        </span>

        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <div>
            <p className={`text-xs font-bold ${isNightMode ? 'text-white' : 'text-slate-900'}`}>Helper is on the way</p>
            <p className={`text-[11px] ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>Expected in the common room in about 3 minutes</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          </div>
          <div>
            <p className={`text-xs font-bold ${isNightMode ? 'text-white' : 'text-slate-900'}`}>Chat active</p>
            <p className={`text-[11px] ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>You can coordinate code and questions in live chat right now</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onOpenChat}
          className="w-full sm:flex-1 bg-[#1B4332] hover:bg-[#143527] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-xs transition-all flex items-center justify-center space-x-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Open Live Chat Session</span>
        </button>

        <button
          type="button"
          onClick={onCompleteSession}
          className={`w-full sm:w-auto py-4 px-6 rounded-2xl text-xs font-bold transition-colors border ${
            isNightMode
              ? 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              : 'bg-[#FAF8F5] text-slate-600 hover:text-slate-900 hover:bg-[#EAE4D7] border-[#EAE4D7]'
          }`}
        >
          Mark Completed
        </button>
      </div>
    </div>
  );
}
