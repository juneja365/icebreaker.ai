import React, { useState } from 'react';
import { X, Send, Heart, MoreVertical, Smartphone, CheckCheck } from 'lucide-react';

interface PhoneSimulatorProps {
  message: string;
  contextTitle?: string;
  onClose: () => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({ message, contextTitle = 'Conversation Preview', onClose }) => {
  const [appMode, setAppMode] = useState<'imessage' | 'instagram'>('imessage');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-[3rem] p-3 shadow-2xl overflow-hidden ring-1 ring-white/10">
        
        {/* Top Phone Speaker Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-20 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          title="Close Simulator"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Screen Frame */}
        <div className="bg-slate-950 rounded-[2.5rem] pt-8 pb-5 px-4 h-[580px] flex flex-col justify-between overflow-hidden border border-slate-800/80">
          
          {/* Header */}
          <div className="border-b border-slate-800/80 pb-3 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>9:41</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setAppMode('imessage')}
                  className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${
                    appMode === 'imessage' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  iMessage
                </button>
                <button
                  onClick={() => setAppMode('instagram')}
                  className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${
                    appMode === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Instagram DM
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow">
                ✨
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-tight">Alex</p>
                <p className="text-[10px] text-emerald-400">Active now</p>
              </div>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 py-4 overflow-y-auto space-y-3 flex flex-col justify-end text-xs">
            <div className="text-center text-[10px] text-slate-500 mb-2">
              Today 9:38 AM
            </div>

            {/* Recipient Ghost Context */}
            <div className="self-start max-w-[80%] bg-slate-800/90 text-slate-200 rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm leading-relaxed">
              Hey! Just saw your story earlier haha
            </div>

            {/* Simulated Generated Message */}
            <div className="self-end max-w-[85%] group relative animate-fade-in">
              <div className={`px-4 py-2.5 rounded-2xl rounded-tr-sm text-white shadow-md leading-relaxed ${
                appMode === 'imessage'
                  ? 'bg-blue-600'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600'
              }`}>
                {message}
              </div>
              <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400 pr-1">
                <span>Delivered</span>
                <CheckCheck className="w-3 h-3 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Fake Input Bar */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
            <div className="flex-1 bg-slate-900 border border-slate-700/60 rounded-full px-3.5 py-2 text-xs text-slate-500 flex items-center justify-between">
              <span>Message...</span>
              <Heart className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center shadow">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Home indicator bar */}
          <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
        </div>
      </div>
    </div>
  );
};
