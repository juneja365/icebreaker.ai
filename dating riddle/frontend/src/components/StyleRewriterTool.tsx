import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Copy, Check, Smartphone, Bookmark, Wand2, RefreshCw } from 'lucide-react';
import { RewriteResponse, SavedMessage, VibeType } from '../types';
import { api } from '../services/api';
import { RespectGuardBadge } from './RespectGuardBadge';

interface StyleRewriterToolProps {
  initialMessage?: string;
  onPreview: (message: string) => void;
  onSave: (saved: SavedMessage) => void;
}

export const StyleRewriterTool: React.FC<StyleRewriterToolProps> = ({
  initialMessage = '',
  onPreview,
  onSave
}) => {
  const [message, setMessage] = useState(
    initialMessage || 'I was wondering if maybe you would like to grab coffee sometime if you are not too busy?'
  );
  const [targetTone, setTargetTone] = useState<string>('chill');
  const [slangLevel, setSlangLevel] = useState<string>('universal');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RewriteResponse | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  const tones = [
    { id: 'chill', label: 'More Chill & Natural', emoji: '☕', desc: 'Removes nervous hesitation' },
    { id: 'confident', label: 'More Confident & Direct', emoji: '🔥', desc: 'No apologies, high self-assurance' },
    { id: 'funny', label: 'More Witty & Playful', emoji: '😂', desc: 'Light teasing & banter' },
    { id: 'thoughtful', label: 'More Thoughtful', emoji: '💡', desc: 'Deepens conversational bond' },
    { id: 'concise', label: 'Ultra Concise', emoji: '⚡', desc: 'Mobile-friendly, no fluff' },
  ];

  const handleRewrite = async () => {
    if (!message.trim()) return;
    setIsLoading(true);
    try {
      const data = await api.rewriteTone({
        message,
        target_tone: targetTone,
        slang_level: slangLevel
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      
      {/* Left Input */}
      <div className="lg:col-span-5 space-y-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-pink-400" />
              Tone Tuner & Rewriter
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Transform awkward or overly stiff drafts into natural text messages
            </p>
          </div>

          {/* Draft text */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Your draft message:
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste any draft message you want to make sound more natural..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all resize-none"
            />
          </div>

          {/* Target Tone Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              Select desired tone:
            </label>
            <div className="space-y-1.5">
              {tones.map((t) => {
                const isSelected = targetTone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTargetTone(t.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-pink-600/15 border-pink-500 text-white ring-1 ring-pink-500/30'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{t.emoji}</span>
                      <div>
                        <div className="text-xs font-bold">{t.label}</div>
                        <div className="text-[10px] text-slate-400">{t.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            disabled={isLoading || !message.trim()}
            onClick={handleRewrite}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg shadow-pink-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Transforming Tone...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Rewrite Naturally</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Output */}
      <div className="lg:col-span-7 space-y-4">
        {result ? (
          <div className="space-y-4 animate-fade-in">
            {/* Rewritten Card */}
            <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                  Naturalized Rewrite
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(result.rewritten)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                    title="Copy"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onPreview(result.rewritten)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                    title="Preview in Phone"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  </button>

                  <button
                    onClick={() =>
                      onSave({
                        id: 'rewrite-' + Date.now(),
                        tool: 'rewrite',
                        text: result.rewritten,
                        tag: targetTone,
                        timestamp: Date.now()
                      })
                    }
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-pink-400"
                    title="Save"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Message comparison */}
              <div className="space-y-2">
                <div className="text-[11px] text-slate-400 font-medium">Original draft:</div>
                <div className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800 line-through opacity-75">
                  “{result.original}”
                </div>

                <div className="text-[11px] text-emerald-400 font-bold mt-2">Natural AI Rewrite:</div>
                <div className="text-sm font-semibold text-white bg-slate-900/90 p-4 rounded-xl border border-emerald-500/30 leading-relaxed shadow-sm">
                  “{result.rewritten}”
                </div>
              </div>

              {/* Rationale */}
              <div className="text-xs text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
                <strong className="text-pink-300">Adjustment Made: </strong>
                {result.explanation}
              </div>
            </div>

            <RespectGuardBadge safety={result.safety_assessment} />
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[380px]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-3">
              <Bot className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Make any draft sound like you</h4>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Written a text that sounds too stiff or apologetic? Run it through the Tone Tuner to strip away hesitation disclaimers and boost natural charm.
            </p>
            <button
              onClick={handleRewrite}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-400 border border-slate-700 hover:border-pink-500/40"
            >
              Test Rewrite on Sample Draft
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
