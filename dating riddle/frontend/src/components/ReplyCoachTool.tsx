import React, { useState } from 'react';
import { MessageSquare, ArrowRight, Copy, Check, Smartphone, Bookmark, Zap, Sparkles, RefreshCw } from 'lucide-react';
import { ReplyCoachResponse, SavedMessage, VibeType } from '../types';
import { api } from '../services/api';
import { RespectGuardBadge } from './RespectGuardBadge';

interface ReplyCoachToolProps {
  onPreview: (message: string) => void;
  onSave: (saved: SavedMessage) => void;
  onSendToRewrite: (message: string) => void;
}

export const ReplyCoachTool: React.FC<ReplyCoachToolProps> = ({
  onPreview,
  onSave,
  onSendToRewrite
}) => {
  const [receivedMessage, setReceivedMessage] = useState(
    'Honestly ended up baking banana bread at 2am and watching true crime docs haha'
  );
  const [desiredIntent, setDesiredIntent] = useState('keep_vibe');
  const [vibe, setVibe] = useState<VibeType>('chill');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ReplyCoachResponse | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const intents = [
    { id: 'keep_vibe', label: 'Keep The Vibe Going', desc: 'Maintain natural banter & flow' },
    { id: 'ask_out', label: 'Pivot To Meetup', desc: 'Suggest coffee/drinks naturally' },
    { id: 'playful_banter', label: 'Playful Tease', desc: 'Challenge or joke with them' },
    { id: 'deepen_convo', label: 'Deepen Convo', desc: 'Ask about passions & memories' },
  ];

  const handleGenerate = async () => {
    if (!receivedMessage.trim()) return;
    setIsLoading(true);
    try {
      const data = await api.getReplyCoach({
        received_message: receivedMessage,
        desired_intent: desiredIntent,
        vibe
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
              <MessageSquare className="w-4 h-4 text-purple-400" />
              Reply Coach
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste what they texted you to get high-engagement replies
            </p>
          </div>

          {/* Received Text Input */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              They said:
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={receivedMessage}
                onChange={(e) => setReceivedMessage(e.target.value)}
                placeholder="Paste the message you received..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Desired Intent / Goal */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              What's your goal?
            </label>
            <div className="space-y-1.5">
              {intents.map((item) => {
                const isSelected = desiredIntent === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDesiredIntent(item.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-purple-600/15 border-purple-500 text-white ring-1 ring-purple-500/30'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </div>
                    {isSelected && <Zap className="w-4 h-4 text-purple-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            disabled={isLoading || !receivedMessage.trim()}
            onClick={handleGenerate}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Reply Dynamics...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Coach My Reply</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Output */}
      <div className="lg:col-span-7 space-y-4">
        {result ? (
          <div className="space-y-4 animate-fade-in">
            {/* Subtext Analysis */}
            <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-purple-400">Subtext Analysis: </span>
                <span>{result.subtext_analysis}</span>
              </div>
              <RespectGuardBadge safety={result.safety_assessment} compact />
            </div>

            {/* Generated Reply Cards */}
            <div className="space-y-3.5">
              {result.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-purple-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25">
                        {reply.label}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                        {reply.momentum_rating}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(reply.id, reply.text)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Copy text"
                      >
                        {copiedId === reply.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onPreview(reply.text)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Preview in Phone Simulator"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                      </button>

                      <button
                        onClick={() =>
                          onSave({
                            id: reply.id,
                            tool: 'reply_coach',
                            text: reply.text,
                            tag: reply.label,
                            timestamp: Date.now()
                          })
                        }
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-pink-400"
                        title="Save"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onSendToRewrite(reply.text)}
                        className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <span>Tune</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="text-sm font-medium text-white bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed select-all">
                    “{reply.text}”
                  </div>

                  <p className="mt-2 text-[11px] text-slate-400 italic">
                    <strong className="text-slate-300 not-italic">Impression:</strong> {reply.subtext}
                  </p>
                </div>
              ))}
            </div>

            <RespectGuardBadge safety={result.safety_assessment} />
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[380px]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Get an expert reply coach</h4>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Never get stuck on what to say next. Paste their message and select whether you want to banter, meet up, or deepen rapport.
            </p>
            <button
              onClick={handleGenerate}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 border border-slate-700 hover:border-purple-500/40"
            >
              Coach Sample Banana Bread Reply
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
