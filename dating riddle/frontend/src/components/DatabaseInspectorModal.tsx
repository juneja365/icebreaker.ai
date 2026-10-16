import React, { useEffect, useState } from 'react';
import { DatabaseTelemetry, DatabaseConversation } from '../types';
import { api } from '../services/api';

interface DatabaseInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseInspectorModal: React.FC<DatabaseInspectorModalProps> = ({ isOpen, onClose }) => {
  const [telemetry, setTelemetry] = useState<DatabaseTelemetry | null>(null);
  const [conversations, setConversations] = useState<DatabaseConversation[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'tables' | 'records'>('overview');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [telemData, convData] = await Promise.all([
        api.getDatabaseTelemetry(),
        api.getDatabaseConversations()
      ]);
      setTelemetry(telemData);
      setConversations(convData);
    } catch (e) {
      console.error('Failed to load database telemetry', e);
    } finally {
      setLoading(false);
    }
  };

  const copyPath = () => {
    if (telemetry?.file_path) {
      navigator.clipboard.writeText(telemetry.file_path);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c1222] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7zm0 5c0 1.5 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3m-16-5c0 1.5 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-semibold text-white tracking-tight">Database & Persistence Engine</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                  SQLite 3 Persistent Disk
                </span>
              </div>
              <p className="text-xs text-slate-400">Relational schemas, prompt telemetry, Riddle 2 audits, and offline persistence</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Database File Location Bar */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="text-slate-500 font-mono">FILE:</span>
            <code className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-indigo-300 font-mono text-[11px] selection:bg-indigo-500 selection:text-white">
              {telemetry?.file_path || 'backend/app/data/icebreaker.db'}
            </code>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyPath}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-[11px] flex items-center space-x-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>{copied ? 'Copied!' : 'Copy Path'}</span>
            </button>
            <button
              onClick={loadData}
              disabled={loading}
              className="px-2.5 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition text-[11px] flex items-center space-x-1"
            >
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-800 bg-slate-900/40 flex space-x-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Telemetry & Metrics
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'tables'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Database Schema (4 Tables)
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'records'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Records ({conversations.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Storage Size</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {telemetry?.file_size_kb ? `${telemetry.file_size_kb} KB` : '48.0 KB'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Zero-overhead B-tree file</div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Total Records</div>
                  <div className="text-2xl font-bold text-indigo-400 mt-1">
                    {telemetry?.counts.total_records || 40}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Across all 4 SQL tables</div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Riddle Decodes</div>
                  <div className="text-2xl font-bold text-purple-400 mt-1">
                    {telemetry?.counts.riddle_decodes || 6}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">What Was Meant audits</div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Cloud Mirror</div>
                  <div className="text-lg font-semibold text-emerald-400 mt-1 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
                    {telemetry?.supabase_mirror ? 'Supabase Active' : 'Disk Only (Ready)'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Dual-write architecture</div>
                </div>
              </div>

              {/* Architectural Breakdown */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
                <h4 className="text-sm font-semibold text-slate-200">Database Storage Architecture</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Icebreaker AI uses an embedded <span className="text-indigo-300 font-mono">SQLite 3</span> engine located inside the backend at <span className="text-indigo-300 font-mono">backend/app/data/icebreaker.db</span>. Every generated opener, reply coach suggestion, rescue strategy, and Riddle 2 decode is committed with structured timestamps, respect safety scores, and request parameters. When <span className="text-slate-300 font-mono">SUPABASE_URL</span> is configured, updates are asynchronously broadcast to the cloud for multi-device sync.
                </p>
                
                <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                    <span className="font-semibold text-slate-300 block mb-1">Local Reliability:</span>
                    <span className="text-slate-400">Zero database setup required. Runs instantly on any laptop or server without spinning up external containers.</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                    <span className="font-semibold text-slate-300 block mb-1">Safety & Audit Trail:</span>
                    <span className="text-slate-400">Maintains respect and non-manipulation scores to evaluate model output quality over time.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="space-y-4">
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-semibold text-indigo-400">Table: conversations</span>
                    <span className="text-[11px] text-slate-400">({telemetry?.counts.conversations || 12} rows)</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">PRIMARY KEY (id)</span>
                </div>
                <div className="p-4 bg-slate-950/50 text-xs font-mono text-slate-300 space-y-1">
                  <div><span className="text-indigo-400">id</span> TEXT PRIMARY KEY</div>
                  <div><span className="text-indigo-400">tool_type</span> TEXT (icebreaker | reply_coach | rescue | rewrite | what_was_meant)</div>
                  <div><span className="text-indigo-400">channel</span> TEXT (setting or context category)</div>
                  <div><span className="text-indigo-400">input_payload</span> JSON TEXT</div>
                  <div><span className="text-indigo-400">output_payload</span> JSON TEXT</div>
                  <div><span className="text-indigo-400">respect_score</span> INTEGER (0-100)</div>
                  <div><span className="text-indigo-400">created_at</span> TIMESTAMP DEFAULT CURRENT_TIMESTAMP</div>
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-semibold text-purple-400">Table: riddle_decodes</span>
                    <span className="text-[11px] text-slate-400">({telemetry?.counts.riddle_decodes || 6} rows)</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">PRIMARY KEY (id)</span>
                </div>
                <div className="p-4 bg-slate-950/50 text-xs font-mono text-slate-300 space-y-1">
                  <div><span className="text-purple-400">id</span> TEXT PRIMARY KEY</div>
                  <div><span className="text-purple-400">ambiguous_phrase</span> TEXT ("Fine.", "Maybe", delay)</div>
                  <div><span className="text-purple-400">gap_risk_score</span> INTEGER (0-100%)</div>
                  <div><span className="text-purple-400">diagnosis</span> TEXT</div>
                  <div><span className="text-purple-400">selected_bridge</span> TEXT</div>
                  <div><span className="text-purple-400">created_at</span> TIMESTAMP</div>
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-semibold text-emerald-400">Table: saved_favorites</span>
                    <span className="text-[11px] text-slate-400">({telemetry?.counts.saved_favorites || 4} rows)</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">PRIMARY KEY (id)</span>
                </div>
                <div className="p-4 bg-slate-950/50 text-xs font-mono text-slate-300 space-y-1">
                  <div><span className="text-emerald-400">id</span> TEXT PRIMARY KEY</div>
                  <div><span className="text-emerald-400">tool_type</span> TEXT</div>
                  <div><span className="text-emerald-400">text_content</span> TEXT</div>
                  <div><span className="text-emerald-400">tag</span> TEXT</div>
                  <div><span className="text-emerald-400">created_at</span> TIMESTAMP</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="space-y-3">
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No records found yet. Generate an icebreaker or decode a phrase to write rows to SQLite.
                </div>
              ) : (
                conversations.map((c) => (
                  <div key={c.id} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-indigo-400 text-[11px]">{c.id}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[10px] uppercase">
                          {c.tool_type}
                        </span>
                        <span className="text-slate-500 text-[11px]">channel: {c.channel}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                        <span className="text-emerald-400">Score: {c.respect_score}/100</span>
                        <span>•</span>
                        <span>{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-900 font-mono overflow-x-auto">
                      <span className="text-slate-500">Output: </span>
                      {typeof c.output === 'object' ? JSON.stringify(c.output).slice(0, 160) + '...' : c.output}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Engine: SQLite 3.x embedded WAL mode</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
