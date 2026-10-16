import React, { useState } from 'react';
import { Sparkles, Heart, Copy, Check, Bookmark, Lightbulb, RefreshCw, Smartphone, Award } from 'lucide-react';
import { BioResponse, SavedMessage, VibeType } from '../types';
import { api } from '../services/api';
import { RespectGuardBadge } from './RespectGuardBadge';

interface BioArchitectToolProps {
  onPreview: (message: string) => void;
  onSave: (saved: SavedMessage) => void;
}

export const BioArchitectTool: React.FC<BioArchitectToolProps> = ({
  onPreview,
  onSave
}) => {
  const [platform, setPlatform] = useState<string>('hinge');
  const [archetype, setArchetype] = useState<string>('witty_storyteller');
  const [interests, setInterests] = useState('Indie coffee shops, bouldering, synthwave, spicy ramen');
  const [hotTake, setHotTake] = useState('Pineapple belongs on pizza and iced coffee is an all-season beverage');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BioResponse | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const platforms = [
    { id: 'hinge', label: 'Hinge Prompts', desc: 'Designed to be deleted' },
    { id: 'tinder', label: 'Tinder 1-Liners', desc: 'Punchy & fast scan' },
    { id: 'bumble', label: 'Bumble Opening Moves', desc: 'Easy for matches to open' },
  ];

  const archetypes = [
    { id: 'witty_storyteller', label: 'Witty Storyteller', emoji: '🎭', desc: 'Charming humor & music chemistry' },
    { id: 'playful_debate', label: 'Playful Debater', emoji: '🔥', desc: 'Irresistible low-stakes controversy' },
    { id: 'lowkey_relatable', label: 'Low-Key Relatable', emoji: '☕', desc: 'Paint a vivid picture of a date' },
    { id: 'adventurer', label: 'Spontaneous Adventurer', emoji: '🗺️', desc: 'Active energy & travel hooks' },
  ];

  const handleGenerate = async () => {
    if (!interests.trim()) return;
    setIsLoading(true);
    try {
      const data = await api.generateBios({
        platform,
        archetype,
        interests,
        hot_take: hotTake
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
              <Award className="w-4 h-4 text-pink-400" />
              Dating Bio Architect
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Craft high-converting dating app bios and conversation-starter prompts
            </p>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">Target App</label>
            <div className="grid grid-cols-3 gap-2">
              {platforms.map((p) => {
                const isSelected = platform === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-pink-600/15 border-pink-500 text-white ring-1 ring-pink-500/30'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{p.label}</div>
                    <div className="text-[10px] text-slate-400 truncate">{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Archetype */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">Bio Persona Archetype</label>
            <div className="grid grid-cols-2 gap-2">
              {archetypes.map((a) => {
                const isSelected = archetype === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setArchetype(a.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-purple-600/15 border-purple-500 text-white ring-1 ring-purple-500/30'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-sm">{a.emoji}</span>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate">{a.label}</div>
                      <div className="text-[10px] text-slate-400 truncate">{a.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hobbies & Interests */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Your real passions & interests
            </label>
            <textarea
              rows={2}
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="E.g., bouldering, indie coffee, thrifting, sci-fi"
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
            />
          </div>

          {/* Quirky Hot Take */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Quirky controversial hot take <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={hotTake}
              onChange={(e) => setHotTake(e.target.value)}
              placeholder="E.g., Cereal is soup; Cats are better roommates than people"
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>

          {/* Button */}
          <button
            type="button"
            disabled={isLoading || !interests.trim()}
            onClick={handleGenerate}
            className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Architecting Bio Prompts...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Profile Bios</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Output */}
      <div className="lg:col-span-7 space-y-4">
        {result ? (
          <div className="space-y-4 animate-fade-in">
            {/* Header */}
            <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
                Target App: <strong className="text-pink-400 capitalize">{result.platform}</strong>
              </span>
              <RespectGuardBadge safety={result.safety_assessment} compact />
            </div>

            {/* Bio Cards */}
            <div className="space-y-3.5">
              {result.options.map((opt) => (
                <div
                  key={opt.id}
                  className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-pink-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/25">
                        {opt.headline_or_prompt}
                      </span>
                      <span className="text-[10px] text-slate-400">{opt.archetype}</span>
                    </div>

                    <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(opt.id, opt.content)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Copy"
                      >
                        {copiedId === opt.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onPreview(opt.content)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Preview"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                      </button>

                      <button
                        onClick={() =>
                          onSave({
                            id: opt.id,
                            tool: 'bio_maker',
                            text: `${opt.headline_or_prompt}: ${opt.content}`,
                            tag: opt.archetype,
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

                  <div className="text-sm font-semibold text-white bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed whitespace-pre-line select-all">
                    {opt.content}
                  </div>

                  <p className="mt-2 text-[11px] text-slate-400">
                    <strong className="text-slate-300">Hook Psychology:</strong> {opt.hook_strategy}
                  </p>
                </div>
              ))}
            </div>

            {/* Profile Tips */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Profile Conversion Advice</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                {result.profile_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-pink-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[380px]">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-3">
              <Heart className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Make your profile irresistible</h4>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              90% of profiles fail because they list generic hobbies. Bio Architect creates curiosity hooks that make matches excited to text you first.
            </p>
            <button
              onClick={handleGenerate}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-400 border border-slate-700"
            >
              Generate Sample Hinge Prompts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
