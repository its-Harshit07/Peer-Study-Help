import React, { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle } from 'lucide-react';
import { sound } from '../services/sound';

export default function PeerAlertModal({ request, onAccept, onDecline, isNightMode }) {
  const [timeLeft, setTimeLeft] = useState(45);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    sound.playZomatoAlert();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onDecline(request.id);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, request.id, onDecline]);

  const handleAccept = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      sound.playAcceptedChime();
      await onAccept(request.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onDecline(request.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedTime = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;
  const progressPercent = (timeLeft / 45) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className={`w-full max-w-xl rounded-3xl p-7 sm:p-9 border-2 shadow-2xl relative overflow-hidden space-y-5 animate-in fade-in zoom-in-95 duration-200 ${
        isNightMode ? 'bg-[#111827] border-[#22C55E]' : 'bg-white border-[#1B4332]'
      }`}>
        {/* Top Indicator */}
        <div className={`flex items-center justify-between pb-3 border-b ${
          isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#22C55E] animate-ping"></span>
            <span className="text-xs font-bold text-[#22C55E] tracking-wider uppercase font-sans">
              PEER EXPLAINER ALERT
            </span>
          </div>

          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
            isNightMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-[#FAF8F5] border-[#EAE4D7] text-slate-700'
          }`}>
            <Clock className="w-3.5 h-3.5 mr-1 text-[#22C55E]" />
            {request.distance || '3 min away'}
          </span>
        </div>

        {/* Title */}
        <div>
          <h2 className={`text-2xl font-bold font-serif tracking-tight ${isNightMode ? 'text-white' : 'text-slate-900'}`}>
            Nearby Student Needs Help!
          </h2>
          <p className={`text-xs mt-1 ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>
            A classmate in Hostel BH 13 needs help. Accept within the response window to start a micro-session.
          </p>
        </div>

        {/* Student Profile & Doubt Card */}
        <div className={`rounded-2xl p-5 border space-y-4 ${
          isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#EAE4D7]'
        }`}>
          <div className={`flex items-center space-x-3.5 pb-4 border-b ${
            isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'
          }`}>
            <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shadow-xs">
              {request.studentAvatar || 'AS'}
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isNightMode ? 'text-white' : 'text-slate-900'}`}>{request.studentName || 'Aarav S.'}</h3>
              <p className={`text-xs ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>{request.studentLocation || 'Hostel BH 13'}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
                STUCK ON
              </span>
              <span className={`inline-block mt-1 px-3 py-1 rounded-lg text-xs font-bold border ${
                isNightMode ? 'bg-slate-800 border-slate-700 text-[#22C55E]' : 'bg-white border-[#EAE4D7] text-slate-800'
              }`}>
                {request.course || 'Programming (C++)'}
              </span>
            </div>

            <div className="pt-1">
              <h4 className={`text-sm font-bold ${isNightMode ? 'text-white' : 'text-slate-900'}`}>
                {request.doubtTitle || 'Pointer logic'}
              </h4>
              <p className={`text-xs mt-1 leading-relaxed ${isNightMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {request.doubtDetail || 'Stuck on Question 3 pointer logic error'}
              </p>
            </div>
          </div>
        </div>

        {/* Response Window Timer */}
        <div className={`rounded-2xl p-4 border ${
          isNightMode ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50/80 border-amber-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold tracking-wider uppercase ${isNightMode ? 'text-amber-400' : 'text-amber-900'}`}>
              RESPONSE WINDOW
            </span>
            <span className={`text-sm font-mono font-bold ${isNightMode ? 'text-amber-300' : 'text-amber-900'}`}>
              {formattedTime}
            </span>
          </div>

          <div className={`w-full h-2.5 rounded-full overflow-hidden mb-2 ${
            isNightMode ? 'bg-slate-950 border border-slate-800' : 'bg-amber-200/60'
          }`}>
            <div
              className="bg-amber-500 h-full transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <p className={`text-xs font-medium ${isNightMode ? 'text-amber-300/90' : 'text-amber-900/90'}`}>
            Accept within {timeLeft}s to claim this request
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            type="button"
            onClick={handleDecline}
            disabled={isSubmitting}
            className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold transition-colors border text-center ${
              isNightMode
                ? 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                : 'bg-[#FAF8F5] text-slate-600 hover:text-slate-900 hover:bg-[#EAE4D7] border-[#EAE4D7]'
            }`}
          >
            Decline
          </button>

          <button
            type="button"
            onClick={handleAccept}
            disabled={isSubmitting}
            className="flex-[2] py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-[#1B4332] hover:bg-[#143527] active:scale-[0.99] shadow-sm transition-all text-center zomato-pulsing flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Accepting...' : 'Accept & Help'}</span>
          </button>
        </div>

        <div className="flex items-center justify-center space-x-1.5 text-slate-400 text-xs">
          <MapPin className="w-3.5 h-3.5 text-terracotta-600" />
          <span>Nearby in {request.hostelLocation || 'Hostel BH 13'}</span>
        </div>
      </div>
    </div>
  );
}
