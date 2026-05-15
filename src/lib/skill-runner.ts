import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { buildCaptionFilter, findTranscript } from "./caption-filter";

/**
 * Skill runner — shells out to `claude --print` and lets the user's
 * reel-production skill produce the reel end-to-end.
 *
 * Phantom's job here is minimal:
 *   1. Build the skill invocation prompt (with URL + autonomous instructions)
 *   2. Spawn `claude --print` with the heygen trial workspace as cwd
 *   3. Watch the skill's output directory for new artifacts → emit progress
 *   4. Move the final mp4 to phantom/public/reels/<slug>/final.mp4
 *
 * The skill itself does Phase 0 → Phase 5 (intake, rubrics, script,
 * critique, asset gen, render, verify). Phantom does NOT re-implement
 * any of that — this is the canonical version.
 */

const WORKSPACE_ROOT = path.resolve(
  process.cwd(),
  process.cwd().endsWith("phantom") ? ".." : "."
);
const PHANTOM_ROOT = path.resolve(
  process.cwd(),
  process.cwd().endsWith("phantom") ? "." : "phantom"
);

const HEYGEN_AVATAR_LOOK_ID =
  process.env.HEYGEN_AVATAR_LOOK_ID || "e21e5186b877473380cfd62b73930204";
const HEYGEN_VOICE_ID =
  process.env.HEYGEN_VOICE_ID || "1856084cf0ee4e139de4bbb02035a02c";
const HEYGEN_TEMPLATE_ID =
  process.env.HEYGEN_TEMPLATE_ID || "b5454f0332874d8ea09f45afa3142044";

export type SkillEvent = {
  step: string;
  message: string;
  status: "running" | "done" | "failed";
  output?: string;
};

