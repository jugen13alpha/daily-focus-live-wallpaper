import React, { useState } from 'react';
import {
  Download,
  Terminal,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  Play,
  Key,
  Globe,
  HelpCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { AndroidProjectConfig } from '../types';

interface AndroidStudioGuideProps {
  config: AndroidProjectConfig;
}

export const AndroidStudioGuide: React.FC<AndroidStudioGuideProps> = ({ config }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const steps = [
    {
      id: 1,
      title: 'Open in Android Studio',
      icon: FolderOpen,
      badge: 'Beginner First Step',
    },
    {
      id: 2,
      title: 'Connect & Test on Phone',
      icon: Smartphone,
      badge: 'Live Run',
    },
    {
      id: 3,
      title: 'Apply as Lock Screen',
      icon: Play,
      badge: 'Wallpaper Setup',
    },
    {
      id: 4,
      title: 'Generate Signed Bundle (.aab)',
      icon: Key,
      badge: 'Play Store Format',
    },
    {
      id: 5,
      title: 'Publish on Google Play Console',
      icon: Globe,
      badge: 'Store Release',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Hero Box */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 border border-zinc-800 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Android Studio Ladybug / Iguana / Koala / 2024+ Compatible</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              From Downloaded ZIP to Google Play Store
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              Since you just downloaded Android Studio, follow this exact step-by-step roadmap.
              No complex command line needed — everything is done through Android Studio&apos;s friendly UI.
            </p>
          </div>
        </div>

        {/* Step Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCurrent = activeStep === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isCurrent ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                    Step {s.id}
                  </span>
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-amber-400' : 'text-zinc-500'}`} />
                </div>
                <div className="text-xs font-bold truncate">{s.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-7">
        {/* STEP 1 */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Step 1 of 5</span>
              <h3 className="text-xl font-bold text-white mt-1">Open Your Project in Android Studio</h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                How to unzip and import your project cleanly without build errors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-xs mb-3">
                  1A
                </div>
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Extract the ZIP</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Click the <b className="text-white">Download Android Studio Project (.ZIP)</b> button in the top bar. Unzip it to a convenient folder (e.g. <code className="text-amber-300 text-[11px]">Documents/DailyFocusWallpaper</code>).
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-xs mb-3">
                  1B
                </div>
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Click &quot;Open&quot;</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Start Android Studio. On the welcome splash screen, click <b className="text-white">&quot;Open&quot;</b> (or from menu: <i>File &gt; Open...</i>). Do <b>NOT</b> click &quot;New Project&quot;.
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-xs mb-3">
                  1C
                </div>
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Trust &amp; Gradle Sync</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Click <b className="text-white">&quot;Trust Project&quot;</b>. Android Studio will automatically download the Android 15 (API 35) SDK and run the Gradle sync. Wait 1-2 minutes until the bottom status bar turns blue and shows &quot;BUILD SUCCESSFUL&quot;.
                </p>
              </div>
            </div>

            <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-300">
                <b className="text-amber-300">First time using Android Studio?</b> If it prompts &quot;Android SDK 35 is missing&quot;, simply click the blue &quot;Install missing platform(s) and sync project&quot; link right in the Android Studio window. It will install it automatically!
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveStep(2)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl cursor-pointer transition"
              >
                <span>Continue to Step 2: Testing on Phone</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Step 2 of 5</span>
              <h3 className="text-xl font-bold text-white mt-1">Test the Live Wallpaper on Your Phone or Emulator</h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                You can install and test your wallpaper immediately on your real Android phone or on an Android Virtual Device (AVD).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Real Phone */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Option A: Your Real Phone (Recommended)</h4>
                    <span className="text-[11px] text-emerald-400">Fastest &amp; gives true lock screen feel</span>
                  </div>
                </div>

                <ol className="space-y-2.5 text-xs text-zinc-300 list-decimal list-inside">
                  <li>
                    On your phone: Open <b className="text-white">Settings &gt; About Phone</b>.
                  </li>
                  <li>
                    Find <b className="text-white">Build number</b> (on Samsung: <i>Software information &gt; Build number</i>) and tap it <b className="text-amber-400">7 times</b> until it says &quot;You are now a developer!&quot;.
                  </li>
                  <li>
                    Go back to <b className="text-white">Settings &gt; System &gt; Developer options</b> and toggle <b className="text-white">USB Debugging</b> ON.
                  </li>
                  <li>
                    Plug your phone into your PC/Mac with a USB cable. On your phone screen, tap <b className="text-white">&quot;Always allow from this computer&quot;</b> and OK.
                  </li>
                  <li>
                    In Android Studio&apos;s top toolbar, click the device dropdown (it will now show your phone&apos;s model name, e.g. <i>Samsung SM-S928B</i> or <i>Pixel 8</i>).
                  </li>
                  <li>
                    Click the green <b className="text-emerald-400">Run ▶️</b> button (or press <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">Shift + F10</kbd>).
                  </li>
                </ol>
              </div>

              {/* Emulator */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Option B: Android Studio Emulator</h4>
                    <span className="text-[11px] text-blue-400">Virtual phone on your desktop</span>
                  </div>
                </div>

                <ol className="space-y-2.5 text-xs text-zinc-300 list-decimal list-inside">
                  <li>
                    In Android Studio, click the <b className="text-white">Device Manager</b> icon in the right-hand panel (phone icon).
                  </li>
                  <li>
                    Click <b className="text-white">&quot;+ Create Virtual Device&quot;</b>.
                  </li>
                  <li>
                    Select <b className="text-white">Pixel 8</b> or <b className="text-white">Pixel 7</b> &gt; Click <b className="text-white">Next</b>.
                  </li>
                  <li>
                    Under the <b className="text-white">Recommended</b> tab, download <b className="text-white">UpsideDownCake (API 34)</b> or <b className="text-white">VanillaIceCream (API 35)</b>.
                  </li>
                  <li>
                    Click <b className="text-white">Finish</b>.
                  </li>
                  <li>
                    Select the virtual device in the top toolbar dropdown and click the green <b className="text-emerald-400">Run ▶️</b> button.
                  </li>
                </ol>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setActiveStep(1)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Back to Step 1
              </button>
              <button
                onClick={() => setActiveStep(3)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl cursor-pointer transition"
              >
                <span>Continue to Step 3: Apply as Lock Screen</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Step 3 of 5</span>
              <h3 className="text-xl font-bold text-white mt-1">Activating as Lock Screen Live Wallpaper</h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                How Android handles lock screen live wallpapers and how to select both Home &amp; Lock screen.
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Tap &quot;Apply as Lock Screen Wallpaper&quot; in the App</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    When the app launches on your phone, you&apos;ll see the Daily Focus companion home screen. Tap the large amber button: <b className="text-white">&quot;Apply as Lock Screen Wallpaper&quot;</b>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Review the Live Preview</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Android&apos;s system Live Wallpaper picker will pop up, rendering your customized routine schedule in real time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Select &quot;Home screen and lock screen&quot;</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Tap <b className="text-white">&quot;Set Wallpaper&quot;</b> (or &quot;Apply&quot;). Android will ask where to set it. Choose <b className="text-amber-400">&quot;Home screen and lock screen&quot;</b>!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-300">Test Your Lock Screen!</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Press the physical power button on your phone to lock it. Then press it again or tap to wake: your daily schedule is right there on your lock screen with the current block glowing!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setActiveStep(2)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Back to Step 2
              </button>
              <button
                onClick={() => setActiveStep(4)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl cursor-pointer transition"
              >
                <span>Continue to Step 4: Generating AAB</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Step 4 of 5</span>
              <h3 className="text-xl font-bold text-white mt-1">Generate Signed Android App Bundle (.aab)</h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Google Play Store requires an <b className="text-white">.aab</b> file (not a standard .apk) signed with a private Keystore. Here is how to create one in 60 seconds:
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white font-bold text-xs mb-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Open the Signed Bundle Wizard</span>
                </div>
                <p className="text-xs text-zinc-400 ml-7">
                  In Android Studio&apos;s top menu bar, click:
                  <br />
                  <code className="text-amber-300 bg-zinc-900 px-2 py-1 rounded inline-block mt-1 font-mono text-[11px]">
                    Build &gt; Generate Signed Bundle / APK...
                  </code>
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white font-bold text-xs mb-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Select &quot;Android App Bundle&quot;</span>
                </div>
                <p className="text-xs text-zinc-400 ml-7">
                  Choose the first radio option: <b className="text-white">Android App Bundle</b>. Click <b className="text-white">Next</b>.
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white font-bold text-xs mb-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>Create Your Release Keystore</span>
                </div>
                <div className="text-xs text-zinc-400 ml-7 space-y-2">
                  <p>
                    Under &quot;Key store path&quot;, click <b className="text-white">&quot;Create new...&quot;</b>:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300">
                    <li><b>Key store path:</b> Click folder icon and choose where to save (e.g. <code>my-release-key.jks</code> in your Documents).</li>
                    <li><b>Password:</b> Create a strong password (and write it down!).</li>
                    <li><b>Alias:</b> Enter <code>upload</code> or <code>dailyfocus</code>.</li>
                    <li><b>Key Password:</b> Re-enter your password.</li>
                    <li><b>Validity (years):</b> Leave at <code>25</code>.</li>
                    <li><b>Certificate:</b> Enter your name or company in &quot;First and Last Name&quot;.</li>
                  </ul>
                  <p>Click <b className="text-white">OK</b>.</p>
                </div>
              </div>

              <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-zinc-300">
                  <b className="text-amber-300">CRITICAL RULE: Backup your Keystore file (.jks)!</b>
                  <br />
                  If you ever lose your Keystore or its password, Google Play will <b className="text-white">never</b> allow you to update this app. Save a copy on Google Drive, USB, or your password manager.
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white font-bold text-xs mb-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">
                    4
                  </span>
                  <span>Build Variant &gt; Release</span>
                </div>
                <p className="text-xs text-zinc-400 ml-7">
                  Click <b className="text-white">Next</b>. Select the <b className="text-emerald-400 font-mono">release</b> build variant. Click <b className="text-white">Create</b>.
                  <br />
                  In about 60 seconds, a notification popup in the bottom right will state:
                  <br />
                  <span className="text-emerald-400 font-semibold">&quot;App bundle(s) generated successfully for module &apos;app&apos;&quot;</span>. Click <b className="text-white">&quot;locate&quot;</b> to reveal the file:
                  <code className="text-amber-300 bg-zinc-900 px-1.5 py-0.5 rounded text-[11px] block mt-1">
                    app/release/app-release.aab
                  </code>
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setActiveStep(3)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Back to Step 3
              </button>
              <button
                onClick={() => setActiveStep(5)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl cursor-pointer transition"
              >
                <span>Continue to Step 5: Play Console</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Step 5 of 5</span>
              <h3 className="text-xl font-bold text-white mt-1">Publish to the Google Play Store</h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Submitting your app to Google Play Console with guaranteed zero-rejection metadata.
              </p>
            </div>

            <div className="space-y-4">
              {/* Checklist */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-3">
                  Google Play Console Setup Checklist
                </h4>

                <div className="space-y-3 text-xs text-zinc-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <b className="text-white">1. Developer Account:</b> Go to <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="text-amber-400 underline inline-flex items-center gap-0.5">play.google.com/console <ExternalLink className="w-3 h-3" /></a> and pay the one-time $25 Google registration fee if you haven&apos;t yet.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <b className="text-white">2. Create App:</b> Click &quot;Create App&quot; &gt; Name: <b>{config.appName}</b> &gt; Type: <b>App</b> &gt; Free or Paid: <b>Free</b> &gt; Accept Declarations.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <b className="text-white">3. App Content &amp; Data Safety Form:</b>
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-zinc-400">
                        <li><b>Data Safety:</b> Answer <span className="text-emerald-400 font-semibold">&quot;No, this app does not collect or share user data&quot;</span>. (Instant green checkmark!)</li>
                        <li><b>Ads:</b> Select <span className="text-emerald-400 font-semibold">&quot;No, my app does not contain ads&quot;</span>.</li>
                        <li><b>Target Audience:</b> Select 18+ (avoids strict Families Policy questionnaires).</li>
                        <li><b>Government apps / Financial features:</b> Select No.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <b className="text-white">4. Store Listing Assets:</b>
                      <p className="text-zinc-400 mt-0.5">
                        Switch to our <b className="text-white">&quot;Play Store Asset Kit&quot;</b> tab above to download:
                      </p>
                      <ul className="list-disc list-inside text-zinc-400 mt-1">
                        <li>512x512 App Icon PNG</li>
                        <li>1024x500 Feature Graphic PNG</li>
                        <li>Phone Screenshots</li>
                        <li>Free Privacy Policy URL/Text</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <b className="text-white">5. Upload the .aab File:</b>
                      <p className="text-zinc-400 mt-0.5">
                        In Play Console left sidebar: go to <b className="text-white">Production</b> (or <i>Internal testing</i>) &gt; Click <b className="text-white">Create new release</b> &gt; Drag and drop your <code className="text-amber-300">app-release.aab</code> &gt; Click <b className="text-white">Next &gt; Save &gt; Review Release &gt; Start rollout to Production</b>!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ready-to-copy Store Listing Text */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                    Pre-Written Store Listing Copy (Ready to Paste)
                  </h4>
                  <button
                    onClick={() =>
                      handleCopy(
                        `App Title: ${config.appName}\n\nShort Description:\nDynamic daily routine lock screen live wallpaper. Highlights your active time block.\n\nFull Description:\nTransform your Android lock screen into a daily discipline hub.\n\nDaily Focus is a clean, battery-efficient lock screen live wallpaper that displays your daily schedule and automatically illuminates your current active routine block throughout the day.\n\nFeatures:\n• Dynamic time-block tracking (automatically updates current block)\n• 0% battery waste (sleeps when screen is locked)\n• Cyberpunk dark mode aesthetic with high-contrast amber highlights\n• Clean typography and zero ad clutter\n• Completely offline with zero data collection\n\nBuild discipline, stay on track, and achieve your targets one block at a time.`,
                        'listing'
                      )
                    }
                    className="flex items-center gap-1 px-2.5 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg cursor-pointer transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === 'listing' ? 'Copied!' : 'Copy All Copy'}</span>
                  </button>
                </div>

                <div className="text-xs space-y-2 text-zinc-300 font-mono bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <div>
                    <span className="text-zinc-500">App Name (30 chars max):</span>
                    <div className="text-amber-300 font-bold">{config.appName}</div>
                  </div>
                  <div>
                    <span className="text-zinc-500">Short Description (80 chars max):</span>
                    <div className="text-zinc-200">
                      Dynamic daily routine live wallpaper for lock screen with active block tracking.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-start">
              <button
                onClick={() => setActiveStep(4)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Back to Step 4
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Beginner FAQs Accordion */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Android Studio Beginner Troubleshooting &amp; FAQs</span>
        </h3>

        <div className="space-y-2 text-xs">
          {[
            {
              q: 'What if Gradle sync says: "Unsupported Java version"?',
              a: 'In Android Studio, go to Settings (or Preferences on Mac) > Build, Execution, Deployment > Build Tools > Gradle. Under "Gradle JDK", ensure it is set to "Embedded JDK 17" or "JDK 21".',
            },
            {
              q: 'Why does Android Studio say "SDK location not found"?',
              a: 'Go to File > Project Structure > SDK Location, and make sure your Android SDK path is populated (Android Studio defaults to /Users/<name>/Library/Android/sdk on Mac, or C:\\Users\\<name>\\AppData\\Local\\Android\\Sdk on Windows).',
            },
            {
              q: 'Can this run strictly on Lock Screen without replacing Home Screen?',
              a: 'On stock Android (Google Pixel, Motorola, Sony), Live Wallpapers are applied to "Home Screen" or "Home Screen and Lock Screen". By choosing "Home and Lock", your lock screen gets the live routine, while you can also keep your home screen clean. On Samsung OneUI, you can independently pick Lock Screen under Settings > Wallpaper and Style > Lock Screen.',
            },
            {
              q: 'Does this live wallpaper drain my phone battery?',
              a: 'No! The Kotlin LiveWallpaperService implements onVisibilityChanged(visible: Boolean). The instant your phone screen turns off (or you open another app), all WebView rendering and intervals are completely suspended.',
            },
            {
              q: 'What is the difference between an APK and an AAB?',
              a: 'An APK is the standalone package you install directly on your phone. An AAB (Android App Bundle) is Google Play Store\'s modern publishing format where Google automatically generates optimized device-specific APKs for each user.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="border border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-950"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-3 flex items-center justify-between font-semibold text-zinc-200 hover:text-white cursor-pointer"
              >
                <span>{item.q}</span>
                {openFaq === idx ? (
                  <ChevronDown className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-3 pb-3 pt-1 text-zinc-400 border-t border-zinc-800/60 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
