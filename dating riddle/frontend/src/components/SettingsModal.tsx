import React, { useState } from 'react';
import { X, Settings, ShieldCheck, Database, Cpu, Check, Palette, Sparkles } from 'lucide-react';
import { CustomBranding } from '../types';

interface SettingsModalProps {
  backendStatus: { status: string; engine: string; llm_key_present: boolean };
  branding: CustomBranding;
  onUpdateBranding: (branding: CustomBranding) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  backendStatus,
  branding,
  onUpdateBranding,
  onClose
}) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('ICEBREAKER_USER_KEY') || '');
  const [savedKey, setSavedKey] = useState(false);

  // Custom Branding local state
  const [appName, setAppName] = useState(branding.appName);
  const [tagline, setTagline] = useState(branding.tagline);
  const [logoEmoji, setLogoEmoji] = useState(branding.logoEmoji);
  const [savedBranding, setSavedBranding] = useState(false);

  const handleSaveKey = () => {
    localStorage.setItem('ICEBREAKER_USER_KEY', apiKey.trim());
    setSavedKey(true);
    setTimeout(() => setSavedKey(false), 2000);
  };

  const handleSaveBranding = () => {
    const updated = {
      appName: appName.trim() || 'Icebreaker AI',
      tagline: tagline.trim() || 'Turn awkward silences into natural conversations',
      logoEmoji: logoEmoji.trim() || '🧊'
    };
    onUpdateBranding(updated);
    localStorage.setItem('ICEBREAKER_BRANDING', JSON.stringify(updated));
    setSavedBranding(true);
    setTimeout(() => setSavedBranding(false), 2000);
  };

  const emojiOptions = ['🧊', '🔥', '✨', '💬', '⚡', '🏹', '🍸', '💡'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-200">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">App Customization & System</h3>
              <p className="text-xs text-slate-400">Branding, Themes, and LLM Settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Custom Branding Section */}
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 space-y-3 mb-5">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
            <Palette className="w-4 h-4" />
            <span>Customize App Branding & Logo</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-slate-300 mb-1">App Name</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Logo Icon</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={logoEmoji}
                  onChange={(e) => setLogoEmoji(e.target.value)}
                  maxLength={2}
                  className="w-12 text-center bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                <div className="flex flex-wrap gap-1 max-w-[80px]">
                  {emojiOptions.slice(0, 4).map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setLogoEmoji(em)}
                      className="text-xs hover:scale-125 transition-transform"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>

          <button
            onClick={handleSaveBranding}
            className="w-full py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            {savedBranding ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{savedBranding ? 'Branding Updated!' : 'Apply Custom Branding'}</span>
          </button>
        </div>

        {/* 2. System Status Indicators */}
        <div className="space-y-2 mb-5">
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Cpu className="w-4 h-4 text-pink-400" />
              <span>Inference Engine:</span>
            </div>
            <span className="font-bold text-white">{backendStatus.engine}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Respect Guard:</span>
            </div>
            <span className="font-bold text-emerald-300">100% Active</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Persistence:</span>
            </div>
            <span className="font-bold text-slate-300">Supabase Ready / In-Memory Active</span>
          </div>
        </div>

        {/* 3. Optional Custom API Key */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-xs font-bold text-slate-200">
            Custom OpenAI / Groq Key <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            <button
              onClick={handleSaveKey}
              className="px-3 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
            >
              {savedKey ? <Check className="w-3.5 h-3.5" /> : 'Save'}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Note: You do not need an API key to test! The built-in conversational psychology engine runs with zero latency out of the box.
          </p>
        </div>

      </div>
    </div>
  );
};