export async function* runReelViaSkill(
  url: string,
  slug: string
): AsyncGenerator<SkillEvent> {
  // Stage the slug folder ahead of time (skill writes editorial-brief here)
  const skillSlug = `phantom-${slug.slice(0, 40)}`;
  const skillOutputDir = path.join(WORKSPACE_ROOT, "output", "breaking", skillSlug);
  await fs.mkdir(skillOutputDir, { recursive: true });

  const prompt = buildPrompt(url, skillSlug);
  const startTime = Date.now();

  yield {
    step: "skill-invoke",
    message: "Invoking reel-production skill (this typically takes 15-30 min)",
    status: "running",
    output: `cwd: ${WORKSPACE_ROOT}\nslug: ${skillSlug}\nphases: 0 → 0.5 → 1 → 2 → 3 → 4 → 5\nthe skill: ingests URL, dense-scans source video, picks tone/hook/structure, writes script, renders HeyGen avatar via API, cuts source clips at natural durations, runs Phase 3 critique, renders the composition (1100+ frames @ 30fps × 8 workers), mobile-safe encode\nliveness: tail the workspace's output/breaking/${skillSlug}/ for new artifacts as phases complete`,
  };

  // Heartbeat queue: collect events from the file watcher and the periodic
  // pulse so we can yield them from the generator without races.
  const eventQueue: SkillEvent[] = [];
  const wake: { fn: (() => void) | null } = { fn: null };
  const pushEvent = (e: SkillEvent) => {
    eventQueue.push(e);
    wake.fn?.();
  };

  // Per-30s heartbeat so the UI doesn't look frozen during the long subprocess
  const heartbeatStart = Date.now();
  // Use a single step ID so the heartbeat row updates in place (no list growth)
  const heartbeat = setInterval(() => {
    const elapsedMin = ((Date.now() - heartbeatStart) / 60_000).toFixed(1);
    pushEvent({
      step: "skill-heartbeat",
      message: `Skill running · ${elapsedMin} min elapsed`,
      status: "running",
      output: `subprocess alive. typical full run: 15-30 min for Phase 0 → 5 including composition + final render.`,
    });
  }, 30_000);

  // Watch the output dir for new artifacts → progress signal
  let lastFileCount = 0;
  const watcher = setInterval(async () => {
    try {
      const files = await fs.readdir(skillOutputDir);
      if (files.length > lastFileCount) {
        const newFile = files[files.length - 1];
        lastFileCount = files.length;
        pushEvent({
          step: `artifact-${files.length}`,
          message: `New artifact written: ${newFile}`,
          status: "running",
          output: `total artifacts in slug dir: ${files.length}`,
        });
      }
    } catch {
      /* ignore */
    }
  }, 5_000);

  // Start the subprocess. We resolve when the process closes.
  let resolveProc: ((v: { ok: boolean; stdout: string; stderr: string }) => void) | null = null;
  const procResult = new Promise<{ ok: boolean; stdout: string; stderr: string }>((r) => {
    resolveProc = r;
  });

  let stdout = "";
  let stderr = "";
  const proc = spawn("claude", ["--print"], {
    shell: true,
    cwd: WORKSPACE_ROOT,
    stdio: ["pipe", "pipe", "pipe"],
    windowsHide: true,
    env: process.env,
  });
  proc.stdout.on("data", (d) => (stdout += d.toString()));
  proc.stderr.on("data", (d) => (stderr += d.toString()));
  proc.on("close", (code) => {
    clearInterval(heartbeat);
    clearInterval(watcher);
    resolveProc?.({ ok: code === 0, stdout, stderr });
  });
  proc.on("error", () => {
    clearInterval(heartbeat);
    clearInterval(watcher);
    resolveProc?.({ ok: false, stdout, stderr });
  });
  proc.stdin.write(prompt);
  proc.stdin.end();

  // Drain the event queue + wait for proc to finish.
  let procDone = false;
  let result!: { ok: boolean; stdout: string; stderr: string };
  procResult.then((r) => {
    result = r;
    procDone = true;
    wake.fn?.();
  });
  while (!procDone || eventQueue.length > 0) {
    if (eventQueue.length === 0) {
      await new Promise<void>((r) => {
        wake.fn = () => {
          wake.fn = null;
          r();
        };
      });
      continue;
    }
    const next = eventQueue.shift()!;
    yield next;
  }

  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);

  if (!result.ok) {
    yield {
      step: "skill-invoke",
      message: "Skill run failed",
      status: "failed",
      output: `elapsed: ${elapsedSec}s\nstderr tail:\n${result.stderr.slice(-500)}\n\nstdout tail:\n${result.stdout.slice(-500)}`,
    };
    return;
  }

  yield {
    step: "skill-invoke",
    message: "Skill finished",
    status: "done",
    output: `elapsed: ${elapsedSec}s\nstdout tail:\n${result.stdout.slice(-1500)}`,
  };

  // Find the final mp4. The skill writes to `output/final-video.mp4` by default.
  yield {
    step: "skill-collect",
    message: "Locating + staging final mp4",
    status: "running",
  };

  const candidates = [
    path.join(WORKSPACE_ROOT, "output", "final-video.mp4"),
    path.join(WORKSPACE_ROOT, "output", "final-video-mobile.mp4"),
    path.join(skillOutputDir, "final-video.mp4"),
  ];

  let foundMp4: string | undefined;
  for (const c of candidates) {
    try {
      const stat = await fs.stat(c);
      // The skill wrote a file in the last hour — likely this run's output
      if (stat.size > 100_000 && Date.now() - stat.mtimeMs < 3 * 60 * 60 * 1000) {
        foundMp4 = c;
        break;
      }
    } catch {
      /* not found, try next */
    }
  }

  if (!foundMp4) {
    yield {
      step: "skill-collect",
      message: "No mp4 found in expected paths — check skill output",
      status: "failed",
      output: `Searched:\n${candidates.join("\n")}`,
    };
    return;
  }

  // Apply the word-level Playfair caption styling pass (1.3x speed +
  // Whisper-pinned per-word captions). If it fails for any reason, fall
  // back silently to the unstyled base reel.
  yield {
    step: "style-apply",
    message: "Applying word-level Playfair captions (1.3x speed)",
    status: "running",
    output: `base: ${foundMp4}`,
  };
  const styling = await applyStyling(skillSlug, foundMp4);
  if (styling.ok && styling.path) {
    foundMp4 = styling.path;
    yield {
      step: "style-apply",
      message: "Styling applied",
      status: "done",
      output: `styled: ${styling.path}\nfont: PlayfairDisplay-Regular · word-pinned via Whisper · speed=1.3x`,
    };
  } else {
    yield {
      step: "style-apply",
      message: `Styling skipped (${styling.error || "unknown"}) — using base reel`,
      status: "failed",
    };
  }

  // Copy to phantom/public/reels/<slug>/final.mp4
  const phantomReelDir = path.join(PHANTOM_ROOT, "public", "reels", slug);
  await fs.mkdir(phantomReelDir, { recursive: true });
  const phantomMp4 = path.join(phantomReelDir, "final.mp4");
  await fs.copyFile(foundMp4, phantomMp4);

  yield {
    step: "skill-collect",
    message: "Final reel staged for delivery",
    status: "done",
    output: `from: ${foundMp4}\nto:   ${phantomMp4}\nsize: ${((await fs.stat(phantomMp4)).size / 1_000_000).toFixed(1)} MB`,
  };
}

