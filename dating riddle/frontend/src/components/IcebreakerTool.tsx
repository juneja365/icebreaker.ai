import React, { useState } from 'react';
import {
  GraduationCap,
  Instagram,
  Heart,
  Users,
  Sparkles,
  Copy,
  Check,
  Smartphone,
  Bookmark,
  RefreshCw,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { SettingType, VibeType, IcebreakerResponse, SavedMessage } from '../types';
import { api } from '../services/api';
import { RespectGuardBadge } from './RespectGuardBadge';

interface IcebreakerToolProps {
  onPreview: (message: string) => void;
  onSave: (saved: SavedMessage) => void;
  onSendToRewrite: (message: string) => void;
}

export const IcebreakerTool: React.FC<IcebreakerToolProps> = ({
  onPreview,
  onSave,
  onSendToRewrite
}) => {
  const [setting, setSetting] = useState<SettingType>('college');
  const [situation, setSituation] = useState(
    'We are in the same college biology lab but haven’t talked much yet.'
  );
  const [targetDetails, setTargetDetails] = useState(
    'They love rock climbing and wore an indie band jacket.'
  );
  const [vibe, setVibe] = useState<VibeType>('chill');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IcebreakerResponse | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const platforms: { id: SettingType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'college', label: 'College / Campus', icon: <GraduationCap className="w-4 h-4" />, desc: 'Classmate, library, dining hall' },
    { id: 'instagram', label: 'Instagram / Social', icon: <Instagram className="w-4 h-4" />, desc: 'Story reply, DM, post comment' },
    { id: 'dating', label: 'Dating App / Interest', icon: <Heart className="w-4 h-4" />, desc: 'Match bio, mutual crush' },
    { id: 'teammate', label: 'New Teammate', icon: <Users className="w-4 h-4" />, desc: 'Slack, coworker, networking' },
  ];

  const vibes: { id: VibeType; label: string; emoji: string }[] = [
    { id: 'chill', label: 'Chill & Natural', emoji: '☕' },
    { id: 'funny', label: 'Funny & Witty', emoji: '😂' },
    { id: 'confident', label: 'Confident & Direct', emoji: '🔥' },
    { id: 'thoughtful', label: 'Thoughtful & Curious', emoji: '💡' },
  ];

  const handleGenerate = async () => {
    if (!situation.trim()) return;
    setIsLoading(true);
    try {
      const data = await api.generateIcebreakers({
        setting,
        situation,
        vibe,
        target_details: targetDetails
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
      
      {/* Left Input Form Panel */}
      <div className="lg:col-span-5 space-y-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          
          {/* Header */}
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              1. Where are you talking?
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Select the channel or environment</p>
          </div>

          {/* Platform Selector Grid */}
          <div className="grid grid-cols-2 gap-2">
            {platforms.map((p) => {
              const isSelected = setting === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSetting(p.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-pink-600/15 border-pink-500 text-white ring-1 ring-pink-500/40 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg w-fit mb-1.5 ${isSelected ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
                    {p.icon}
                  </div>
                  <div className="text-xs font-bold">{p.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">{p.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Situation Context */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Describe the situation
            </label>
            <textarea
              rows={3}
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="E.g., We sit next to each other in chemistry class but haven't talked yet..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all resize-none"
            />
          </div>

          {/* Target Person Profile Clues (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Details or observation hook <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={targetDetails}
              onChange={(e) => setTargetDetails(e.target.value)}
              placeholder="E.g., Indie rock jacket, reading Dune, hiking photo"
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all"
            />
          </div>

          {/* Choose Vibe */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-2">
              Choose your vibe
            </label>
            <div className="grid grid-cols-2 gap-2">
              {vibes.map((v) => {
                const isSelected = vibe === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVibe(v.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500 text-white ring-1 ring-purple-500/40'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{v.emoji}</span>
                    <span>{v.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            disabled={isLoading || !situation.trim()}
            onClick={handleGenerate}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 active:scale-[0.99] transition-all shadow-lg shadow-pink-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting Openers...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Icebreakers</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Output Panel */}
      <div className="lg:col-span-7 space-y-4">
        {result ? (
          <div className="space-y-4 animate-fade-in">
            {/* Safety & Context Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass-panel p-3.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                <span className="font-semibold capitalize">{result.setting}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 truncate max-w-xs">{result.situation_analysis}</span>
              </div>
              <RespectGuardBadge safety={result.safety_assessment} compact />
            </div>

            {/* Suggestions Cards (Casual, Funny, Confident) */}
            <div className="space-y-3.5">
              {result.options.map((option, idx) => (
                <div
                  key={option.id}
                  className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-pink-500/30 transition-all group relative"
                >
                  {/* Style tag & action bar */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/25">
                      {option.style}
                    </span>

                    <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(option.id, option.text)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedId === option.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Phone Simulator Preview */}
                      <button
                        onClick={() => onPreview(option.text)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Preview inside Phone Chat Simulator"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                      </button>

                      {/* Save */}
                      <button
                        onClick={() =>
                          onSave({
                            id: option.id,
                            tool: 'icebreaker',
                            text: option.text,
                            tag: option.style,
                            timestamp: Date.now()
                          })
                        }
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-pink-400 transition-colors"
                        title="Save to favorites"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>

                      {/* Rewrite */}
                      <button
                        onClick={() => onSendToRewrite(option.text)}
                        className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-purple-900/40 text-purple-300 hover:bg-purple-800/50 border border-purple-500/30 transition-colors"
                        title="Tune tone in Style Rewriter"
                      >
                        <span>Tune</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Message Bubble Text */}
                  <div className="text-sm font-medium text-white bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed select-all">
                    “{option.text}”
                  </div>

                  {/* Psychology explanation note */}
                  <div className="mt-2.5 flex items-start gap-2 text-[11px] text-slate-400">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-slate-300">Why it works:</strong> {option.why_it_works}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Respect Guard Details */}
            <RespectGuardBadge safety={result.safety_assessment} />
          </div>
        ) : (
          /* Empty placeholder state */
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[380px]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-3 shadow-inner">
              <Sparkles className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Ready to start the conversation?</h4>
            <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
              Fill in your context on the left or tap <strong>Judge Demos</strong> above to populate a live scenario instantly.
            </p>
            <button
              onClick={handleGenerate}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-400 border border-slate-700 hover:border-pink-500/40 transition-all"
            >
              Run Default Demo
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
