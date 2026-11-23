import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Sparkles, LogOut, GraduationCap, UserCheck, RefreshCw, Moon, Sun } from 'lucide-react';
import { api } from './services/api';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import StudentClientView from './components/StudentClientView';
import PeerClientView from './components/PeerClientView';

// Socket connection to backend
const socket = io('/', {
  transports: ['websocket', 'polling']
});

export default function App() {
  // Navigation / Auth states
  // null = Landing page; 'student' | 'peer' = Login page for that role
  const [loginRole, setLoginRole] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [currentToken, setCurrentToken] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Night Mode state with localStorage persistence
  const [isNightMode, setIsNightMode] = useState(() => {
    return localStorage.getItem('peer_theme') === 'dark';
  });

  const toggleNightMode = () => {
    setIsNightMode(prev => {
      const next = !prev;
      localStorage.setItem('peer_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // Active help request synchronized across clients
  const [activeRequest, setActiveRequest] = useState(null);
  const [bannerAlert, setBannerAlert] = useState(null);

  // Check existing session on load
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      api.getMe(savedToken)
        .then(user => {
          setCurrentUser(user);
          setCurrentToken(savedToken);
          return api.getActiveRequest(savedToken);
        })
        .then(req => {
          if (req) setActiveRequest(req);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
        });
    }
  }, []);

  // Socket.io event listeners
  useEffect(() => {
    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));

    // Incoming alert
    socket.on('peer_explainer_alert', ({ request }) => {
      setActiveRequest(request);
      showTemporaryBanner(`🔔 New Doubt Alert: ${request.doubtTitle} from ${request.studentName}!`);
    });

    // Match accepted
    socket.on('match_confirmed', ({ request }) => {
      setActiveRequest(request);
      showTemporaryBanner(`✓ Match Confirmed! ${request.peerName} accepted ${request.studentName}'s doubt.`);
    });

    // Request declined
    socket.on('request_declined', () => {
      setActiveRequest(prev => prev ? { ...prev, status: 'declined' } : null);
      showTemporaryBanner(`✕ Request was declined.`);
    });

    // Live chat message
    socket.on('chat_message', ({ message }) => {
      setActiveRequest(prev => {
        if (!prev) return prev;
        const exists = prev.messages && prev.messages.some(m => m.id === message.id);
        if (exists) return prev;
        return {
          ...prev,
          messages: [...(prev.messages || []), message]
        };
      });
    });

    // Session completed
    socket.on('session_completed', ({ request }) => {
      setActiveRequest(request);
      showTemporaryBanner(`🎓 Session Completed! Rating requested.`);
    });

    // Peer ranked up celebration
    socket.on('peer_ranked_up', ({ message }) => {
      showTemporaryBanner(`🌟 ${message}`);
      if (currentToken && currentUser?.role === 'peer') {
        api.getMe(currentToken).then(setCurrentUser).catch(console.error);
      }
    });

    // Session updated
    socket.on('session_updated', ({ request }) => {
      setActiveRequest(request);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('peer_explainer_alert');
      socket.off('match_confirmed');
      socket.off('request_declined');
      socket.off('chat_message');
      socket.off('session_completed');
      socket.off('peer_ranked_up');
      socket.off('session_updated');
    };
  }, [currentToken, currentUser]);

  const showTemporaryBanner = (msg) => {
    setBannerAlert(msg);
    setTimeout(() => {
      setBannerAlert(prev => prev === msg ? null : prev);
    }, 5000);
  };

  // Actions
  const handleBroadcastDoubt = async (doubtData) => {
    const req = await api.broadcastDoubt(doubtData, currentToken);
    setActiveRequest(req);
    showTemporaryBanner('📡 Doubt broadcasted to nearby peers in Hostel BH 13!');
  };

  const handleAcceptRequest = async (id) => {
    const req = await api.acceptRequest(id, currentToken);
    setActiveRequest(req);
  };

  const handleDeclineRequest = async (id) => {
    await api.declineRequest(id, currentToken);
  };

  const handleSendMessage = async (msgData) => {
    if (!activeRequest) return;
    await api.sendMessage(activeRequest.id, msgData, currentToken);
  };

  const handleCompleteSession = async () => {
    if (!activeRequest) return;
    const req = await api.completeSession(activeRequest.id, currentToken);
    setActiveRequest(req);
  };

  const handleSubmitRating = async (ratingData) => {
    if (!activeRequest) return;
    const res = await api.submitRating(activeRequest.id, ratingData, currentToken);
    setActiveRequest(res.request);
    return res;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setCurrentUser(null);
    setCurrentToken(null);
    setLoginRole(null);
  };

  // Reset scenario helper to re-test
  const handleResetScenario = async () => {
    try {
      if (currentToken && currentUser?.role === 'student') {
        const newDoubt = {
          course: 'Programming (C++)',
          doubtTitle: 'Pointer logic',
          doubtDetail: 'Stuck on Question 3 pointer logic error',
          hostelLocation: 'Hostel BH 13'
        };
        const req = await api.broadcastDoubt(newDoubt, currentToken);
        setActiveRequest(req);
        showTemporaryBanner('🔄 Demo scenario reset! Alert ready.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 1. IF NOT LOGGED IN
  if (!currentUser) {
    if (loginRole) {
      return (
        <AuthModal
          initialRole={loginRole}
          onLoginSuccess={(user, token) => {
            setCurrentUser(user);
            setCurrentToken(token);
            setLoginRole(null);
            api.getActiveRequest(token).then(r => {
              if (r) setActiveRequest(r);
            });
          }}
          onBack={() => setLoginRole(null)}
          isNightMode={isNightMode}
        />
      );
    }

    return (
      <LandingPage
        onSelectRole={(role) => setLoginRole(role)}
        isNightMode={isNightMode}
        onToggleNightMode={toggleNightMode}
      />
    );
  }

  // 2. IF LOGGED IN
  const isStudent = currentUser.role === 'student';

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col font-sans select-none ${
      isNightMode ? 'bg-[#0B0F17] text-slate-100' : 'bg-[#FAF8F5] text-slate-800'
    }`}>
      {/* Top Application Desktop & Mobile Navbar */}
      <header className={`px-4 sm:px-8 py-4 sticky top-0 z-50 border-b shadow-2xs transition-colors ${
        isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4332] flex items-center justify-center text-white font-serif font-bold text-lg shadow-xs">
              PE
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`font-bold text-base tracking-tight font-serif ${
                  isNightMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Campus Peer Explainer
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isStudent
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-emerald-50 text-[#1B4332] border border-emerald-200'
                }`}>
                  {isStudent ? 'Student Account' : 'Peer Explainer'}
                </span>
              </div>
              <p className={`text-xs font-sans ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Logged in as <strong className={isNightMode ? 'text-white' : 'text-slate-800'}>{currentUser.name}</strong> • {currentUser.location || 'Hostel BH 13'}
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Night Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleNightMode}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors border ${
                isNightMode
                  ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
                  : 'bg-[#FAF8F5] text-slate-600 border-[#EAE4D7] hover:bg-[#EAE4D7]'
              }`}
              title="Toggle Night Mode"
            >
              {isNightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-600" />}
              <span className="hidden md:inline">{isNightMode ? 'Light' : 'Night'}</span>
            </button>

            {/* Live Socket Status */}
            <div className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs border ${
              isNightMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-[#FAF8F5] border-[#EAE4D7] text-slate-600'
            }`}>
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
              <span className="font-medium">{socketConnected ? 'Hostel BH 13 Online' : 'Connecting...'}</span>
            </div>

            {/* Quick Reset if Student */}
            {isStudent && (
              <button
                onClick={handleResetScenario}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors border ${
                  isNightMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-[#FAF8F5] hover:bg-[#EAE4D7] text-slate-700 border-[#EAE4D7]'
                }`}
                title="Reset doubt alert"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#22C55E]" />
                <span className="hidden md:inline">Reset Scenario</span>
              </button>
            )}

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors border ${
                isNightMode
                  ? 'bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border-slate-700'
                  : 'bg-[#FAF8F5] hover:bg-rose-50 text-slate-600 hover:text-rose-600 border-[#EAE4D7] hover:border-rose-200'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Real-time Notification Banner */}
      {bannerAlert && (
        <div className="bg-[#1B4332] text-white text-xs font-bold py-2.5 px-6 text-center shadow-sm flex items-center justify-center space-x-2 animate-bounce z-40">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{bannerAlert}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-start">
        {isStudent ? (
          <StudentClientView
            user={currentUser}
            token={currentToken}
            activeRequest={activeRequest}
            onBroadcast={handleBroadcastDoubt}
            onSendMessage={handleSendMessage}
            onCompleteSession={handleCompleteSession}
            onSubmitRating={handleSubmitRating}
            onLogout={handleLogout}
            isNightMode={isNightMode}
          />
        ) : (
          <PeerClientView
            user={currentUser}
            token={currentToken}
            activeRequest={activeRequest}
            onAccept={handleAcceptRequest}
            onDecline={handleDeclineRequest}
            onSendMessage={handleSendMessage}
            onCompleteSession={handleCompleteSession}
            onLogout={handleLogout}
            isNightMode={isNightMode}
          />
        )}
      </main>

      {/* Clean Simple Footer without developer/architecture text */}
      <footer className={`py-4 px-6 text-center text-xs border-t transition-colors ${
        isNightMode ? 'bg-[#111827] border-slate-800 text-slate-400' : 'bg-white border-[#EAE4D7] text-slate-500'
      }`}>
        <p>
          © 2026 Campus Peer Explainer • Hostel BH 13
        </p>
      </footer>
    </div>
  );
}