/**
 * Word-level Playfair caption styling pass — runs after the skill returns
 * the base reel mp4.
 *
 * Two stages:
 *   1. Build the ffmpeg drawtext filter from output/breaking/<slug>/
 *      transcript-*.json (in-process, see caption-filter.ts)
 *   2. ffmpeg -filter_complex_script <FILE> → setpts/atempo 1.3x + burns
 *      per-word captions into a styled mp4
 *
 * Falls back to the unstyled base reel if either stage fails.
 */
async function applyStyling(
  skillSlug: string,
  baseMp4: string
): Promise<{ ok: boolean; path?: string; error?: string }> {
  // Paths used as ffmpeg args MUST be relative to WORKSPACE_ROOT — the
  // absolute path contains a space ("heygen trial") that breaks unquoted
  // shell arg splitting.
  const filterRel = `output/style-filter-${skillSlug}.txt`;
  const styledRel = `output/final-styled-${skillSlug}.mp4`;
  const baseRel = path
    .relative(WORKSPACE_ROOT, baseMp4)
    .replace(/\\/g, "/");
  const filterAbs = path.join(WORKSPACE_ROOT, filterRel);
  const styledAbs = path.join(WORKSPACE_ROOT, styledRel);

  const transcript = await findTranscript(WORKSPACE_ROOT, skillSlug);
  if (!transcript) {
    return { ok: false, error: "no transcript-*.json in slug dir" };
  }

  try {
    await buildCaptionFilter(transcript, filterAbs);
  } catch (e) {
    return { ok: false, error: `filter build failed: ${(e as Error).message}` };
  }

  const ffmpegOk = await new Promise<boolean>((resolve) => {
    const p = spawn(
      "ffmpeg",
      [
        "-y",
        "-i",
        baseRel,
        "-filter_complex_script",
        filterRel,
        "-map",
        "[v]",
        "-map",
        "[a]",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "19",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        styledRel,
      ],
      {
        shell: true,
        cwd: WORKSPACE_ROOT,
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
        env: process.env,
      }
    );
    p.on("close", (code) => resolve(code === 0));
    p.on("error", () => resolve(false));
  });
  if (!ffmpegOk) return { ok: false, error: "ffmpeg styling render failed" };

  try {
    const stat = await fs.stat(styledAbs);
    if (stat.size < 100_000) {
      return { ok: false, error: `styled mp4 too small (${stat.size}b)` };
    }
  } catch {
    return { ok: false, error: "styled mp4 not found after ffmpeg" };
  }

  return { ok: true, path: styledAbs };
}

