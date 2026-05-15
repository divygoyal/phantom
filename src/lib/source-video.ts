import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

/**
 * Source-video catalog + clip extraction.
 *
 * Mirrors Phase 0.5 + Phase 4 of the reel-production skill, but autonomous:
 *
 *   1. Download the X-post video (or other source) to disk.
 *   2. Dense-scan it at 3-5s intervals → midframes.
 *   3. Probe duration so we know what we're working with.
 *   4. Cut per-beat clips at natural durations sized to the script's word budget.
 *
 * The cut clips become <video> B-roll in the HyperFrames composition (full-screen
 * background under the chroma-keyed avatar).
 */

const FFMPEG_BIN = process.env.FFMPEG_BIN || "ffmpeg";
const FFPROBE_BIN = process.env.FFPROBE_BIN || "ffprobe";

export type SourceVideo = {
  localPath: string;
  durationSec: number;
};

export type BeatClip = {
  beatIndex: number;
  srcIn: number;
  srcOut: number;
  durationSec: number;
  localPath: string;        // absolute on disk
  compositionUrl: string;   // relative to composition root (e.g. "assets/clip-1.mp4")
};

const COMP_ROOT = path.resolve(
  process.cwd(),
  process.cwd().endsWith("phantom") ? "composition" : "phantom/composition"
);

const TMP_DIR = path.resolve(
  process.cwd(),
  process.cwd().endsWith("phantom") ? ".cache/source-video" : "phantom/.cache/source-video"
);

/**
 * Download the source video to a local file. Idempotent — re-uses the cache.
 */
export async function downloadSourceVideo(
  url: string,
  slug: string
): Promise<SourceVideo> {
  await fs.mkdir(TMP_DIR, { recursive: true });
  const localPath = path.join(TMP_DIR, `${slug}.mp4`);

  // Cache hit — skip download
  try {
    const stat = await fs.stat(localPath);
    if (stat.size > 100_000) {
      const duration = await probeDuration(localPath);
      return { localPath, durationSec: duration };
    }
  } catch {
    // not cached — fall through
  }

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 Phantom/1.0" },
  });
  if (!res.ok) throw new Error(`Source video fetch failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(localPath, buf);
  const duration = await probeDuration(localPath);
  return { localPath, durationSec: duration };
}

/**
 * Probe video duration in seconds.
 */
export function probeDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const cmd = `${FFPROBE_BIN} -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`;
    const proc = spawn(cmd, [], { shell: true, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
    let stdout = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.on("close", () => {
      const n = parseFloat(stdout.trim());
      if (Number.isFinite(n)) resolve(n);
      else reject(new Error(`ffprobe returned non-numeric duration: "${stdout.trim()}"`));
    });
    proc.on("error", reject);
  });
}

/**
 * Dense-scan the source video — extract a midframe every `intervalSec` seconds.
 * Returns the list of (timestamp, frame_path) pairs for inspection.
 *
 * Inspired by Phase 0.5 in reel-production: the agent reads each frame to
 * identify what's happening in the source clip at that timestamp.
 */
export async function scanSourceVideo(
  source: SourceVideo,
  slug: string,
  intervalSec = 3
): Promise<Array<{ t: number; framePath: string }>> {
  const scanDir = path.join(TMP_DIR, `${slug}-scan`);
  await fs.mkdir(scanDir, { recursive: true });

  const timestamps: number[] = [];
  for (let t = 1; t < source.durationSec; t += intervalSec) timestamps.push(t);

  const out: Array<{ t: number; framePath: string }> = [];
  for (const t of timestamps) {
    const framePath = path.join(scanDir, `t-${t.toFixed(2)}.jpg`);
    await new Promise<void>((resolve, reject) => {
      const cmd = `${FFMPEG_BIN} -y -ss ${t.toFixed(2)} -i "${source.localPath}" -frames:v 1 -q:v 5 "${framePath}"`;
      const proc = spawn(cmd, [], { shell: true, stdio: ["ignore", "ignore", "pipe"], windowsHide: true });
      let stderr = "";
      proc.stderr.on("data", (d) => (stderr += d.toString()));
      proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`scan-frame ${t} failed: ${stderr.slice(-200)}`))));
      proc.on("error", reject);
    });
    out.push({ t, framePath });
  }
  return out;
}

/**
 * Cut per-beat clips from the source video, evenly distributed across its
 * duration. Each beat gets a clip sized to its `durationSec`.
 *
 * Simple v1: divides the source linearly across beats. v2 (with frame analysis)
 * would pair each beat to its most semantically-relevant timestamp.
 */
export async function cutBeatClips(
  source: SourceVideo,
  beats: Array<{ index: number; durationSec: number }>,
  slug: string
): Promise<BeatClip[]> {
  const assetsDir = path.join(COMP_ROOT, "assets");
  await fs.mkdir(assetsDir, { recursive: true });

  const totalBeatDuration = beats.reduce((s, b) => s + b.durationSec, 0);
  // If source is longer than total beat duration, distribute evenly with a margin.
  // If shorter, loop or speed up — for v1 we just clamp + repeat.
  const usableDuration = Math.min(source.durationSec, totalBeatDuration * 1.4);

  let cursor = 0;
  const clips: BeatClip[] = [];
  for (const b of beats) {
    const segmentSize = (usableDuration * b.durationSec) / totalBeatDuration;
    const srcIn = Math.max(0, cursor);
    const srcOut = Math.min(source.durationSec, srcIn + Math.max(b.durationSec, segmentSize));
    cursor = srcOut;

    const fileName = `clip-${slug}-b${b.index}.mp4`;
    const localPath = path.join(assetsDir, fileName);
    await cutClip(source.localPath, srcIn, srcOut - srcIn, localPath);

    clips.push({
      beatIndex: b.index,
      srcIn,
      srcOut,
      durationSec: srcOut - srcIn,
      localPath,
      compositionUrl: `assets/${fileName}`,
    });
  }
  return clips;
}

async function cutClip(
  input: string,
  srcIn: number,
  duration: number,
  output: string
): Promise<void> {
  // Re-encode for clean keyframes; HyperFrames warns on sparse keyframes
  const cmd =
    `${FFMPEG_BIN} -y -ss ${srcIn.toFixed(2)} -t ${duration.toFixed(2)} -i "${input}" ` +
    `-c:v libx264 -preset fast -crf 22 -g 30 -keyint_min 30 -movflags +faststart -an "${output}"`;
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, [], { shell: true, stdio: ["ignore", "ignore", "pipe"], windowsHide: true });
    let stderr = "";
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`cut-clip failed (${code}): ${stderr.slice(-300)}`))));
    proc.on("error", reject);
  });
}

/**
 * Convenience: pick the best video URL from an ingest result.
 * Returns undefined if no video is available (article-only sources).
 */
export function pickSourceVideoUrl(mediaUrls: string[]): string | undefined {
  // X syndication returns mp4 URLs for tweet videos
  const mp4 = mediaUrls.find((u) => /\.mp4(\?|$)/i.test(u));
  if (mp4) return mp4;
  // Any other video extension
  const video = mediaUrls.find((u) => /\.(webm|mov|m4v)(\?|$)/i.test(u));
  return video;
}
