import React, { useState } from 'react';
import { Star, Check, Sparkles, Award } from 'lucide-react';
import { sound } from '../services/sound';

export default function SessionCompleted({ request, onDone, onSubmitRating, isNightMode }) {
  const [stars, setStars] = useState(5);
  const [selectedTags, setSelectedTags] = useState(['Patient Explainer', 'Quick Solution', 'Very Helpful']);
  const [thanksNote, setThanksNote] = useState('Thanks for clearing my pointer doubts!');
  const [hasRated, setHasRated] = useState(false);
  const [peerStats, setPeerStats] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = ['Patient Explainer', 'Quick Solution', 'Very Helpful', 'Great Code Example', 'Friendly Peer', 'Patient with Beginners'];

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleRateSubmit = async () => {
    if (hasRated || isSubmitting) return;
    setIsSubmitting(true);
    try {
      sound.playRankUpFanfare();
      const res = await onSubmitRating({
        stars,
        feedbackTags: selectedTags,
        thanksNote
      });
      setHasRated(true);
      if (res && res.peerStats) {
        setPeerStats(res.peerStats);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const tutorName = request.peerName || 'Rahul';

  return (
    <div className={`w-full max-w-2xl mx-auto rounded-3xl p-7 sm:p-10 border shadow-sm space-y-6 ${
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
          <h2 className={`text-xl font-bold font-serif ${isNightMode ? 'text-white' : 'text-slate-900'}`}>Session Completed!</h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${isNightMode ? 'text-emerald-400' : 'text-emerald-800'}`}>
            Your late-night micro-help session has wrapped up.
          </p>
        </div>
      </div>

      {/* Rate Your Session Card */}
      <div className={`rounded-2xl p-6 border text-center space-y-4 ${
        isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#EAE4D7]'
      }`}>
        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
          RATE YOUR SESSION
        </span>

        <h3 className={`text-lg sm:text-xl font-bold font-serif ${isNightMode ? 'text-white' : 'text-slate-900'}`}>
          How clear was {tutorName}'s explanation?
        </h3>

        {/* Interactive Star Rating */}
        <div className="flex items-center justify-center space-x-2 py-2">
          {[1, 2, 3, 4, 5].map((starIndex) => (
            <button
              key={starIndex}
              type="button"
              onClick={() => {
                setStars(starIndex);
                if (!hasRated) handleRateSubmit();
              }}
              className="p-1 transform hover:scale-125 active:scale-95 transition-transform"
            >
              <Star
                className={`w-9 h-9 ${
                  starIndex <= stars
                    ? 'text-amber-500 fill-amber-500 drop-shadow-xs'
                    : 'text-slate-400'
                }`}
              />
            </button>
          ))}
        </div>

        <p className={`text-xs ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {hasRated ? '✓ Rating recorded! Thank you for supporting the hostel peer network.' : 'Tap a star to submit your review'}
        </p>
      </div>

      {/* Quick Feedback Pills */}
      <div>
        <span className={`text-xs font-bold tracking-wider uppercase block mb-3 ${
          isNightMode ? 'text-slate-300' : 'text-slate-700'
        }`}>
          QUICK FEEDBACK TAGS
        </span>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : isNightMode
                    ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                    : 'bg-[#FAF8F5] text-slate-700 border border-[#EAE4D7] hover:border-slate-400'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Thanks Textarea */}
      <div>
        <span className={`text-xs font-bold tracking-wider uppercase block mb-2 ${
          isNightMode ? 'text-slate-300' : 'text-slate-700'
        }`}>
          OPTIONAL THANK YOU NOTE
        </span>
        <div className={`rounded-2xl p-4 border ${
          isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#EAE4D7]'
        }`}>
          <textarea
            value={thanksNote}
            onChange={(e) => setThanksNote(e.target.value)}
            rows={3}
            className={`w-full text-xs sm:text-sm resize-none bg-transparent focus:outline-none leading-relaxed ${
              isNightMode ? 'text-slate-200 placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'
            }`}
            placeholder="Leave a quick note for your peer explainer..."
          />
        </div>
      </div>

      {/* Community Contribution & Rank Increase Card */}
      <div className={`rounded-2xl p-5 flex items-start space-x-4 border ${
        isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-emerald-50/80 border-emerald-200'
      }`}>
        <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl flex-shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5 text-amber-600 animate-spin" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-bold ${isNightMode ? 'text-white' : 'text-slate-900'}`}>
              Community Contribution Recorded
            </span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className={`text-xs mt-1 leading-relaxed ${isNightMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Happy student, happy peer! {tutorName}'s peer rank updated: <strong className="text-[#22C55E]">+50 XP</strong>, currently <strong className={isNightMode ? 'text-white' : 'text-slate-900'}>Rank #{peerStats?.rank || 2}</strong> on the Hostel BH 13 Leaderboard!
          </p>
        </div>
      </div>

      {/* Done Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onDone}
          className="w-full bg-[#1B4332] hover:bg-[#143527] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-xs transition-all text-center"
        >
          Done / Return to Dashboard
        </button>
      </div>
    </div>
  );
}
