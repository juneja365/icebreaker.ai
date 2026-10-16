import React from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Bot, 
  Bookmark, 
  Compass, 
  RefreshCw, 
  Heart, 
  Camera, 
  Palette, 
  Eye, 
  Database,
  SlidersHorizontal
} from 'lucide-react';
import { ToolType, ThemeMode, CustomBranding } from '../types';

interface NavbarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  branding: CustomBranding;
  onOpenDemos: () => void;
  onOpenFavorites: () => void;
  onOpenSettings: () => void;
  onOpenDatabase: () => void;
  backendStatus: { status: string; engine: string };
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTool,
  setActiveTool,
  theme,
  setTheme,
  branding,
  onOpenDemos,
  onOpenFavorites,
  onOpenSettings,
  onOpenDatabase,
  backendStatus,
  savedCount
}) => {
  const tools: { id: ToolType; label: string; icon: React.ReactNode; isNew?: boolean }[] = [
    { id: 'icebreaker', label: 'Icebreakers', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'reply_coach', label: 'Reply Coach', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'what_was_meant', label: 'What Was Meant', icon: <Eye className="w-3.5 h-3.5 text-indigo-400" />, isNew: true },
    { id: 'rescue', label: 'Rescue', icon: <RefreshCw className="w-3.5 h-3.5" /> },
    { id: 'rewrite', label: 'Tone Tuner', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'bio_maker', label: 'Bio Maker', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'screenshot_scan', label: 'Vision Scan', icon: <Camera className="w-3.5 h-3.5" /> },
  ];

  const themes: { id: ThemeMode; label: string; icon: string }[] = [
    { id: 'sunset', label: 'Executive Dark', icon: '🌑' },
    { id: 'cyberpunk', label: 'Studio Neon', icon: '⚡' },
    { id: 'obsidian', label: 'Obsidian Pure', icon: '🖤' },
    { id: 'emerald', label: 'Emerald Mint', icon: '🍃' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-slate-800 flex items-center justify-center shadow-lg shadow-indigo-500/10 border border-indigo-400/30 text-white font-semibold text-sm">
            {branding.logoEmoji || '⚡'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-base tracking-tight text-white">
                {branding.appName || 'Icebreaker AI'}
              </h1>
              <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-normal">
              {branding.tagline || 'Turn awkward silences into natural conversations'}
            </p>
          </div>
        </div>

        {/* Center Tool Navigation Tabs */}
        <nav className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800/90 shadow-inner overflow-x-auto max-w-full">
          {tools.map((t) => {
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
                {t.isNew && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 ml-0.5"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          
          {/* Database & Telemetry Button */}
          <button
            onClick={onOpenDatabase}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900/40 hover:text-white transition-all shadow-sm"
            title="Inspect persistent SQLite database, table schema and logs"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] font-semibold hidden sm:inline">Database</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* Quick Demo Scenarios for Judges */}
          <button
            onClick={onOpenDemos}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all"
            title="Instant scenarios to demo for Build Night judges"
          >
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] hidden sm:inline">Scenarios</span>
          </button>

          {/* Saved Bookmarks */}
          <button
            onClick={onOpenFavorites}
            className="relative flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all"
            title="View saved openers and bridges"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* Settings & System Engine */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 text-xs font-medium px-2 py-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700 transition-all"
            title="Configure API Keys & Engine Settings"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] hidden xl:inline text-slate-400 truncate max-w-[90px]">
              {backendStatus.engine}
            </span>
          </button>

          {/* Theme Dropdown */}
          <div className="relative group">
            <button
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              title="Change Appearance Theme"
            >
              <Palette className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <div className="absolute right-0 top-full mt-1.5 hidden group-hover:flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl z-50 min-w-[140px]">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setTheme(th.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                    theme === th.id ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{th.icon}</span>
                  <span>{th.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
