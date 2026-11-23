import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Plus, MapPin, Code, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function LiveChat({
  request,
  currentUser,
  onBack,
  onSendMessage,
  onCompleteSession,
  isNightMode
}) {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const isPeer = currentUser.role === 'peer';
  const partnerName = isPeer ? (request.studentName || 'Aarav S.') : (request.peerName || 'Rahul M.');
  const partnerAvatar = isPeer ? (request.studentAvatar || 'AS') : (request.peerAvatar || 'RM');
  const partnerTitle = isPeer ? 'Student' : (request.peerTitle || 'Senior Peer • C++');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [request.messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const textToSend = inputText.trim();
    setInputText('');
    setIsSending(true);
    try {
      await onSendMessage({ text: textToSend });
    } finally {
      setIsSending(false);
    }
  };

  const handleInsertCodeSnippet = async () => {
    await onSendMessage({
      type: 'code',
      text: 'Here is the pointer logic definition in C++:',
      codeSnippet: {
        title: 'POINTER DEFINITION - C++',
        code: `int value = 10;\nint* ptr = &value;\n*ptr = 20;`,
        explanation: 'The pointer stores the memory address, not the value at that address.'
      }
    });
  };

  const handleInsertErrorLog = async () => {
    await onSendMessage({
      text: 'Compile Error: invalid conversion from int to int* (main.cpp:42)'
    });
  };

  return (
    <div className={`w-full max-w-5xl mx-auto rounded-3xl border shadow-sm flex flex-col h-[82vh] overflow-hidden ${
      isNightMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-[#EAE4D7]'
    }`}>
      {/* Top Header */}
      <div className={`px-6 py-4 border-b flex items-center justify-between z-10 ${
        isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-[#FAF8F5] border-[#EAE4D7]'
      }`}>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onBack}
            className={`p-2 rounded-xl transition-colors ${
              isNightMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-white'
            }`}
            title="Back to dashboard"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="w-10 h-10 rounded-2xl bg-[#1B4332] text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {partnerAvatar}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className={`text-base font-bold font-serif leading-tight ${isNightMode ? 'text-white' : 'text-slate-900'}`}>
                Connected with {partnerName}
              </h2>
              <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5 font-sans">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
              <span>{partnerTitle} • {request.walkTime || '3 mins away'}</span>
              <span>•</span>
              <span className="text-[#22C55E] font-semibold">{request.course}</span>
            </div>
          </div>
        </div>

        {/* Wrap Up button */}
        <button
          type="button"
          onClick={onCompleteSession}
          className="px-4 py-2 text-xs font-bold text-white bg-[#1B4332] hover:bg-[#143527] rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Wrap Up Session</span>
        </button>
      </div>

      {/* Suggested Meeting Spot Banner */}
      <div className={`px-6 py-2.5 flex items-center justify-between text-xs border-b ${
        isNightMode ? 'bg-slate-900/60 border-slate-800 text-emerald-400' : 'bg-emerald-50/70 border-emerald-100 text-emerald-900'
      }`}>
        <div className="flex items-center space-x-2 font-medium">
          <MapPin className="w-4 h-4 text-[#22C55E]" />
          <span>Suggested meeting spot: <strong>{request.meetingLocation || 'BH 13 Common Room'}</strong></span>
        </div>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
          isNightMode ? 'bg-slate-800 text-emerald-300 border-slate-700' : 'bg-white text-[#1B4332] border-emerald-200'
        }`}>
          Walk: 3 min
        </span>
      </div>

      {/* Messages Feed */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${
        isNightMode ? 'bg-[#0B0F17]' : 'bg-[#FAF8F5]'
      }`}>
        <div className="text-center my-1">
          <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border ${
            isNightMode ? 'text-slate-400 bg-slate-900 border-slate-800' : 'text-slate-400 bg-white border-[#EAE4D7]'
          }`}>
            Doubt: {request.doubtTitle || 'Pointer logic'} • {new Date().toLocaleDateString()}
          </span>
        </div>

        {request.messages && request.messages.map((msg, idx) => {
          const isMe = msg.senderRole === currentUser.role;

          return (
            <div
              key={msg.id || idx}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div className="flex items-end space-x-2 max-w-2xl">
                {!isMe && (
                  <div className="w-7 h-7 rounded-lg bg-slate-700 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mb-1">
                    {msg.senderAvatar || 'U'}
                  </div>
                )}

                {/* Code Snippet Message */}
                {msg.type === 'code' && msg.codeSnippet ? (
                  <div className={`rounded-2xl p-4 shadow-xs space-y-2 max-w-lg border ${
                    isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#EAE4D7]'
                  }`}>
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
                      {msg.codeSnippet.title || 'CODE SNIPPET'}
                    </span>
                    <div className="bg-[#141C16] text-emerald-300 p-3.5 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-emerald-950">
                      <pre>{msg.codeSnippet.code}</pre>
                    </div>
                    {msg.codeSnippet.explanation && (
                      <p className={`text-xs leading-normal pt-1 border-t ${
                        isNightMode ? 'text-slate-300 border-slate-800' : 'text-slate-600 border-[#EAE4D7]'
                      }`}>
                        {msg.codeSnippet.explanation}
                      </p>
                    )}
                    <span className="text-[10px] text-slate-400 block text-right mt-1">
                      {msg.timestamp || 'Now'}
                    </span>
                  </div>
                ) : (
                  /* Standard Chat Bubble */
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isMe
                        ? 'bg-[#1B4332] text-white rounded-br-xs'
                        : isNightMode
                        ? 'bg-slate-800 text-slate-100 rounded-bl-xs border border-slate-700'
                        : 'bg-white text-slate-800 rounded-bl-xs border border-[#EAE4D7]'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[10px] block text-right mt-1 font-medium ${
                        isMe ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp || 'Now'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Pills */}
      <div className={`px-6 py-2 border-t flex items-center space-x-3 ${
        isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#EAE4D7]'
      }`}>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Tools:</span>
        <button
          type="button"
          onClick={handleInsertCodeSnippet}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors border ${
            isNightMode
              ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              : 'bg-[#FAF8F5] text-slate-700 border-[#EAE4D7] hover:bg-[#EAE4D7]'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>+ Share C++ Code Snippet</span>
        </button>

        <button
          type="button"
          onClick={handleInsertErrorLog}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors border ${
            isNightMode
              ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              : 'bg-[#FAF8F5] text-slate-700 border-[#EAE4D7] hover:bg-[#EAE4D7]'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-terracotta-600" />
          <span>+ Paste Compile Error</span>
        </button>
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={handleSend}
        className={`p-4 border-t flex items-center space-x-3 ${
          isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#EAE4D7]'
        }`}
      >
        <button
          type="button"
          onClick={handleInsertCodeSnippet}
          className={`p-2.5 rounded-xl transition-colors ${
            isNightMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-[#FAF8F5]'
          }`}
          title="Add code snippet"
        >
          <Plus className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${partnerName}...`}
          className={`flex-1 rounded-2xl px-5 py-3 text-sm focus:outline-none transition-all font-medium border ${
            isNightMode
              ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-[#22C55E]'
              : 'bg-[#FAF8F5] border-[#EAE4D7] text-slate-900 placeholder-slate-400 focus:border-[#1B4332] focus:bg-white'
          }`}
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="py-3 px-5 rounded-2xl bg-[#1B4332] hover:bg-[#143527] disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-xs flex-shrink-0"
        >
          <span>Send</span>
          <Send className="w-4 h-4 ml-1" />
        </button>
      </form>
    </div>
  );
}
