import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { IcebreakerTool } from './components/IcebreakerTool';
import { ReplyCoachTool } from './components/ReplyCoachTool';
import { RescueTool } from './components/RescueTool';
import { StyleRewriterTool } from './components/StyleRewriterTool';
import { BioArchitectTool } from './components/BioArchitectTool';
import { ScreenshotUploadTool } from './components/ScreenshotUploadTool';
import { WhatWasMeantTool } from './components/WhatWasMeantTool';
import { PhoneSimulator } from './components/PhoneSimulator';
import { JudgeDemos } from './components/JudgeDemos';
import { SavedFavoritesModal } from './components/SavedFavoritesModal';
import { SettingsModal } from './components/SettingsModal';
import { DatabaseInspectorModal } from './components/DatabaseInspectorModal';
import { ToolType, Scenario, SavedMessage, ThemeMode, CustomBranding } from './types';
import { api } from './services/api';

export function App() {
  const [activeTool, setActiveTool] = useState<ToolType>('icebreaker');
  const [previewMessage, setPreviewMessage] = useState<string | null>(null);
  const [rewriteInitialMessage, setRewriteInitialMessage] = useState<string>('');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  // Theme Customization
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('ICEBREAKER_THEME') as ThemeMode) || 'sunset';
  });

  // Custom Branding
  const [branding, setBranding] = useState<CustomBranding>(() => {
    try {
      const saved = localStorage.getItem('ICEBREAKER_BRANDING');
      return saved ? JSON.parse(saved) : {
        appName: 'Icebreaker AI',
        tagline: 'Turn awkward silences into natural conversations',
        logoEmoji: '🧊'
      };
    } catch {
      return {
        appName: 'Icebreaker AI',
        tagline: 'Turn awkward silences into natural conversations',
        logoEmoji: '🧊'
      };
    }
  });

  // Modals
  const [isDemosOpen, setIsDemosOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);

  // Backend Health
  const [backendStatus, setBackendStatus] = useState<{
    status: string;
    engine: string;
    llm_key_present: boolean;
  }>({
    status: 'checking',
    engine: 'Zero Latency AI',
    llm_key_present: false,
  });

  // Saved messages
  const [favorites, setFavorites] = useState<SavedMessage[]>(() => {
    try {
      const saved = localStorage.getItem('ICEBREAKER_FAVORITES');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast feedback
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    // Apply theme class to body
    document.body.className = `theme-${theme}`;
    localStorage.setItem('ICEBREAKER_THEME', theme);
  }, [theme]);

  useEffect(() => {
    // Check backend health
    api.getHealth().then(setBackendStatus);
    // Load scenarios
    api.getScenarios().then(setScenarios);
  }, []);

  const handleSaveMessage = async (saved: SavedMessage) => {
    const updated = [saved, ...favorites.filter(f => f.text !== saved.text)];
    setFavorites(updated);
    localStorage.setItem('ICEBREAKER_FAVORITES', JSON.stringify(updated));
    
    // Sync directly to backend SQLite database (icebreaker.db)
    try {
      await api.saveFavorite({
        id: saved.id,
        tool_type: saved.tool,
        text_content: saved.text,
        tag: saved.tag
      });
    } catch (e) {
      console.warn('SQLite sync queued or local mode active', e);
    }

    showToast('Saved to SQLite database & favorites!');
  };

  const handleRemoveFavorite = (id: string) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('ICEBREAKER_FAVORITES', JSON.stringify(updated));
  };

  const handleClearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('ICEBREAKER_FAVORITES');
    showToast('Favorites cleared');
  };

  const handleSendToRewrite = (msg: string) => {
    setRewriteInitialMessage(msg);
    setActiveTool('rewrite');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleSelectScenario = (sc: Scenario) => {
    setActiveTool(sc.recommended_tool);
    showToast(`Loaded scenario: ${sc.title}`);
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-100 selection:bg-pink-500 selection:text-white transition-colors duration-500">
      {/* Navigation */}
      <Navbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        theme={theme}
        setTheme={setTheme}
        branding={branding}
        onOpenDemos={() => setIsDemosOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDatabase={() => setIsDatabaseOpen(true)}
        backendStatus={backendStatus}
        savedCount={favorites.length}
      />

      {/* Main Hero Header */}
      <Hero branding={branding} />

      {/* Main Tool Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pb-16 pt-2">
        {activeTool === 'icebreaker' && (
          <IcebreakerTool
            onPreview={(msg) => setPreviewMessage(msg)}
            onSave={handleSaveMessage}
            onSendToRewrite={handleSendToRewrite}
          />
        )}

        {activeTool === 'reply_coach' && (
          <ReplyCoachTool
            onPreview={(msg) => setPreviewMessage(msg)}
            onSave={handleSaveMessage}
            onSendToRewrite={handleSendToRewrite}
          />
        )}

        {activeTool === 'what_was_meant' && (
          <WhatWasMeantTool
            onPreview={(msg) => setPreviewMessage(msg)}
            onSave={handleSaveMessage}
          />
        )}

        {activeTool === 'rescue' && (
          <RescueTool
            onPreview={(msg) => setPreviewMessage(msg)}
            onSave={handleSaveMessage}
            onSendToRewrite={handleSendToRewrite}
          />
        )}

        {activeTool === 'rewrite' && (
          <StyleRewriterTool
            initialMessage={rewriteInitialMessage}
            onPreview={(msg) => setPreviewMessage(msg)}
            onSave={handleSaveMessage}
          />
        )}

        {activeTool === 'bio_maker' && (
          <BioArchitectTool
            onPreview={(msg) => setPreviewMessage(msg)}
            onSave={handleSaveMessage}
          />
        )}

        {activeTool === 'screenshot_scan' && (
          <ScreenshotUploadTool
            onPreview={(msg) => setPreviewMessage(msg)}
            onSave={handleSaveMessage}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">{branding.appName}</span>
            <span>• Build Night Pitch Edition</span>
          </div>
          <div>
            FastAPI + React TypeScript + Respectful Conversation Guard + Vision Reader
          </div>
          <div className="text-slate-600">
            © 2026 {branding.appName}
          </div>
        </div>
      </footer>

      {/* Phone Simulator Modal */}
      {previewMessage && (
        <PhoneSimulator
          message={previewMessage}
          onClose={() => setPreviewMessage(null)}
        />
      )}

      {/* Judge Demos Modal */}
      {isDemosOpen && (
        <JudgeDemos
          scenarios={scenarios}
          onSelectScenario={handleSelectScenario}
          onClose={() => setIsDemosOpen(false)}
        />
      )}

      {/* Favorites Modal */}
      {isFavoritesOpen && (
        <SavedFavoritesModal
          favorites={favorites}
          onRemove={handleRemoveFavorite}
          onClear={handleClearFavorites}
          onClose={() => setIsFavoritesOpen(false)}
        />
      )}

      {/* Settings & Custom Branding Modal */}
      {isSettingsOpen && (
        <SettingsModal
          backendStatus={backendStatus}
          branding={branding}
          onUpdateBranding={setBranding}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Database Inspector Modal */}
      {isDatabaseOpen && (
        <DatabaseInspectorModal
          isOpen={isDatabaseOpen}
          onClose={() => setIsDatabaseOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-pink-500/50 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-pink-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default App;
