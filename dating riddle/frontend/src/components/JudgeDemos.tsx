import React from 'react';
import { X, Sparkles, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { Scenario, ToolType } from '../types';

interface JudgeDemosProps {
  scenarios: Scenario[];
  onSelectScenario: (scenario: Scenario) => void;
  onClose: () => void;
}

export const JudgeDemos: React.FC<JudgeDemosProps> = ({
  scenarios,
  onSelectScenario,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">
                Build Night Judge Evaluation Suite
              </h3>
              <p className="text-xs text-slate-400">
                1-click live demo scenarios tested across varied contexts & safety filters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {scenarios.map((sc) => (
            <div
              key={sc.id}
              onClick={() => {
                onSelectScenario(sc);
                onClose();
              }}
              className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {sc.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">
                    Tool: {sc.recommended_tool.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                  {sc.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {sc.situation || sc.received_message}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Load Scenario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Judge Metric Note */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs text-slate-300 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Judging Criteria Aligned: </strong>
            Evaluates contextual relevance, tone diversity, respectful non-pushy phrasing, and resilient error recovery.
          </div>
        </div>

      </div>
    </div>
  );
};
