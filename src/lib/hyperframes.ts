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
  brollUrl: string; // absolute or composition-relative URL
};

export type CompositionInput = {
  slug: string;
  beats: Beat[];
  avatarVideoUrl: string; // single full-script avatar video
  hookText: string; // big overlay text for B1 (3s)
  channelHandle: string; // e.g. "@aisimplified"
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
    // Build as a single shell command so paths with spaces survive the shell
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
  const fps = input.fps ?? 30;
  const total = input.beats.reduce((s, b) => s + b.durationSec, 0);
  const HOOK_DURATION = Math.min(3, input.beats[0]?.durationSec ?? 3);
  const OUTRO_DURATION = 1;

  // Compute beat start offsets
  let cursor = 0;
  const beats = input.beats.map((b) => {
    const start = cursor;
    cursor += b.durationSec;
    return { ...b, start };
  });

  const outroStart = Math.max(0, total - OUTRO_DURATION);

  // === HTML ===

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body {
        margin: 0;
        width: 1080px;
        height: 1920px;
        overflow: hidden;
        background: #000;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
      }
      #root { position: relative; width: 1080px; height: 1920px; background: #000; }

      /* === ASSET ZONE (top 60%) === */
      .asset-zone {
        position: absolute;
        left: 0; top: 0;
        width: 1080px; height: 1152px;
        overflow: hidden;
        background: #0a0a0a;
      }
      .broll {
        position: absolute;
        inset: 0;
        width: 100%; height: 100%;
        object-fit: cover;
        opacity: 0;
      }
      .caption-band {
        position: absolute;
        left: 60px; right: 60px;
        bottom: 80px;
        font-size: 78px;
        line-height: 1.06;
        font-weight: 800;
        letter-spacing: -0.01em;
        color: #ffffff;
        text-shadow: 0 4px 24px rgba(0,0,0,0.5), 0 0 1px rgba(0,0,0,0.9);
        background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
        padding: 24px 28px;
        border-radius: 12px;
        opacity: 0;
      }

      /* === AVATAR ZONE (bottom 40%) === */
      .avatar-zone {
        position: absolute;
        left: 0; top: 1152px;
        width: 1080px; height: 768px;
        overflow: hidden;
        background: #000;
      }
      .avatar-video {
        position: absolute;
        inset: 0;
        width: 100%; height: 100%;
        object-fit: cover;
        object-position: center bottom;
      }
      /* subtle fade where asset meets avatar */
      .seam-fade {
        position: absolute;
        left: 0; right: 0; top: -40px;
        height: 80px;
        background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.6));
        pointer-events: none;
        z-index: 5;
      }

      /* === HOOK OVERLAY (B1 only) === */
      .hook-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 80px 60px;
        opacity: 0;
        z-index: 20;
      }
      .hook-text {
        font-size: 120px;
        line-height: 1.02;
        font-weight: 900;
        letter-spacing: -0.025em;
        color: #ffffff;
        text-align: center;
        text-shadow: 0 8px 40px rgba(0,0,0,0.7);
      }
      .hook-accent {
        color: #22d3ee;
      }

      /* === OUTRO CARD === */
      .outro {
        position: absolute;
        left: 0; right: 0; bottom: 0;
        height: 280px;
        background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.6) 70%, transparent);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        opacity: 0;
        z-index: 25;
      }
      .outro-handle {
        font-size: 64px;
        font-weight: 800;
        color: #22d3ee;
        letter-spacing: -0.01em;
      }
      .outro-cta {
        font-size: 32px;
        color: #ffffff;
        font-weight: 600;
        opacity: 0.85;
      }

      /* === BEAT-INDEX BADGE (small, top-left) === */
      .beat-badge {
        position: absolute;
        top: 36px; left: 36px;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(6px);
        padding: 8px 16px;
        border-radius: 999px;
        font-size: 22px;
        color: #ffffff;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        z-index: 15;
        opacity: 0;
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
      <!-- ASSET ZONE -->
      <div class="asset-zone">
        ${beats.map((b) => `<img id="broll-${b.index}" class="broll clip" data-start="${b.start.toFixed(2)}" data-duration="${b.durationSec.toFixed(2)}" data-track-index="0" src="${escapeAttr(b.brollUrl)}" alt="b-roll ${b.index}" />`).join("\n        ")}

        ${beats.map((b) => `<div id="caption-${b.index}" class="caption-band clip" data-start="${b.start.toFixed(2)}" data-duration="${b.durationSec.toFixed(2)}" data-track-index="1">${escapeHtml(b.captionText)}</div>`).join("\n        ")}

        ${beats.map((b) => `<div id="badge-${b.index}" class="beat-badge clip" data-start="${b.start.toFixed(2)}" data-duration="${b.durationSec.toFixed(2)}" data-track-index="2">${b.index} · ${beats.length}</div>`).join("\n        ")}
      </div>

      <!-- AVATAR ZONE -->
      <div class="avatar-zone">
        <div class="seam-fade"></div>
        <video
          id="avatar"
          class="avatar-video clip"
          muted
          data-start="0"
          data-duration="${total.toFixed(2)}"
          data-track-index="3"
          src="${escapeAttr(input.avatarVideoUrl)}"
        ></video>
      </div>

      <!-- Avatar audio (separate per HyperFrames rule) -->
      <audio
        id="avatar-audio"
        class="clip"
        data-start="0"
        data-duration="${total.toFixed(2)}"
        data-track-index="4"
        src="${escapeAttr(input.avatarVideoUrl)}"
      ></audio>

      <!-- HOOK OVERLAY -->
      <div
        id="hook"
        class="hook-overlay clip"
        data-start="0"
        data-duration="${HOOK_DURATION.toFixed(2)}"
        data-track-index="6"
      >
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
        <div class="outro-handle">${escapeHtml(input.channelHandle)}</div>
        <div class="outro-cta">subscribe for more</div>
      </div>
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });

      // Per-beat: B-roll fades in over 0.3s, caption slides up + fades in over 0.4s after a 0.2s delay
      ${beats.map((b) => `
      tl.to("#broll-${b.index}", { opacity: 1, duration: 0.3 }, ${b.start.toFixed(2)});
      tl.fromTo("#caption-${b.index}", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${(b.start + 0.2).toFixed(2)});
      tl.to("#badge-${b.index}", { opacity: 1, duration: 0.3 }, ${b.start.toFixed(2)});`).join("")}

      // Hook overlay: fade in instantly at 0, fade out at ${HOOK_DURATION.toFixed(2)}s
      tl.to("#hook", { opacity: 1, duration: 0.2 }, 0);
      tl.to("#hook", { opacity: 0, duration: 0.5 }, ${(HOOK_DURATION - 0.5).toFixed(2)});

      // Outro: fade in at outroStart
      tl.to("#outro", { opacity: 1, duration: 0.4 }, ${outroStart.toFixed(2)});

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
