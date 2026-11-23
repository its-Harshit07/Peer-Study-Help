import React, { useState } from 'react';
import PeerDashboard from './PeerDashboard';
import PeerAlertModal from './PeerAlertModal';
import LiveChat from './LiveChat';
import MatchConfirmed from './MatchConfirmed';

export default function PeerClientView({
  user,
  token,
  activeRequest,
  onAccept,
  onDecline,
  onSendMessage,
  onCompleteSession,
  onLogout,
  isNightMode
}) {
  const [currentScreen, setCurrentScreen] = useState('auto'); // 'auto' | 'dashboard' | 'chat'

  // If in live chat mode
  if (activeRequest && (activeRequest.status === 'accepted' || activeRequest.status === 'in_progress') && currentScreen !== 'dashboard') {
    return (
      <div className="w-full">
        <LiveChat
          request={activeRequest}
          currentUser={user}
          onBack={() => setCurrentScreen('dashboard')}
          onSendMessage={onSendMessage}
          onCompleteSession={onCompleteSession}
          isNightMode={isNightMode}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Floating Alert Modal if pending doubt */}
      {activeRequest && activeRequest.status === 'pending' && currentScreen !== 'dashboard' && (
        <PeerAlertModal
          request={activeRequest}
          onAccept={async (id) => {
            await onAccept(id);
            setCurrentScreen('chat');
          }}
          onDecline={async (id) => {
            await onDecline(id);
            setCurrentScreen('dashboard');
          }}
          isNightMode={isNightMode}
        />
      )}

      {/* Main Full-Screen Peer Dashboard */}
      <PeerDashboard
        user={user}
        activeRequest={activeRequest}
        onOpenAlert={() => setCurrentScreen('auto')}
        onOpenActive={() => setCurrentScreen('chat')}
        onAccept={async (id) => {
          await onAccept(id);
          setCurrentScreen('chat');
        }}
        onDecline={async (id) => {
          await onDecline(id);
        }}
        onLogout={onLogout}
        isNightMode={isNightMode}
      />
    </div>
  );
}
