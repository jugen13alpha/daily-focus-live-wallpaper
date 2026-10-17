/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  Smartphone,
  Calendar,
  BookOpen,
  Image as ImageIcon,
  Code2,
  Palette,
  Clock,
  Sparkles,
  CheckCircle,
  ExternalLink,
  Shield,
  Layers,
  Settings,
} from 'lucide-react';
import { INITIAL_SCHEDULE, THEMES, DEFAULT_CONFIG } from './data/defaultData';
import { ScheduleBlock, WallpaperTheme, AndroidProjectConfig } from './types';
import { PhoneMockup } from './components/PhoneMockup';
import { ScheduleEditor } from './components/ScheduleEditor';
import { AndroidStudioGuide } from './components/AndroidStudioGuide';
import { PlayStoreAssetGenerator } from './components/PlayStoreAssetGenerator';
import { CodeViewer } from './components/CodeViewer';
import { generateAndroidProjectZip } from './utils/generateAndroidProject';
import { generateHtmlWallpaper } from './utils/generateHtmlWallpaper';

export default function App() {
  const [blocks, setBlocks] = useState<ScheduleBlock[]>(INITIAL_SCHEDULE);
  const [config, setConfig] = useState<AndroidProjectConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'simulator' | 'schedule' | 'guide' | 'assets' | 'code'>('simulator');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentTheme: WallpaperTheme =
    THEMES.find((t) => t.id === config.themeId) || THEMES[0];

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const zipBlob = await generateAndroidProjectZip(blocks, currentTheme, config);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DailyFocusWallpaper-AndroidStudio-v${config.versionName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsDownloading(false);
      setDownloadSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff8a24', '#ffffff', '#10b981'],
      });
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to generate zip:', err);
      setIsDownloading(false);
      alert('Error creating Android project zip package.');
    }
  };

  const handleDownloadHtmlOnly = () => {
    const html = generateHtmlWallpaper(
      blocks,
      currentTheme,
      config.priorityText,
      config.timeFormat24h,
      config.lockscreenTopPadding
    );
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daily_focus_wallpaper.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#0c0c0e]/90 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-black font-black text-sm">
              DF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Daily Focus <span className="text-amber-400">Lock Screen Studio</span>
                </h1>
                <span className="hidden md:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Android 15 (Target SDK 35)
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Package: <code className="text-zinc-300 font-mono">{config.packageName}</code> · Android Live Wallpaper (.aab & .apk)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadHtmlOnly}
              className="text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-xl border border-zinc-800 hover:bg-zinc-800/80 transition cursor-pointer"
              title="Download standalone HTML wallpaper"
            >
              Export HTML
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating Project...' : 'Download Android Studio (.ZIP)'}</span>
            </button>
          </div>
        </div>

        {/* Success toast notification */}
        {downloadSuccess && (
          <div className="max-w-7xl mx-auto mt-2.5 p-2 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <b>Ready!</b> Unzip the downloaded folder and click <b>File &gt; Open</b> in Android Studio. Check the <b>&quot;Android Studio Guide&quot;</b> tab for next steps!
              </span>
            </div>
            <button
              onClick={() => setActiveTab('guide')}
              className="font-bold underline cursor-pointer ml-3 shrink-0"
            >
              Open Guide →
            </button>
          </div>
        )}
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-zinc-800/80 bg-zinc-950/60 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 text-xs font-semibold no-scrollbar">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition cursor-pointer shrink-0 ${
              activeTab === 'simulator'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Lock Screen Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition cursor-pointer shrink-0 ${
              activeTab === 'schedule'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Editor ({blocks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition cursor-pointer shrink-0 ${
              activeTab === 'guide'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Android Studio &amp; Play Store Guide</span>
            <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.2 rounded font-bold">
              Essential
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assets')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition cursor-pointer shrink-0 ${
              activeTab === 'assets'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Play Store Asset Kit (512x512 &amp; Banner)</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition cursor-pointer shrink-0 ${
              activeTab === 'code'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Inspect Project Files</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* TAB 1: SIMULATOR & CUSTOMIZER */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Phone Live Lock Screen Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <PhoneMockup
                blocks={blocks}
                theme={currentTheme}
                priorityText={config.priorityText}
                timeFormat24h={config.timeFormat24h}
                topPadding={config.lockscreenTopPadding}
              />
            </div>

            {/* Right: Live Controls & Customizer */}
            <div className="lg:col-span-7 space-y-5">
              {/* Theme Selector */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>Color Theme &amp; Visual Style</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {THEMES.map((t) => {
                    const isSelected = t.id === config.themeId;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setConfig({ ...config, themeId: t.id })}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-zinc-800/90 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                            : 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: t.accent }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: t.cardBg }}
                          />
                        </div>
                        <span className="text-xs font-bold text-zinc-200 truncate">{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lockscreen Fitting & Time Display */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Display &amp; Clearance Options</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Time Format */}
                  <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                    <label className="text-xs font-bold text-zinc-300 block mb-2">
                      Time Format
                    </label>
                    <div className="flex rounded-lg bg-zinc-900 p-1 border border-zinc-800">
                      <button
                        onClick={() => setConfig({ ...config, timeFormat24h: true })}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                          config.timeFormat24h
                            ? 'bg-amber-500 text-black font-bold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        24-Hour (07:30)
                      </button>
                      <button
                        onClick={() => setConfig({ ...config, timeFormat24h: false })}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                          !config.timeFormat24h
                            ? 'bg-amber-500 text-black font-bold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        12-Hour (7:30 AM)
                      </button>
                    </div>
                  </div>

                  {/* Lock Screen Top Spacing */}
                  <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-zinc-300">
                        Top Padding Clearance
                      </label>
                      <span className="text-xs font-mono text-amber-400">
                        {config.lockscreenTopPadding}px
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mb-2">
                      Adjusts clearance so Android&apos;s system clock doesn&apos;t overlap headers.
                    </p>
                    <input
                      type="range"
                      min={0}
                      max={120}
                      step={4}
                      value={config.lockscreenTopPadding}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          lockscreenTopPadding: Number(e.target.value),
                        })
                      }
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Android Package Settings */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <Settings className="w-4 h-4 text-amber-400" />
                  <span>Android Package Configuration</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide block mb-1">
                      App Name
                    </label>
                    <input
                      type="text"
                      value={config.appName}
                      onChange={(e) => setConfig({ ...config, appName: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide block mb-1">
                      Package Name (Application ID)
                    </label>
                    <input
                      type="text"
                      value={config.packageName}
                      onChange={(e) => setConfig({ ...config, packageName: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide block mb-1">
                      Version Name
                    </label>
                    <input
                      type="text"
                      value={config.versionName}
                      onChange={(e) => setConfig({ ...config, versionName: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide block mb-1">
                      Version Code
                    </label>
                    <input
                      type="number"
                      value={config.versionCode}
                      onChange={(e) =>
                        setConfig({ ...config, versionCode: Number(e.target.value) || 1 })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Ready to Build CTA */}
              <div className="bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Ready to load this on your phone?</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Download the project zip, open it in Android Studio, and click Run ▶️.
                  </p>
                </div>
                <button
                  onClick={handleDownloadZip}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/10 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .ZIP</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHEDULE EDITOR */}
        {activeTab === 'schedule' && (
          <ScheduleEditor
            blocks={blocks}
            onUpdateBlocks={setBlocks}
            priorityText={config.priorityText}
            onUpdatePriority={(text) => setConfig({ ...config, priorityText: text })}
          />
        )}

        {/* TAB 3: ANDROID STUDIO & PLAY STORE GUIDE */}
        {activeTab === 'guide' && <AndroidStudioGuide config={config} />}

        {/* TAB 4: PLAY STORE ASSET KIT */}
        {activeTab === 'assets' && (
          <PlayStoreAssetGenerator theme={currentTheme} config={config} />
        )}

        {/* TAB 5: SOURCE CODE VIEWER */}
        {activeTab === 'code' && (
          <CodeViewer blocks={blocks} theme={currentTheme} config={config} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 bg-zinc-950/80 px-4 sm:px-6 py-4 mt-12 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Daily Focus Android Lock Screen Live Wallpaper Studio</span>
          <span className="text-zinc-400">
            Compliant with Android 15 &amp; Google Play Store Target SDK 35
          </span>
        </div>
      </footer>
    </div>
  );
}
