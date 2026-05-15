import "server-only";
import { promises as fs } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

export type Beat = {
  index: number;
  voiceover: string;
  durationSec: number;
  visualHint: string;
  captionText: string;
  brollUrl: string;
};

export type CompositionInput = {
  slug: string;
  beats: Beat[];
  avatarVideoUrl: string;       // mp4 with audio (and the green background)
  avatarAlphaUrl?: string;      // optional transparent webm (chroma-keyed) — preferred for overlay
  hookText: string;
  channelHandle: string;
  fps?: number;
};

const COMP_ROOT = path.resolve(
  process.cwd(),
  process.cwd().endsWith("phantom") ? "composition" : "phantom/composition"
);

const PUBLIC_REELS = path.resolve(
  process.cwd(),
  process.cwd().endsWith("phantom") ? "public/reels" : "phantom/public/reels"
);

export async function writeComposition(input: CompositionInput): Promise<string> {
  const html = buildHtml(input);
  const outPath = path.join(COMP_ROOT, "index.html");
  await fs.writeFile(outPath, html, "utf8");
  return outPath;
}

export async function renderComposition(slug: string): Promise<string> {
  const outDir = path.join(PUBLIC_REELS, slug);
  await fs.mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, "final.mp4");

  return new Promise<string>((resolve, reject) => {
    const cmd = `npx --yes hyperframes render --output "${outFile}" --quality standard --fps 30`;
    const proc = spawn(cmd, [], {
      cwd: COMP_ROOT,
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
    let stderr = "";
    proc.stdout.on("data", (d) => process.stdout.write(d));
    proc.stderr.on("data", (d) => {
      stderr += d.toString();
      process.stderr.write(d);
    });
    proc.on("close", (code) => {
      if (code === 0) resolve(outFile);
      else reject(new Error(`hyperframes render exited ${code}: ${stderr.slice(-500)}`));
    });
    proc.on("error", (err) => reject(err));
  });
}

function buildHtml(input: CompositionInput): string {
  const total = input.beats.reduce((s, b) => s + b.durationSec, 0);
  const HOOK_DURATION = Math.min(3, input.beats[0]?.durationSec ?? 3);
  const OUTRO_DURATION = 1.2;

  let cursor = 0;
  const beats = input.beats.map((b) => {
    const start = cursor;
    cursor += b.durationSec;
    return { ...b, start };
  });
  const outroStart = Math.max(0, total - OUTRO_DURATION);

  const avatarVisualSrc = input.avatarAlphaUrl ?? input.avatarVideoUrl;
  const avatarVisualIsWebm = avatarVisualSrc.toLowerCase().endsWith(".webm");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body {
        width: 1080px;
        height: 1920px;
        overflow: hidden;
        background: #0a0a0a;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      }
      #root {
        position: relative;
        width: 1080px;
        height: 1920px;
        background: #0a0a0a;
      }

      /* === FULL-SCREEN B-ROLL BACKGROUND === */
      .broll {
        position: absolute;
        inset: 0;
        width: 1080px; height: 1920px;
        object-fit: cover;
        opacity: 0;
        z-index: 1;
      }
      .broll-tint {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg,
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0.10) 40%,
          rgba(0,0,0,0.55) 80%,
          rgba(0,0,0,0.85) 100%);
        z-index: 4;
        pointer-events: none;
      }

      /* === BEAT TAG (top left, persistent) === */
      .beat-tag {
        position: absolute;
        top: 50px; left: 50px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 18px;
        background: rgba(15, 23, 42, 0.55);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 999px;
        font-family: "JetBrains Mono", monospace;
        font-size: 22px;
        font-weight: 600;
        color: #ffffff;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        opacity: 0;
        z-index: 15;
      }
      .beat-tag-dot {
        width: 10px; height: 10px;
        border-radius: 50%;
        background: #22d3ee;
        box-shadow: 0 0 16px rgba(34, 211, 238, 0.8);
      }

      /* === CAPTIONS (middle-upper area, big and bold) === */
      .caption-band {
        position: absolute;
        left: 60px; right: 60px;
        top: 760px;
        font-size: 92px;
        line-height: 1.04;
        font-weight: 900;
        letter-spacing: -0.03em;
        color: #ffffff;
        text-align: left;
        text-shadow:
          0 6px 32px rgba(0,0,0,0.85),
          0 0 1px rgba(0,0,0,0.95);
        opacity: 0;
        z-index: 10;
      }

      /* === AVATAR (transparent webm overlay) === */
      .avatar-video {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 1080px;
        height: 1920px; /* preserves the avatar's framing — it was rendered at 1080x1920 with avatar at bottom */
        object-fit: contain;
        object-position: center bottom;
        z-index: 6;
        pointer-events: none;
      }

      /* === HOOK OVERLAY (B1 takeover) === */
      .hook-overlay {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.78) 100%);
        backdrop-filter: blur(6px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 80px;
        opacity: 0;
        z-index: 20;
      }
      .hook-prefix {
        font-family: "JetBrains Mono", monospace;
        font-size: 22px;
        font-weight: 600;
        color: #22d3ee;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        margin-bottom: 36px;
      }
      .hook-text {
        font-size: 130px;
        line-height: 0.96;
        font-weight: 900;
        letter-spacing: -0.04em;
        color: #ffffff;
        text-align: center;
        text-shadow: 0 10px 60px rgba(0,0,0,0.7);
      }

      /* === OUTRO === */
      .outro {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(180deg, #0f172a 0%, #020617 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 24px;
        opacity: 0;
        z-index: 35;
      }
      .outro-glow {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 900px; height: 900px;
        background: radial-gradient(circle, rgba(34, 211, 238, 0.22) 0%, transparent 60%);
        pointer-events: none;
      }
      .outro-handle {
        font-size: 96px;
        font-weight: 900;
        color: #22d3ee;
        letter-spacing: -0.03em;
        text-shadow: 0 0 80px rgba(34, 211, 238, 0.5);
        position: relative;
        z-index: 2;
      }
      .outro-cta {
        font-size: 36px;
        font-weight: 600;
        color: #cbd5e1;
        letter-spacing: 0.04em;
        position: relative;
        z-index: 2;
      }
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-duration="${total.toFixed(2)}"
      data-width="1080"
      data-height="1920"
    >
      <!-- FULL-SCREEN B-ROLL per beat -->
      ${beats.map((b) => `<img id="broll-${b.index}" class="broll clip" data-start="${b.start.toFixed(2)}" data-duration="${b.durationSec.toFixed(2)}" data-track-index="0" src="${escapeAttr(b.brollUrl)}" alt="b-roll ${b.index}" />`).join("\n      ")}

      <!-- Soft tint at the bottom so captions read against any b-roll -->
      <div class="broll-tint"></div>

      <!-- AVATAR (transparent webm, full-frame, native position from template) -->
      <video
        id="avatar"
        class="avatar-video clip"
        muted
        ${avatarVisualIsWebm ? "" : "playsinline"}
        data-start="0"
        data-duration="${total.toFixed(2)}"
        data-track-index="3"
        src="${escapeAttr(avatarVisualSrc)}"
      ></video>

      <!-- AUDIO: original mp4 (always has voice) -->
      <audio
        id="avatar-audio"
        class="clip"
        data-start="0"
        data-duration="${total.toFixed(2)}"
        data-track-index="4"
        src="${escapeAttr(input.avatarVideoUrl)}"
      ></audio>

      <!-- BEAT TAGS -->
      ${beats.map((b) => `<div id="tag-${b.index}" class="beat-tag clip" data-start="${b.start.toFixed(2)}" data-duration="${b.durationSec.toFixed(2)}" data-track-index="2"><span class="beat-tag-dot"></span>beat ${b.index} of ${beats.length}</div>`).join("\n      ")}

      <!-- CAPTIONS -->
      ${beats.map((b) => `<div id="caption-${b.index}" class="caption-band clip" data-start="${b.start.toFixed(2)}" data-duration="${b.durationSec.toFixed(2)}" data-track-index="1">${escapeHtml(b.captionText)}</div>`).join("\n      ")}

      <!-- HOOK OVERLAY -->
      <div
        id="hook"
        class="hook-overlay clip"
        data-start="0"
        data-duration="${HOOK_DURATION.toFixed(2)}"
        data-track-index="6"
      >
        <div class="hook-prefix">phantom · agent live</div>
        <div class="hook-text">${escapeHtml(input.hookText)}</div>
      </div>

      <!-- OUTRO -->
      <div
        id="outro"
        class="outro clip"
        data-start="${outroStart.toFixed(2)}"
        data-duration="${OUTRO_DURATION.toFixed(2)}"
        data-track-index="7"
      >
        <div class="outro-glow"></div>
        <div class="outro-handle">${escapeHtml(input.channelHandle)}</div>
        <div class="outro-cta">subscribe for more</div>
      </div>
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

      // Hook
      tl.fromTo("#hook", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0);
      tl.fromTo(".hook-prefix", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.15);
      tl.fromTo(".hook-text", { scale: 0.93, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7 }, 0.28);
      tl.to("#hook", { opacity: 0, duration: 0.55 }, ${(HOOK_DURATION - 0.55).toFixed(2)});
      tl.set("#hook", { opacity: 0 }, ${HOOK_DURATION.toFixed(2)});

      ${beats.map((b) => `
      // Beat ${b.index}: b-roll fade in, tag + caption slide up
      tl.to("#broll-${b.index}", { opacity: 1, duration: 0.4 }, ${b.start.toFixed(2)});
      tl.fromTo("#tag-${b.index}", { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, ${b.start.toFixed(2)});
      tl.fromTo("#caption-${b.index}", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, ${(b.start + 0.15).toFixed(2)});
      // Exits
      tl.to("#broll-${b.index}", { opacity: 0, duration: 0.35 }, ${(b.start + b.durationSec - 0.35).toFixed(2)});
      tl.to("#caption-${b.index}", { opacity: 0, y: -14, duration: 0.3 }, ${(b.start + b.durationSec - 0.3).toFixed(2)});
      tl.to("#tag-${b.index}", { opacity: 0, x: -10, duration: 0.3 }, ${(b.start + b.durationSec - 0.3).toFixed(2)});`).join("")}

      // Outro
      tl.fromTo("#outro", { opacity: 0 }, { opacity: 1, duration: 0.5 }, ${outroStart.toFixed(2)});
      tl.fromTo(".outro-handle", { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.65, ease: "back.out(1.6)" }, ${(outroStart + 0.1).toFixed(2)});
      tl.fromTo(".outro-cta", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${(outroStart + 0.4).toFixed(2)});

      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
