import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

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
    message: "Invoking reel-production skill via claude --print",
    status: "running",
    output: `cwd: ${WORKSPACE_ROOT}\nslug: ${skillSlug}\nprompt length: ${prompt.length} chars`,
  };

  // Tail the output dir for new files → progress signal
  let lastFileCount = 0;
  const watcher = setInterval(async () => {
    try {
      const files = await fs.readdir(skillOutputDir);
      if (files.length > lastFileCount) {
        lastFileCount = files.length;
        // Note: we can't yield from outside the generator; tracking only.
      }
    } catch {
      /* ignore */
    }
  }, 5000);

  // Run claude --print as a subprocess
  const result = await new Promise<{ ok: boolean; stdout: string; stderr: string }>((resolve) => {
    const proc = spawn("claude", ["--print"], {
      shell: true,
      cwd: WORKSPACE_ROOT,
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
      env: process.env,
    });

    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("close", (code) => {
      clearInterval(watcher);
      resolve({ ok: code === 0, stdout, stderr });
    });
    proc.on("error", () => {
      clearInterval(watcher);
      resolve({ ok: false, stdout, stderr });
    });

    proc.stdin.write(prompt);
    proc.stdin.end();
  });

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

function buildPrompt(url: string, slug: string): string {
  return `You have access to the reel-production skill installed at C:\\Users\\DivyGoyal\\.claude\\skills\\reel-production.

Use that skill to produce a complete 1080×1920 vertical reel from this URL:

  ${url}

Slug for output artifacts: ${slug}

Workspace cwd: C:\\Users\\DivyGoyal\\Desktop\\heygen trial

== AUTONOMOUS MODE ==

Run all phases without asking the user any question. Make every editorial decision (tone, hook archetype, structure, image style, motion verb, SFX palette, etc.) autonomously based on the source URL and the skill's reference catalogs.

== HEYGEN AVATAR — RENDER VIA API, NOT MANUAL ==

The reel-production skill normally expects the user to deliver \`input/heygen-greenscreen.mp4\` manually. For this autonomous run, you must instead render it via the HeyGen API:

  - API endpoint: POST https://api.heygen.com/v2/video/generate
  - Auth header: "X-Api-Key: $env:HEYGEN_API_KEY" (already set in environment)
  - Avatar look ID: ${HEYGEN_AVATAR_LOOK_ID} (Elio portrait, 1080×1920)
  - Voice ID: ${HEYGEN_VOICE_ID} (Raunak M, ElevenLabs imported)
  - Aspect ratio: 9:16
  - Background: { type: "color", value: "#00FF00" }
  - Engine: { type: "avatar_iv" }
  - Resolution: 1080p

Workflow:
  1. After Phase 2.1 (script done), call HeyGen API with the script
  2. Poll GET /v1/video_status.get?video_id=<ID> every 15 seconds until status == "completed"
  3. Download the resulting mp4 (curl/fetch)
  4. Save at C:\\Users\\DivyGoyal\\Desktop\\heygen trial\\input\\heygen-greenscreen.mp4 (overwrite existing)
  5. Resume Phase 4 + 5 normally

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
