import React, { useRef, useState, useEffect } from 'react';
import { Download, Image as ImageIcon, Copy, Shield, Sparkles, Check } from 'lucide-react';
import { WallpaperTheme, AndroidProjectConfig } from '../types';

interface PlayStoreAssetGeneratorProps {
  theme: WallpaperTheme;
  config: AndroidProjectConfig;
}

export const PlayStoreAssetGenerator: React.FC<PlayStoreAssetGeneratorProps> = ({
  theme,
  config,
}) => {
  const iconCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bannerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedPolicy, setCopiedPolicy] = useState(false);

  // Render 512x512 Icon
  useEffect(() => {
    const canvas = iconCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 512;
    canvas.width = size;
    canvas.height = size;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, size, size);
    bgGrad.addColorStop(0, '#131317');
    bgGrad.addColorStop(1, '#09090a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // Subtle radial glow
    const radial = ctx.createRadialGradient(size * 0.8, size * 0.2, 10, size * 0.8, size * 0.2, size * 0.6);
    radial.addColorStop(0, theme.accent + '33');
    radial.addColorStop(1, 'transparent');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, size, size);

    // Outer rounded squircle container
    const pad = 48;
    const boxSize = size - pad * 2;
    ctx.fillStyle = '#18181c';
    ctx.strokeStyle = theme.accent + '55';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(pad, pad, boxSize, boxSize, 80);
    ctx.fill();
    ctx.stroke();

    // Routine Schedule Cards simulation
    const cardX = pad + 40;
    const cardW = boxSize - 80;
    const rowH = 46;
    const startY = pad + 60;

    // Row 1 (Normal)
    ctx.fillStyle = '#222226';
    ctx.beginPath();
    ctx.roundRect(cardX, startY, cardW, rowH, 12);
    ctx.fill();
    ctx.fillStyle = '#52525b';
    ctx.fillRect(cardX, startY, 8, rowH);

    // Row 2 (Active highlighted with accent)
    const activeY = startY + rowH + 16;
    ctx.fillStyle = theme.activeCardBg;
    ctx.beginPath();
    ctx.roundRect(cardX, activeY, cardW, rowH + 6, 12);
    ctx.fill();
    ctx.fillStyle = theme.accent;
    ctx.fillRect(cardX, activeY, 10, rowH + 6);

    // Glowing dot
    ctx.shadowColor = theme.accent;
    ctx.shadowBlur = 15;
    ctx.fillStyle = theme.accent;
    ctx.beginPath();
    ctx.arc(cardX - 18, activeY + (rowH + 6) / 2, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Row 3 (Normal)
    const r3Y = activeY + rowH + 22;
    ctx.fillStyle = '#222226';
    ctx.beginPath();
    ctx.roundRect(cardX, r3Y, cardW, rowH, 12);
    ctx.fill();
    ctx.fillStyle = '#52525b';
    ctx.fillRect(cardX, r3Y, 8, rowH);

    // Big central brand text
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DAILY', size / 2, size - 128);

    ctx.fillStyle = theme.accent;
    ctx.fillText('FOCUS', size / 2, size - 80);
  }, [theme]);

  // Render 1024x500 Feature Graphic
  useEffect(() => {
    const canvas = bannerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 1024;
    const h = 500;
    canvas.width = w;
    canvas.height = h;

    // Dark sleek backdrop
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#101014');
    grad.addColorStop(0.5, '#0a0a0c');
    grad.addColorStop(1, '#18120c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Ambient glow orb on right
    const glow = ctx.createRadialGradient(780, 250, 40, 780, 250, 400);
    glow.addColorStop(0, theme.accent + '44');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Typography on Left
    ctx.textAlign = 'left';

    // Eyebrow badge
    ctx.fillStyle = theme.accent;
    ctx.font = '700 15px sans-serif';
    ctx.fillText('ANDROID LOCK SCREEN LIVE WALLPAPER', 80, 130);

    // Big Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 64px sans-serif';
    ctx.fillText('DAILY', 80, 205);
    ctx.fillStyle = theme.accent;
    ctx.fillText('FOCUS', 280, 205);

    // Subtitle
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '500 21px sans-serif';
    ctx.fillText('Discipline & Routine Tracker On Every Unlock', 80, 255);

    // Feature bullets
    const bullets = [
      '⚡ 0% Battery Waste · Automatic Sleep Engine',
      '🎯 Active Time Block Glows Dynamically',
      '🔒 High-Contrast Minimalist Aesthetic',
    ];
    ctx.font = '600 16px sans-serif';
    ctx.fillStyle = '#e4e4e7';
    bullets.forEach((b, idx) => {
      ctx.fillText(b, 80, 315 + idx * 34);
    });

    // Simulated Phone Mockup on Right
    const phoneX = 660;
    const phoneY = 40;
    const phoneW = 260;
    const phoneH = 430;

    // Phone shadow
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 35;
    ctx.fillStyle = '#050506';
    ctx.beginPath();
    ctx.roundRect(phoneX, phoneY, phoneW, phoneH, 36);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Phone outline
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Phone screen content
    ctx.fillStyle = theme.bgDark;
    ctx.beginPath();
    ctx.roundRect(phoneX + 8, phoneY + 8, phoneW - 16, phoneH - 16, 28);
    ctx.fill();

    // Mini items inside phone mockup
    ctx.fillStyle = theme.accent;
    ctx.font = '800 14px sans-serif';
    ctx.fillText('DAILY FOCUS', phoneX + 30, phoneY + 60);

    const miniRowY = phoneY + 95;
    for (let i = 0; i < 5; i++) {
      const isAct = i === 1;
      const cy = miniRowY + i * 44;
      ctx.fillStyle = isAct ? theme.activeCardBg : '#18181c';
      ctx.beginPath();
      ctx.roundRect(phoneX + 28, cy, phoneW - 56, 34, 6);
      ctx.fill();
      ctx.fillStyle = isAct ? theme.accent : '#3f3f46';
      ctx.fillRect(phoneX + 28, cy, 4, 34);

      if (isAct) {
        ctx.fillStyle = theme.accent;
        ctx.beginPath();
        ctx.arc(phoneX + 20, cy + 17, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [theme]);

  const downloadCanvas = (canvas: HTMLCanvasElement | null, filename: string) => {
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const privacyPolicyText = `# Privacy Policy for ${config.appName}

Effective Date: October 2026

**${config.appName}** ("the Application") is an Android Lock Screen Live Wallpaper developed as a personal discipline and routine tool.

### 1. Zero Data Collection
The Application does not collect, record, transmit, store, or share any personal identifiable information (PII), telemetry, location data, or device identifiers.

### 2. Local Execution & Offline Functionality
All time-block tracking and wallpaper graphics are generated and calculated locally on your device hardware. The Application operates 100% offline and makes zero external network requests.

### 3. Permissions
The Application utilizes standard Android Live Wallpaper service permissions (\`android.permission.BIND_WALLPAPER\` and \`android.permission.SET_WALLPAPER\`) strictly to render the live wallpaper surface upon device wake.

### 4. Third-Party Services & Ads
The Application does not contain any third-party advertising SDKs, analytic tracking libraries, or cookies.

### 5. Contact
For questions regarding this policy, contact the developer at jugensingh1999@gmail.com.
`;

  const copyPrivacyPolicy = () => {
    navigator.clipboard.writeText(privacyPolicyText);
    setCopiedPolicy(true);
    setTimeout(() => setCopiedPolicy(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Google Play Store Asset Kit Generator</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Google Play Store strictly requires a 512x512 app icon, a 1024x500 feature banner, and a Privacy Policy URL before allowing you to publish. Download them below!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 512x512 App Icon */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white">High-Res App Icon</h3>
                <span className="text-[11px] text-zinc-400">512 x 512 PNG (32-bit with alpha)</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                Required by Play Console
              </span>
            </div>

            <div className="flex items-center justify-center p-6 bg-zinc-950 rounded-xl border border-zinc-800/80">
              <canvas
                ref={iconCanvasRef}
                className="w-48 h-48 rounded-2xl shadow-xl border border-zinc-800"
              />
            </div>
          </div>

          <button
            onClick={() => downloadCanvas(iconCanvasRef.current, 'playstore_icon_512x512.png')}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl cursor-pointer transition border border-zinc-700"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download 512x512 Icon (.PNG)</span>
          </button>
        </div>

        {/* 1024x500 Feature Graphic */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Feature Graphic Banner</h3>
                <span className="text-[11px] text-zinc-400">1024 x 500 PNG / JPEG</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                Required by Play Console
              </span>
            </div>

            <div className="flex items-center justify-center p-4 bg-zinc-950 rounded-xl border border-zinc-800/80 overflow-hidden">
              <canvas
                ref={bannerCanvasRef}
                className="w-full max-w-[420px] aspect-[1024/500] rounded-xl shadow-xl border border-zinc-800"
              />
            </div>
          </div>

          <button
            onClick={() => downloadCanvas(bannerCanvasRef.current, 'playstore_feature_graphic_1024x500.png')}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl cursor-pointer transition border border-zinc-700"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download 1024x500 Feature Banner (.PNG)</span>
          </button>
        </div>
      </div>

      {/* Free Privacy Policy Generator */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Compliant Free Privacy Policy (Play Store Required)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Google Play requires every live wallpaper to have an active privacy policy URL. You can paste this text onto GitHub Gist, Google Docs, Notion, or a free Carrd page!
            </p>
          </div>
          <button
            onClick={copyPrivacyPolicy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-lg cursor-pointer transition"
          >
            {copiedPolicy ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPolicy ? 'Copied Policy!' : 'Copy Privacy Policy'}</span>
          </button>
        </div>

        <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-[11px] font-mono text-zinc-300 whitespace-pre-wrap max-h-56 overflow-y-auto">
          {privacyPolicyText}
        </pre>
      </div>
    </div>
  );
};
