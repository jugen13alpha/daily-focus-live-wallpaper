import { ScheduleBlock, WallpaperTheme } from '../types';

export function generateHtmlWallpaper(
  blocks: ScheduleBlock[],
  theme: WallpaperTheme,
  priorityText: string,
  timeFormat24h: boolean,
  topPaddingPx: number = 24
): string {
  const blocksJson = JSON.stringify(
    blocks.map(b => [b.start, b.end, b.icon, b.title, b.subtitle])
  );

  const formattedPriority = priorityText
    .split('\n')
    .map((line, idx) => (idx === 0 ? `<b>${line}</b>` : line))
    .join('<br>');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <meta name="theme-color" content="${theme.bgDark}">
  <title>Daily Focus Wallpaper</title>
  <style>
    :root {
      --bg: ${theme.bgDark};
      --card-bg: ${theme.cardBg};
      --active-card-bg: ${theme.activeCardBg};
      --accent: ${theme.accent};
      --accent-glow: ${theme.accentGlow};
      --fg: ${theme.fg};
      --muted: ${theme.muted};
      --border: ${theme.border};
      --top-pad: ${topPaddingPx}px;
    }
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: var(--bg);
      color: var(--fg);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      overflow-x: hidden;
      overflow-y: auto;
      user-select: none;
      -webkit-user-select: none;
    }
    /* Ambient ambient glow */
    body::before {
      content: "";
      position: fixed;
      top: -10%;
      right: -10%;
      width: 60vw;
      height: 60vw;
      background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
      opacity: 0.12;
      filter: blur(40px);
      pointer-events: none;
      z-index: 0;
    }
    .wall {
      position: relative;
      z-index: 1;
      width: 100%;
      min-height: 100vh;
      padding: calc(var(--top-pad) + 12px) 14px 24px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 6px;
    }
    .eyebrow {
      font-size: 10px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--muted);
      font-weight: 600;
      margin-bottom: 4px;
    }
    h1 {
      font-size: 32px;
      line-height: 0.95;
      margin: 0;
      font-weight: 900;
      letter-spacing: 0.03em;
    }
    h1 span {
      color: var(--accent);
    }
    .clock-box {
      text-align: right;
    }
    .clock-time {
      font-size: 28px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.02em;
      line-height: 1;
    }
    .clock-tag {
      display: block;
      color: var(--accent);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.18em;
      margin-top: 4px;
      text-transform: uppercase;
    }
    .prior {
      font-size: 10.5px;
      letter-spacing: 0.06em;
      line-height: 1.35;
      color: #e2e8f0;
      border-left: 3px solid var(--accent);
      padding: 8px 10px;
      margin: 12px 0 10px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 0 4px 4px 0;
      backdrop-filter: blur(8px);
    }
    .prior b {
      color: var(--accent);
      display: inline-block;
      margin-bottom: 2px;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 3.5px;
      flex: 1;
    }
    .item {
      display: grid;
      grid-template-columns: 48px 16px 26px minmax(0, 1fr);
      gap: 6px;
      align-items: center;
      min-height: 38px;
      transition: transform 0.25s ease, opacity 0.25s ease;
    }
    .time {
      font-size: 11.5px;
      font-weight: 600;
      color: var(--muted);
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.02em;
    }
    .dot-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .dot {
      height: 6.5px;
      width: 6.5px;
      border-radius: 50%;
      background: #52525b;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.06);
      transition: all 0.3s ease;
    }
    .ico {
      font-size: 18px;
      text-align: center;
      line-height: 1;
      filter: grayscale(0.2);
    }
    .card {
      background: var(--card-bg);
      border-left: 3px solid #3f3f46;
      border-radius: 4px;
      padding: 6px 8px;
      min-width: 0;
      transition: all 0.25s ease;
    }
    .name {
      font-size: 11.5px;
      line-height: 1.15;
      font-weight: 800;
      letter-spacing: 0.04em;
      color: #f4f4f5;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sub {
      font-size: 9.5px;
      line-height: 1.2;
      color: var(--muted);
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* Active Block Highlights */
    .item.active .time {
      color: var(--accent);
      font-weight: 800;
    }
    .item.active .dot {
      background: var(--accent);
      box-shadow: 0 0 10px var(--accent-glow), 0 0 0 3px rgba(255, 255, 255, 0.15);
      transform: scale(1.3);
    }
    .item.active .card {
      background: var(--active-card-bg);
      border-left-color: var(--accent);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
    }
    .item.active .name {
      color: var(--accent);
    }
    footer {
      margin-top: 14px;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.16em;
      color: var(--muted);
      display: flex;
      justify-content: space-between;
      text-transform: uppercase;
    }
    footer span:last-child {
      color: var(--accent);
    }
    /* Android Lockscreen safe scrollbar */
    ::-webkit-scrollbar { width: 0px; background: transparent; }
  </style>
</head>
<body>
  <main class="wall">
    <header class="head">
      <div>
        <div class="eyebrow">DAILY SYSTEM</div>
        <h1>DAILY<br><span>FOCUS</span></h1>
      </div>
      <div class="clock-box">
        <div class="clock-time" id="clock">--:--</div>
        <small class="clock-tag" id="blockTag">CURRENT BLOCK</small>
      </div>
    </header>

    <div class="prior">
      ${formattedPriority}
    </div>

    <section class="list" id="list"></section>

    <footer>
      <span>ONE BLOCK AT A TIME</span>
      <span>DISCIPLINE → FREEDOM</span>
    </footer>
  </main>

  <script>
    const BLOCKS = ${blocksJson};
    const IS_24H = ${timeFormat24h};

    function parseMinutes(timeStr) {
      const parts = timeStr.split(':').map(Number);
      return parts[0] * 60 + parts[1];
    }

    function formatTime(date) {
      if (IS_24H) {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        return h + ':' + m;
      } else {
        let h = date.getHours();
        const m = String(date.getMinutes()).padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return h + ':' + m + ' ' + ampm;
      }
    }

    let activeIndex = -1;

    function renderList(curMin) {
      let foundIdx = BLOCKS.findIndex(b => curMin >= parseMinutes(b[0]) && curMin < parseMinutes(b[1]));
      
      // If past midnight or early morning before first block
      if (foundIdx === -1) {
        const firstStart = parseMinutes(BLOCKS[0][0]);
        if (curMin < firstStart) {
          foundIdx = BLOCKS.length - 1; // night/sleep block
        }
      }

      activeIndex = foundIdx;

      const container = document.getElementById('list');
      container.innerHTML = BLOCKS.map((b, i) => {
        const isActive = (i === activeIndex);
        return '<div class="item ' + (isActive ? 'active' : '') + '">' +
          '<div class="time">' + b[0] + '</div>' +
          '<div class="dot-wrap"><div class="dot"></div></div>' +
          '<div class="ico">' + b[2] + '</div>' +
          '<div class="card">' +
            '<div class="name">' + b[3] + '</div>' +
            (b[4] ? '<div class="sub">' + b[4] + '</div>' : '') +
          '</div>' +
        '</div>';
      }).join('');
    }

    function update() {
      const d = new Date();
      const curMin = d.getHours() * 60 + d.getMinutes();
      document.getElementById('clock').textContent = formatTime(d);
      renderList(curMin);
    }

    update();

    // Check frequently for instant precision when lock screen turns on
    let intervalId = setInterval(update, 10000);

    // Battery conservation: reduce polling when screen is locked/hidden
    document.addEventListener('visibilitychange', () => {
      clearInterval(intervalId);
      if (document.visibilityState === 'visible') {
        update();
        intervalId = setInterval(update, 10000);
      } else {
        // Run very slowly in background
        intervalId = setInterval(update, 60000);
      }
    });

    // Support runtime configuration updates from Android native bridge
    window.updateSchedule = function(newBlocksJson) {
      try {
        const data = JSON.parse(newBlocksJson);
        if (Array.isArray(data)) {
          BLOCKS.length = 0;
          BLOCKS.push(...data);
          update();
        }
      } catch (e) {
        console.error("Invalid update data", e);
      }
    };
  </script>
</body>
</html>`;
}
