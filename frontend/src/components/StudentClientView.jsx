import React, { useState } from 'react';
import StudentHome from './StudentHome';
import MatchConfirmed from './MatchConfirmed';
import LiveChat from './LiveChat';
import SessionCompleted from './SessionCompleted';

export default function StudentClientView({
  user,
  token,
  activeRequest,
  onBroadcast,
  onSendMessage,
  onCompleteSession,
  onSubmitRating,
  onLogout,
  isNightMode
}) {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' | 'match' | 'chat' | 'completed'

  // If session is completed and needs rating
  if (activeRequest && activeRequest.status === 'completed' && activeRequest.rating === null) {
    return (
      <div className="w-full">
        <SessionCompleted
          request={activeRequest}
          currentUserRole="student"
          onSubmitRating={onSubmitRating}
          onDone={() => setCurrentScreen('home')}
          isNightMode={isNightMode}
        />
      </div>
    );
  }

  // If in live chat mode
  if (currentScreen === 'chat' && activeRequest && activeRequest.status !== 'declined') {
    return (
      <div className="w-full">
        <LiveChat
          request={activeRequest}
          currentUser={user}
          onBack={() => setCurrentScreen('home')}
          onSendMessage={onSendMessage}
          onCompleteSession={onCompleteSession}
          isNightMode={isNightMode}
        />
      </div>
    );
  }

  // If match confirmed view
  if (currentScreen === 'match' && activeRequest && (activeRequest.status === 'accepted' || activeRequest.status === 'in_progress')) {
    return (
      <div className="w-full">
        <MatchConfirmed
          request={activeRequest}
          currentUserRole="student"
          onOpenChat={() => setCurrentScreen('chat')}
          onCompleteSession={onCompleteSession}
          isNightMode={isNightMode}
        />
      </div>
    );
  }

  // Default: Student Home Dashboard
  return (
    <div className="w-full">
      <StudentHome
        user={user}
        activeRequest={activeRequest}
        onBroadcast={async (doubtData) => {
          await onBroadcast(doubtData);
          setCurrentScreen('home');
        }}
        onOpenActive={() => {
          if (activeRequest && activeRequest.status === 'accepted') {
            setCurrentScreen('chat');
          }
        }}
        isNightMode={isNightMode}
      />
    </div>
  );
}
