import React, { useState } from 'react';
import { Lock, User, MapPin, ArrowLeft, CheckCircle2, GraduationCap, UserCheck } from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({ initialRole = 'student', onLoginSuccess, onBack, isNightMode }) {
  const [activeRole, setActiveRole] = useState(initialRole);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRoleSwitch = (role) => {
    setActiveRole(role);
    setErrorMsg('');
    setSuccessMsg('');
    setIdentifier('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!identifier.trim() || !password) {
      setErrorMsg('Please enter both ID/Email and password.');
      return;
    }

    setIsLoading(true);

    try {
      if (isRegisterMode) {
        const payload = {
          id: identifier.trim(),
          email: email.trim() || `${identifier.trim()}@campus.edu`,
          name: name.trim() || identifier.trim(),
          password,
          role: activeRole,
          location: location || 'Hostel BH 13',
          title: activeRole === 'peer' ? (title || 'Peer Explainer') : undefined
        };
        const res = await api.register(payload);
        setSuccessMsg('Account registered successfully!');
        localStorage.setItem('token', res.token);
        localStorage.setItem('userRole', res.user.role);
        setTimeout(() => onLoginSuccess(res.user, res.token), 300);
      } else {
        const res = await api.login(identifier.trim(), password, activeRole);
        localStorage.setItem('token', res.token);
        localStorage.setItem('userRole', res.user.role);
        onLoginSuccess(res.user, res.token);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const isStudent = activeRole === 'student';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 select-none relative transition-colors duration-200 ${
      isNightMode ? 'bg-[#0B0F17] text-slate-100' : 'bg-[#FAF8F5] text-slate-800'
    }`}>
      <div className="w-full max-w-lg z-10">
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          className={`mb-5 inline-flex items-center space-x-2 text-xs font-semibold transition-colors ${
            isNightMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </button>

        {/* Card */}
        <div className={`rounded-3xl p-8 sm:p-10 border shadow-sm space-y-6 ${
          isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between pb-4 border-b ${
            isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'
          }`}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta-600 block mb-1">
                HOSTEL BH 13
              </span>
              <h2 className={`text-2xl font-bold font-serif tracking-tight ${
                isNightMode ? 'text-white' : 'text-slate-900'
              }`}>
                {isRegisterMode ? 'Create an Account' : 'Sign in'}
              </h2>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              CAMPUS LOGIN
            </span>
          </div>

          {/* Role Selector */}
          <div>
            <label className={`text-xs font-bold uppercase tracking-wider block mb-2.5 ${
              isNightMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              I AM HERE TO...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleSwitch('student')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                  isStudent
                    ? 'bg-[#1B4332] text-white shadow-sm'
                    : isNightMode
                    ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                    : 'bg-[#FAF8F5] text-slate-700 border border-[#EAE4D7] hover:border-slate-400'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Get Help</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSwitch('peer')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                  !isStudent
                    ? 'bg-[#1B4332] text-white shadow-sm'
                    : isNightMode
                    ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                    : 'bg-[#FAF8F5] text-slate-700 border border-[#EAE4D7] hover:border-slate-400'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Explain & Earn XP</span>
              </button>
            </div>
          </div>

          {/* Error / Success Alerts */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              <span className="font-bold">Error: </span>
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`text-xs font-bold block mb-1.5 ${
                isNightMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {isStudent ? 'Your Student ID or Email' : 'Peer Explainer ID or Email'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={isStudent ? 'e.g. student1 or aarav@campus.edu' : 'e.g. tutor1 or rahul@campus.edu'}
                  className={`w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl focus:outline-none transition-colors font-medium border ${
                    isNightMode
                      ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-[#22C55E]'
                      : 'bg-[#FAF8F5] border-[#EAE4D7] text-slate-900 placeholder-slate-400 focus:border-[#1B4332] focus:bg-white'
                  }`}
                  required
                  autoFocus
                />
              </div>
            </div>

            {isRegisterMode && (
              <>
                <div>
                  <label className={`text-xs font-bold block mb-1.5 ${isNightMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className={`w-full px-4 py-3 text-xs sm:text-sm rounded-xl focus:outline-none transition-colors border ${
                      isNightMode
                        ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-[#22C55E]'
                        : 'bg-[#FAF8F5] border-[#EAE4D7] text-slate-900 placeholder-slate-400 focus:border-[#1B4332] focus:bg-white'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`text-xs font-bold block mb-1.5 ${isNightMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Hostel Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Hostel BH 13"
                      className={`w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl focus:outline-none transition-colors border ${
                        isNightMode
                          ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-[#22C55E]'
                          : 'bg-[#FAF8F5] border-[#EAE4D7] text-slate-900 placeholder-slate-400 focus:border-[#1B4332] focus:bg-white'
                      }`}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className={`text-xs font-bold block mb-1.5 ${isNightMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl focus:outline-none transition-colors font-medium border ${
                    isNightMode
                      ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-[#22C55E]'
                      : 'bg-[#FAF8F5] border-[#EAE4D7] text-slate-900 placeholder-slate-400 focus:border-[#1B4332] focus:bg-white'
                  }`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#1B4332] hover:bg-[#143527] shadow-sm transition-all mt-4 flex items-center justify-center space-x-2"
            >
              {isLoading
                ? 'Signing in...'
                : isRegisterMode
                ? `Register as ${isStudent ? 'Student' : 'Peer Explainer'}`
                : `Sign in & continue \u2192`}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className={`text-center pt-2 border-t ${isNightMode ? 'border-slate-800' : 'border-[#EAE4D7]'}`}>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`text-xs font-medium transition-colors ${
                isNightMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Register here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