function buildPrompt(url: string, slug: string): string {
  return `You have access to the reel-production skill installed at C:\\Users\\DivyGoyal\\.claude\\skills\\reel-production.

Use that skill to produce a complete 1080×1920 vertical reel from this URL:

  ${url}

Slug for output artifacts: ${slug}

Workspace cwd: C:\\Users\\DivyGoyal\\Desktop\\heygen trial

== AUTONOMOUS MODE ==

Run all phases without asking the user any question. Make every editorial decision (tone, hook archetype, structure, image style, motion verb, SFX palette, etc.) autonomously based on the source URL and the skill's reference catalogs.

== HEYGEN AVATAR — RENDER VIA TEMPLATE ENDPOINT ==

The reel-production skill normally expects the user to deliver \`input/heygen-greenscreen.mp4\` manually. For this autonomous run, render it via the HeyGen TEMPLATE endpoint (NOT v2/video/generate):

WHY THE TEMPLATE ENDPOINT: The configured avatar (${HEYGEN_AVATAR_LOOK_ID}) is a HeyGen photo_avatar. \`v2/video/generate\` silently ignores the \`background\` override for photo_avatars and returns the avatar with its natural baked-in background — which breaks the chroma-key composition. The template (${HEYGEN_TEMPLATE_ID}) has the avatar + chroma-green BG locked at the template level and exposes the script as a {{script}} text variable, so the override sticks.

Render call:
  - POST https://api.heygen.com/v2/template/${HEYGEN_TEMPLATE_ID}/generate
  - Auth header: "X-Api-Key: $env:HEYGEN_API_KEY"
  - Body (JSON):
      {
        "caption": false,
        "title": "<slug> <ISO timestamp>",
        "variables": {
          "script": {
            "name": "script",
            "type": "text",
            "properties": { "content": "<THE FULL SCRIPT TEXT — beats joined with \\n\\n>" }
          }
        }
      }
  - The variable MUST be type "text" with properties.content. Do NOT use type "voice" — HeyGen voice variables only override voice_id, not the spoken script. (Voice ID is already baked in the template.)

Workflow:
  1. After Phase 2.1 (script done), build the variables payload above and POST it
  2. Capture \`data.video_id\` from the response
  3. Poll GET https://api.heygen.com/v1/video_status.get?video_id=<ID> every 15 seconds until status == "completed"
  4. Download the resulting mp4 (curl/fetch) from \`data.video_url\`
  5. Save at C:\\Users\\DivyGoyal\\Desktop\\heygen trial\\input\\heygen-greenscreen.mp4 (overwrite existing)
  6. Verify duration roughly matches script word-count × 0.45s/word — if it returned the template's placeholder script ("lorem ipsum…"), the variable substitution failed; debug before continuing.
  7. Resume Phase 4 + 5 normally

NOTE: If \`HEYGEN_TEMPLATE_ID\` is unset or empty (env-driven, would default to ${HEYGEN_TEMPLATE_ID}), you can fall back to v2/video/generate with these params — but expect the chroma override to fail for photo_avatars:
  - avatar_id: ${HEYGEN_AVATAR_LOOK_ID}, voice_id: ${HEYGEN_VOICE_ID}, aspect 9:16, BG #00FF00, engine avatar_iv, 1080p

== OUTPUT ==

The skill's standard output paths apply:
  - output/final-video.mp4 (master)
  - output/final-video-mobile.mp4 (mobile sibling, Phase 5.4)

When complete, print:
  REEL_READY: <absolute path to final mp4>

== CONSTRAINTS ==

- Channel handle: @aisimplified
- All other skill defaults apply (V46/V47 layouts, avatar visible bottom 40%, etc.)
- If the source URL has no video (article-only), skip Phase 0.5 and use Gemini stills only.
- If any phase fails, log the error and continue with sensible fallback. Do not halt.
`;
}
