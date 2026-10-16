import React, { useState } from 'react';
import { Camera, Upload, Sparkles, Copy, Check, Smartphone, Bookmark, Eye, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { ScreenshotAnalysisResponse, SavedMessage, DeliveryAdviceResponse } from '../types';
import { api } from '../services/api';
import { RespectGuardBadge } from './RespectGuardBadge';

interface ScreenshotUploadToolProps {
  onPreview: (message: string) => void;
  onSave: (saved: SavedMessage) => void;
}

export const ScreenshotUploadTool: React.FC<ScreenshotUploadToolProps> = ({
  onPreview,
  onSave
}) => {
  const [screenshotType, setScreenshotType] = useState('instagram_story');
  const [userNote, setUserNote] = useState('They posted a sunset view at a cozy hillside cafe.');
  const [imagePreview, setImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScreenshotAnalysisResponse | null>(null);
  const [deliveryAdvice, setDeliveryAdvice] = useState<DeliveryAdviceResponse | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const samplePresets = [
    {
      name: 'Instagram Cafe Story',
      type: 'instagram_story',
      note: 'Aesthetic hillside cafe coffee shot with no location tag',
      url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Dating Bio Prompt',
      type: 'dating_profile',
      note: 'Bio says "Looking for someone to aggressively debate pizza toppings"',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Chat Screenshot',
      type: 'chat_thread',
      note: 'They replied with a dry "haha yeah" 2 hours later',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const data = await api.analyzeScreenshot({
        image_data: imagePreview || undefined,
        screenshot_type: screenshotType,
        user_note: userNote
      });
      setResult(data);

      // Also fetch delivery advice for opener #1
      if (data.suggested_openers.length > 0) {
        const advice = await api.getDeliveryAdvice({
          message: data.suggested_openers[0].text,
          relationship_stage: 'just_matched'
        });
        setDeliveryAdvice(advice);
      }
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
      {/* Left Panel */}
      <div className="lg:col-span-5 space-y-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-pink-400" />
              Screenshot Vision Reader
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload a screenshot or photo to auto-detect visual conversation hooks
            </p>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              Quick Test Presets
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {samplePresets.map((sp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setScreenshotType(sp.type);
                    setUserNote(sp.note);
                    setImagePreview(sp.url);
                  }}
                  className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-pink-500/40 text-left transition-all"
                >
                  <div className="text-[11px] font-bold text-slate-200 truncate">{sp.name}</div>
                  <div className="text-[9px] text-slate-500 truncate">{sp.type.replace('_', ' ')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dropzone / Upload frame */}
          <div className="relative border-2 border-dashed border-slate-800 hover:border-pink-500/50 rounded-2xl p-4 text-center transition-colors bg-slate-900/40">
            {imagePreview ? (
              <div className="space-y-2">
                <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center relative">
                  <img
                    src={imagePreview}
                    alt="Uploaded Screenshot"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] text-slate-300 font-medium bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                      Vision Target Ready
                    </span>
                  </div>
                </div>
                <label className="inline-block text-xs text-pink-400 font-semibold cursor-pointer hover:underline">
                  Change Image
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer block py-6">
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-300 block">Click to upload screenshot</span>
                <span className="text-[10px] text-slate-500">Supports PNG, JPG, WebP</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* What are you looking at */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Context or what you noticed <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="E.g., cute dog in photo, cool concert lighting, hiking trail"
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
            />
          </div>

          {/* Analyze Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleAnalyze}
            className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Vision Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract Openers from Screenshot</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Output Panel */}
      <div className="lg:col-span-7 space-y-4">
        {result ? (
          <div className="space-y-4 animate-fade-in">
            {/* Vision Detection Tags */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-pink-300">
                  <Eye className="w-4 h-4 text-pink-400" />
                  <span>Vision Analysis Complete</span>
                </div>
                <RespectGuardBadge safety={result.safety_assessment} compact />
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.detected_elements.map((elem, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium bg-slate-800 text-slate-200 px-2.5 py-0.5 rounded-full border border-slate-700/60"
                  >
                    ✓ {elem}
                  </span>
                ))}
              </div>
            </div>

            {/* Generated Openers */}
            <div className="space-y-3.5">
              {result.suggested_openers.map((opt) => (
                <div
                  key={opt.id}
                  className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-pink-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/25">
                      {opt.style}
                    </span>

                    <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(opt.id, opt.text)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Copy"
                      >
                        {copiedId === opt.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onPreview(opt.text)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Preview"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                      </button>

                      <button
                        onClick={() =>
                          onSave({
                            id: opt.id,
                            tool: 'screenshot_scan',
                            text: opt.text,
                            tag: opt.style,
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

                  <div className="text-sm font-semibold text-white bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed select-all">
                    “{opt.text}”
                  </div>

                  <p className="mt-2 text-[11px] text-slate-400">
                    <strong className="text-slate-300">Why it works:</strong> {opt.why_it_works}
                  </p>
                </div>
              ))}
            </div>

            {/* Delivery Timing Coach Card */}
            {deliveryAdvice && (
              <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>Delivery Timing & Voice Note Advice</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Optimal Timing: </strong>{deliveryAdvice.timing_recommendation}
                </p>
                {deliveryAdvice.voice_note_suggestion && (
                  <p className="text-xs text-slate-400 bg-slate-850 p-2.5 rounded-xl border border-slate-800">
                    🎙️ <strong>Audio / Voice Tip:</strong> {deliveryAdvice.voice_note_suggestion}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[380px]">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-3">
              <Camera className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Visual context-aware generation</h4>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Upload an Instagram story, dating bio photo, or message thread screenshot. The AI extracts environmental clues and outputs customized hooks.
            </p>
            <button
              onClick={handleAnalyze}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-400 border border-slate-700"
            >
              Analyze Preset Story Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
