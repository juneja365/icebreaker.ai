import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SafetyReport } from '../types';

interface RespectGuardBadgeProps {
  safety: SafetyReport;
  compact?: boolean;
}

export const RespectGuardBadge: React.FC<RespectGuardBadgeProps> = ({ safety, compact = false }) => {
  const isSafe = safety.is_safe && safety.respect_score >= 70;
  
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isSafe 
          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' 
          : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
      }`}>
        {isSafe ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
        <span>{safety.respect_score}% Respectful</span>
      </div>
    );
  }

  return (
    <div className={`p-3.5 rounded-xl border text-sm transition-all ${
      isSafe
        ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-100'
        : 'bg-rose-950/30 border-rose-500/30 text-rose-100'
    }`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {isSafe ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          )}
          <span className="font-semibold text-xs tracking-wider uppercase text-slate-300">
            Respectful Conversation Guard
          </span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          isSafe ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
        }`}>
          {safety.respect_score}/100 Score
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
        {safety.feedback}
      </p>

      {safety.positive_tags && safety.positive_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {safety.positive_tags.map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/50">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {safety.flags && safety.flags.length > 0 && (
        <div className="mt-2 text-xs text-rose-300 bg-rose-950/40 p-2 rounded-lg border border-rose-500/20">
          <span className="font-semibold">Flagged: </span>
          {safety.flags.join(', ')}
        </div>
      )}
    </div>
  );
};
