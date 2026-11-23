import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export default function DeviceFrame({ title, subtitle, badge, badgeColor = 'bg-blue-600', children }) {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col items-center">
      {/* Device Header label outside phone */}
      <div className="mb-2 text-center">
        <div className="flex items-center justify-center space-x-2">
          <span className="font-bold text-sm text-slate-800">{title}</span>
          {badge && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      {/* Phone Shell */}
      <div className="mobile-mock-shell">
        {/* Notch */}
        <div className="mobile-notch">
          <div className="mobile-speaker"></div>
        </div>

        {/* Status Bar */}
        <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-700 select-none z-30">
          <span>{currentTime}</span>
          <div className="flex items-center space-x-1.5">
            <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <Battery className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Screen Viewport */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {children}
        </div>

        {/* Home Indicator bar */}
        <div className="mobile-home-indicator"></div>
      </div>
    </div>
  );
}
