import React, { useState } from 'react';
import { Eye, Sparkles, Copy, Check, Smartphone, Bookmark, AlertTriangle, ShieldCheck, HeartHandshake, Compass, RefreshCw, HelpCircle } from 'lucide-react';
import { WhatWasMeantResponse, SavedMessage } from '../types';
import { api } from '../services/api';
import { RespectGuardBadge } from './RespectGuardBadge';

interface WhatWasMeantToolProps {
  onPreview: (message: string) => void;
  onSave: (saved: SavedMessage) => void;
}

export const WhatWasMeantTool: React.FC<WhatWasMeantToolProps> = ({
  onPreview,
  onSave
}) => {
  const [ambiguousPhrase, setAmbiguousPhrase] = useState('Fine.');
  const [contextSignals, setContextSignals] = useState('Replied 3 hours later, used a period instead of their usual exclamation points.');
  const [anxietyGuess, setAnxietyGuess] = useState('I feel like they are mad at me or losing interest.');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WhatWasMeantResponse | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Exact cases from the Build Night Riddle 2 slide
  const riddlePresets = [
    {
      title: 'Case 1: "Fine."',
      phrase: 'Fine.',
      signals: 'Normally texts warmly with emojis, but sent a single word with a period.',
      guess: 'I think they are secretly angry at something I said.'
    },
    {
      title: 'Case 2: "Maybe." / "I\'ll see."',
      phrase: 'Maybe, I\'ll see how my week goes.',
      signals: 'I asked if they want to get dinner Thursday; they gave a vague non-committal answer.',
      guess: 'I feel like they don\'t want to see me but are too polite to say no.'
    },
    {
      title: 'Case 3: Slow Reply (4h Silence)',
      phrase: '[4 hours of silence after I asked a question]',
      signals: 'They were active on Instagram 20 mins ago but haven\'t opened my text.',
      guess: 'They are intentionally ignoring me or talking to someone else.'
    },
    {
      title: 'Case 4: Plan Changed ("Raincheck?")',
      phrase: 'Hey, something came up for tonight, can we raincheck?',
      signals: 'Cancelled 3 hours before our scheduled coffee date without giving a new date.',
      guess: 'They got cold feet and are softly ghosting me.'
    }
  ];

  const handleDecode = async () => {
    if (!ambiguousPhrase.trim()) return;
    setIsLoading(true);
    try {
      const data = await api.decodeWhatWasMeant({
        ambiguous_phrase: ambiguousPhrase,
        context_signals: contextSignals,
        anxiety_guess: anxietyGuess
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
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Riddle 2 Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold uppercase tracking-widest border border-indigo-500/20">
              <span>Riddle 2 • Dating Psychology</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              What Was Meant — The Interpretation Gap Decoder
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed italic">
              “Two people can use the same words and mean different things. 'Fine.' 'Maybe.' 'I'll see.' 
              A slow reply, a quiet moment, a plan that changes without explanation. 
              Each person fills the gap with a guess, and each guess feels like a fact. 
              Nobody has lied, and something is already breaking.”
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => {
                const preset = riddlePresets[0];
                setAmbiguousPhrase(preset.phrase);
                setContextSignals(preset.signals);
                setAnxietyGuess(preset.guess);
                handleDecode();
              }}
              className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>Decode "Fine."</span>
            </button>
          </div>
        </div>

        {/* 1-Click Riddle Presets */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 mb-2">Test exact scenarios from the riddle slide:</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {riddlePresets.map((rp, i) => (
              <button
                key={i}
                onClick={() => {
                  setAmbiguousPhrase(rp.phrase);
                  setContextSignals(rp.signals);
                  setAnxietyGuess(rp.guess);
                }}
                className={`p-2 rounded-xl border text-left transition-all ${
                  ambiguousPhrase === rp.phrase
                    ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs truncate">{rp.title}</div>
                <div className="text-[10px] text-slate-500 truncate">{rp.phrase}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                The Ambiguity Trigger
              </h4>
              <p className="text-xs text-slate-400">What was said, sent, or left unsaid?</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                The exact words or behavior received:
              </label>
              <input
                type="text"
                value={ambiguousPhrase}
                onChange={(e) => setAmbiguousPhrase(e.target.value)}
                placeholder="E.g. 'Fine.', 'Maybe', 'I'll see', or '4h silence'"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Context & subtle signals <span className="text-slate-500 font-normal">(pacing, punctuation, timing)</span>:
              </label>
              <textarea
                rows={2}
                value={contextSignals}
                onChange={(e) => setContextSignals(e.target.value)}
                placeholder="E.g., Used a period instead of emoji, took 4 hours, plan changed last minute..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-indigo-300 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Your overthinking guess ("what it feels like"):</span>
              </label>
              <input
                type="text"
                value={anxietyGuess}
                onChange={(e) => setAnxietyGuess(e.target.value)}
                placeholder="E.g., They are mad at me / losing interest / soft ghosting"
                className="w-full bg-slate-900/90 border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                “Each person fills the gap with a guess, and each guess feels like a fact.”
              </span>
            </div>

            <button
              type="button"
              disabled={isLoading || !ambiguousPhrase.trim()}
              onClick={handleDecode}
              className="w-full py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Decoding Subtext & Gap...</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Decode What Was Meant</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="space-y-4 animate-fade-in">
              {/* Gap Risk & Projection Card */}
              <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
                    <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                      The Gap Diagnosis
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    {result.gap_risk_score}% Misinterpretation Risk
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {result.projection_diagnosis}
                </p>
              </div>

              {/* 3 Realities Grid (What was actually happening on their end) */}
              <div>
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>3 Plausible Realities (Beyond the Worst-Case Guess)</span>
                </h5>

                <div className="space-y-2.5">
                  {result.possible_realities.map((reality, idx) => (
                    <div
                      key={idx}
                      className="glass-card p-3.5 rounded-2xl border border-slate-800/80 space-y-1.5 hover:border-purple-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300">
                          {reality.label}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                          {reality.likelihood}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {reality.explanation}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {reality.signs.map((sign, si) => (
                          <span
                            key={si}
                            className="text-[10px] bg-slate-900/80 text-slate-400 px-2 py-0.5 rounded border border-slate-800"
                          >
                            • {sign}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bridge The Gap Response Generator */}
              <div className="space-y-2.5 pt-2">
                <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>How to Bridge The Gap (Without Defensiveness or Guilt)</span>
                </h5>

                <div className="space-y-3">
                  {result.gap_bridges.map((bridge) => (
                    <div
                      key={bridge.id}
                      className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                          {bridge.style}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopy(bridge.id, bridge.text)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Copy"
                          >
                            {copiedId === bridge.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => onPreview(bridge.text)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Preview in Phone"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                          </button>

                          <button
                            onClick={() =>
                              onSave({
                                id: bridge.id,
                                tool: 'what_was_meant',
                                text: bridge.text,
                                tag: bridge.style,
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

                      <div className="text-sm font-semibold text-white bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 leading-relaxed select-all">
                        “{bridge.text}”
                      </div>

                      <p className="mt-2 text-[11px] text-slate-400">
                        <strong className="text-slate-300">Why it bridges:</strong> {bridge.why_it_bridges}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Riddle Resolution Takeaway */}
              <div className="glass-panel p-4 rounded-2xl border border-indigo-500/30 text-xs text-slate-300 space-y-1 bg-indigo-950/20">
                <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <span>The Riddle Answer: Who is Responsible for the Gap?</span>
                </div>
                <p className="leading-relaxed text-slate-300">
                  {result.riddle_insight}
                </p>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
                <HelpCircle className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">When what is said and heard come apart</h4>
              <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
                Stuck overthinking a brief text like <em>'Fine.'</em>, <em>'Maybe'</em>, or 4 hours of radio silence? Tap Decode to separate anxious assumptions from reality.
              </p>
              <button
                onClick={handleDecode}
                className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 border border-slate-700"
              >
                Decode "Fine." Preset
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
