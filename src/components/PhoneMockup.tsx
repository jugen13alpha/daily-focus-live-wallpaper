import React, { useState, useEffect } from 'react';
import { ScheduleBlock, WallpaperTheme } from '../types';
import { Wifi, BatteryMedium, Signal, Lock, Clock, Sparkles } from 'lucide-react';

interface PhoneMockupProps {
  blocks: ScheduleBlock[];
  theme: WallpaperTheme;
  priorityText: string;
  timeFormat24h: boolean;
  topPadding: number;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  blocks,
  theme,
  priorityText,
  timeFormat24h,
  topPadding,
}) => {
  const [simulatedMinutes, setSimulatedMinutes] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showAndroidSystemClock, setShowAndroidSystemClock] = useState<boolean>(true);

  // Tick current time every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const effectiveMinutes =
    simulatedMinutes !== null
      ? simulatedMinutes
      : currentTime.getHours() * 60 + currentTime.getMinutes();

  const parseMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // Find active block index
  let activeIndex = blocks.findIndex((b) => {
    const s = parseMinutes(b.start);
    const e = parseMinutes(b.end);
    return effectiveMinutes >= s && effectiveMinutes < e;
  });

  if (activeIndex === -1 && blocks.length > 0) {
    const firstStart = parseMinutes(blocks[0].start);
    if (effectiveMinutes < firstStart) {
      activeIndex = blocks.length - 1; // night/sleep
    }
  }

  const formatDisplayTime = (minutesTotal: number) => {
    const h = Math.floor(minutesTotal / 60);
    const m = minutesTotal % 60;
    if (timeFormat24h) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const currentDisplayTimeStr = formatDisplayTime(effectiveMinutes);

  return (
    <div className="flex flex-col items-center">
      {/* Time scrubbing simulator bar */}
      <div className="w-full max-w-[360px] bg-zinc-900 border border-zinc-800 rounded-xl p-3 mb-4 text-xs text-zinc-300">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 font-medium text-zinc-200">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Time Simulator</span>
            {simulatedMinutes !== null ? (
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-mono">
                Manual: {currentDisplayTimeStr}
              </span>
            ) : (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                Live: {currentDisplayTimeStr}
              </span>
            )}
          </div>
          {simulatedMinutes !== null && (
            <button
              onClick={() => setSimulatedMinutes(null)}
              className="text-[11px] text-zinc-400 hover:text-white underline cursor-pointer"
            >
              Reset to Live
            </button>
          )}
        </div>

        <input
          type="range"
          min={0}
          max={1439}
          value={effectiveMinutes}
          onChange={(e) => setSimulatedMinutes(Number(e.target.value))}
          className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />

        <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1.5">
          <span>00:00</span>
          <span>12:00</span>
          <span>23:59</span>
        </div>

        <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showAndroidSystemClock}
              onChange={(e) => setShowAndroidSystemClock(e.target.checked)}
              className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-0"
            />
            <span className="text-[11px] text-zinc-400">Show System Lock Clock</span>
          </label>
          <span className="text-[10px] text-zinc-500">
            Active: <span className="text-zinc-300 font-semibold">{blocks[activeIndex]?.title || 'None'}</span>
          </span>
        </div>
      </div>

      {/* Realistic Phone Bezel Frame */}
      <div className="relative w-[340px] sm:w-[360px] h-[720px] bg-black rounded-[46px] p-[10px] shadow-2xl ring-1 ring-zinc-700/80 shadow-black/80 flex flex-col overflow-hidden select-none">
        {/* Outer chassis volume buttons & power button hints */}
        <div className="absolute -left-[12px] top-[140px] w-[3px] h-[45px] bg-zinc-700 rounded-l-md" />
        <div className="absolute -left-[12px] top-[195px] w-[3px] h-[45px] bg-zinc-700 rounded-l-md" />
        <div className="absolute -right-[12px] top-[160px] w-[3px] h-[65px] bg-zinc-700 rounded-r-md" />

        {/* Screen Bezel Inner */}
        <div
          className="relative w-full h-full rounded-[38px] overflow-hidden flex flex-col"
          style={{ backgroundColor: theme.bgDark }}
        >
          {/* Ambient subtle glow from wallpaper theme */}
          <div
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-20"
            style={{ backgroundColor: theme.accent }}
          />

          {/* Android Status Bar */}
          <div className="relative z-30 h-8 px-5 pt-1.5 flex items-center justify-between text-zinc-300 text-[11px] font-semibold tracking-tight">
            <span>{currentDisplayTimeStr.split(' ')[0]}</span>

            {/* Camera Punchhole / Dynamic Island */}
            <div className="w-4 h-4 rounded-full bg-black ring-1 ring-zinc-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
            </div>

            <div className="flex items-center gap-1.5 text-zinc-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-0.5">
                <span className="text-[9px]">100%</span>
                <BatteryMedium className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Optional Android System Lock Screen Big Clock Overlay */}
          {showAndroidSystemClock && (
            <div className="relative z-20 pt-1 pb-1 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-[10px] tracking-wider uppercase text-zinc-400 font-medium">
                <Lock className="w-2.5 h-2.5 text-zinc-400" />
                <span>Swipe to unlock</span>
              </div>
              <div className="text-4xl font-extrabold tracking-tighter text-white/90 drop-shadow-md">
                {currentDisplayTimeStr}
              </div>
              <div className="text-[10px] text-zinc-400 font-medium tracking-wide">
                {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
          )}

          {/* Wallpaper Content Container */}
          <div
            className="relative z-10 flex-1 px-3 pb-4 overflow-y-auto"
            style={{
              paddingTop: `${topPadding}px`,
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-2 mb-2">
              <div>
                <div className="text-[9px] tracking-[0.24em] font-semibold text-zinc-400 uppercase">
                  DAILY SYSTEM
                </div>
                <h1 className="text-2xl font-black leading-[0.95] tracking-wide text-zinc-100">
                  DAILY<br />
                  <span style={{ color: theme.accent }}>FOCUS</span>
                </h1>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold font-mono tracking-tight text-white">
                  {currentDisplayTimeStr}
                </div>
                <div
                  className="text-[8px] font-bold tracking-[0.18em] uppercase mt-0.5"
                  style={{ color: theme.accent }}
                >
                  CURRENT BLOCK
                </div>
              </div>
            </div>

            {/* Priority Banner */}
            <div
              className="text-[10px] tracking-wide text-zinc-300 px-2.5 py-1.5 my-2.5 rounded-r bg-white/[0.04] backdrop-blur-sm"
              style={{
                borderLeft: `3px solid ${theme.accent}`,
              }}
            >
              {priorityText.split('\n').map((line, idx) => (
                <div key={idx} className={idx === 0 ? 'font-bold' : 'text-zinc-400 text-[9.5px]'}>
                  {idx === 0 ? <span style={{ color: theme.accent }}>{line}</span> : line}
                </div>
              ))}
            </div>

            {/* List of Time Blocks */}
            <div className="flex flex-col gap-1">
              {blocks.map((b, i) => {
                const isActive = i === activeIndex;
                return (
                  <div
                    key={b.id || i}
                    className={`grid items-center min-h-[36px] transition-all duration-300 ${
                      isActive ? 'scale-[1.01]' : 'opacity-85'
                    }`}
                    style={{
                      gridTemplateColumns: '46px 16px 24px minmax(0, 1fr)',
                      gap: '5px',
                    }}
                  >
                    {/* Time */}
                    <div
                      className="text-[11px] font-mono font-semibold"
                      style={{
                        color: isActive ? theme.accent : theme.muted,
                      }}
                    >
                      {b.start}
                    </div>

                    {/* Dot */}
                    <div className="flex items-center justify-center">
                      <div
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: isActive ? '7px' : '5px',
                          height: isActive ? '7px' : '5px',
                          backgroundColor: isActive ? theme.accent : '#52525b',
                          boxShadow: isActive
                            ? `0 0 8px ${theme.accentGlow}, 0 0 0 2px rgba(255,255,255,0.15)`
                            : 'none',
                        }}
                      />
                    </div>

                    {/* Icon */}
                    <div
                      className="text-center text-sm leading-none"
                      style={{
                        color: isActive ? theme.accent : theme.muted,
                      }}
                    >
                      {b.icon}
                    </div>

                    {/* Card */}
                    <div
                      className="rounded p-1.5 min-w-0 transition-all duration-300"
                      style={{
                        backgroundColor: isActive ? theme.activeCardBg : theme.cardBg,
                        borderLeft: `3px solid ${isActive ? theme.accent : '#3f3f46'}`,
                      }}
                    >
                      <div
                        className="text-[11px] font-extrabold tracking-wide truncate"
                        style={{
                          color: isActive ? theme.accent : '#f4f4f5',
                        }}
                      >
                        {b.title}
                      </div>
                      {b.subtitle && (
                        <div className="text-[9px] text-zinc-400 truncate mt-0.5">
                          {b.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-3 pt-2 border-t border-white/10 text-[8px] font-bold tracking-[0.16em] text-zinc-500 uppercase flex justify-between">
              <span>ONE BLOCK AT A TIME</span>
              <span style={{ color: theme.accent }}>DISCIPLINE → FREEDOM</span>
            </div>
          </div>

          {/* Android Bottom Navigation Bar / Gesture Bar Pill */}
          <div className="relative z-30 h-4 flex items-center justify-center">
            <div className="w-28 h-1 bg-zinc-600/60 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
