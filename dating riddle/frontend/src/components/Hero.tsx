import React from 'react';
import { Sparkles, ShieldCheck, Database, Layers, Eye } from 'lucide-react';
import { CustomBranding } from '../types';

interface HeroProps {
  branding?: CustomBranding;
}

export const Hero: React.FC<HeroProps> = ({ branding }) => {
  return (
    <section className="relative pt-8 pb-6 text-center max-w-4xl mx-auto px-4">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-32 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 blur-3xl -z-10 pointer-events-none" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium mb-3 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-slate-300">Production AI Architecture</span>
        <span className="text-slate-600">•</span>
        <span className="text-indigo-400 font-mono text-[11px]">SQLite 3 & Supabase Ready</span>
      </div>

      {/* Main Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 leading-tight">
        Engineered conversations. <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-indigo-300 via-slate-100 to-indigo-200 bg-clip-text text-transparent">
          Zero awkward silences.
        </span>
      </h2>

      {/* Subtitle */}
      <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
        {branding?.tagline || "Replace boring “Hey, what's up?” with context-aware, low-pressure messages. Powered by structured intent extraction, respectful safety auditing, and psychological riddle resolution."}
      </p>

      {/* 4 Professional Technical Pillars */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 max-w-3xl mx-auto text-left">
        <div className="saas-card p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-semibold text-slate-200">Context Conditioning</h4>
          </div>
          <p className="text-[11px] text-slate-400">Campus, socials, dating apps, and workplace channels.</p>
        </div>

        <div className="saas-card p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-semibold text-slate-200">Riddle 2 Decoder</h4>
          </div>
          <p className="text-[11px] text-slate-400">Deconstructs ambiguous texts ("Fine.", "Maybe") into realities.</p>
        </div>

        <div className="saas-card p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-semibold text-slate-200">Respect Guard</h4>
          </div>
          <p className="text-[11px] text-slate-400">Continuous scoring filters out pushy, manipulative pressure.</p>
        </div>

        <div className="saas-card p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Database className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-semibold text-slate-200">Persistent SQLite</h4>
          </div>
          <p className="text-[11px] text-slate-400">All generations committed to disk in <code className="text-cyan-300 font-mono text-[10px]">icebreaker.db</code>.</p>
        </div>
      </div>
    </section>
  );
};
