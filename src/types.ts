export interface ScheduleBlock {
  id: string;
  start: string; // "07:30"
  end: string;   // "08:00"
  icon: string;  // "☀"
  title: string; // "WAKE UP"
  subtitle: string; // "Sunlight · water"
}

export interface WallpaperTheme {
  id: string;
  name: string;
  bgDark: string;       // #0c0c0d
  cardBg: string;       // #19191c
  activeCardBg: string; // #39210f
  accent: string;       // #ff8a24
  accentGlow: string;   // #ff8a2499
  fg: string;           // #eeeeee
  muted: string;        // #a4a4aa
  border: string;       // #28282b
}

export interface AndroidProjectConfig {
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  priorityText: string;
  timeFormat24h: boolean;
  lockscreenTopPadding: number; // px clearance for system clock
  themeId: string;
}
