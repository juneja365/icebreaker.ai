import React, { useState } from 'react';
import { RefreshCw, LifeBuoy, AlertCircle, Copy, Check, Smartphone, Bookmark, Sparkles, ArrowRight } from 'lucide-react';
import { RescueResponse, SavedMessage } from '../types';
import { api } from '../services/api';
import { RespectGuardBadge } from './RespectGuardBadge';

interface RescueToolProps {
  onPreview: (message: string) => void;
  onSave: (saved: SavedMessage) => void;
  onSendToRewrite: (message: string) => void;
}

export const RescueTool: React.FC<RescueToolProps> = ({
  onPreview,
  onSave,
  onSendToRewrite
}) => {
  const [lastMessages, setLastMessages] = useState('Them: haha yeah');
  const [stallReason, setStallReason] = useState('one_word_answer');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RescueResponse | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const stallTypes = [
    { id: 'one_word_answer', label: 'One-Word Reply', desc: 'Sent "lol", "nice", "yeah"' },
    { id: 'ghosted_2_days', label: 'Ghosted / 2-Day Silence', desc: 'Chat randomly went cold' },
    { id: 'dead_end', label: 'Topic Hit Dead End', desc: 'Ran out of things to say' },
    { id: 'awkward_silence', label: 'Awkward Transition', desc: 'Unsure how to pivot' },
  ];

  const handleRescue = async () => {
    if (!lastMessages.trim()) return;
    setIsLoading(true);
    try {
      const data = await api.rescueConversation({
        last_messages: lastMessages,
        stall_reason: stallReason,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      
      {/* Left Input */}
      <div className="lg:col-span-5 space-y-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-indigo-400" />
              Conversation Rescue
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Re-ignite dying chats without sounding desperate or awkward
            </p>
          </div>

          {/* Stalled exchange */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Where did it stall?
            </label>
            <textarea
              rows={3}
              value={lastMessages}
              onChange={(e) => setLastMessages(e.target.value)}
              placeholder="E.g., You: How was your weekend? Them: haha yeah pretty good"
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Stall reason pills */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              What caused the stall?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {stallTypes.map((st) => {
                const isSelected = stallReason === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStallReason(st.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500/30'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight">{st.label}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{st.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="button"
            disabled={isLoading || !lastMessages.trim()}
            onClick={handleRescue}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Rescue Hooks...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Rescue This Conversation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Output */}
      <div className="lg:col-span-7 space-y-4">
        {result ? (
          <div className="space-y-4 animate-fade-in">
            {/* Diagnosis header */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                  <AlertCircle className="w-4 h-4 text-indigo-400" />
                  <span>Conversational Diagnosis</span>
                </div>
                <RespectGuardBadge safety={result.safety_assessment} compact />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.stall_diagnosis}
              </p>
              <div className="pt-1 text-[11px] text-amber-300 bg-amber-950/20 p-2 rounded-lg border border-amber-500/20">
                <strong>Coach Rule:</strong> {result.coach_tip}
              </div>
            </div>

            {/* Strategy suggestions */}
            <div className="space-y-3.5">
              {result.strategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-indigo-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                      {strategy.approach}
                    </span>

                    <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(strategy.id, strategy.text)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Copy"
                      >
                        {copiedId === strategy.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onPreview(strategy.text)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Preview in Phone"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                      </button>

                      <button
                        onClick={() =>
                          onSave({
                            id: strategy.id,
                            tool: 'rescue',
                            text: strategy.text,
                            tag: strategy.approach,
                            timestamp: Date.now()
                          })
                        }
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-pink-400"
                        title="Save"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onSendToRewrite(strategy.text)}
                        className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <span>Tune</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="text-sm font-medium text-white bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed select-all">
                    “{strategy.text}”
                  </div>

                  <p className="mt-2 text-[11px] text-slate-400">
                    <strong className="text-slate-300">Why it revives:</strong> {strategy.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[380px]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
              <LifeBuoy className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Rescue dying conversations</h4>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              When someone gives a low-effort reply like 'haha yeah' or goes quiet for 48 hours, don't double text defensively. Use low-friction hooks to restart the momentum.
            </p>
            <button
              onClick={handleRescue}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 hover:border-indigo-500/40"
            >
              Test Rescue on "Them: haha yeah"
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
