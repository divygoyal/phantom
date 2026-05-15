import "server-only";
import { promises as fs } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

/**
 * Chroma-key a green-screen mp4 into a transparent WebM (VP9 + alpha).
 *
 * The user's HeyGen renders use a hex green background (#00FF00). This filter
 * keys it out and writes a yuva420p WebM that Chrome (and therefore the
 * HyperFrames headless renderer) plays with true transparency.
 */
export async function chromaKeyToWebm(
  inputMp4: string,
  outputWebm: string,
  opts: { keyHex?: string; similarity?: number; blend?: number } = {}
): Promise<void> {
  const keyHex = (opts.keyHex ?? "0x00FF00").replace(/^#/, "0x");
  const similarity = opts.similarity ?? 0.18;
  const blend = opts.blend ?? 0.08;

  // chromakey: color, similarity (how close to hex counts as key), blend (edge softness)
  // despill: cleans up green spill on hair/edges (cuts the green channel where saturation > threshold)
  const filter = `chromakey=${keyHex}:${similarity}:${blend},despill=type=green:mix=0.4:expand=0,format=yuva420p`;

  const cmd = [
    "ffmpeg",
    "-y",
    "-i", `"${inputMp4}"`,
    "-vf", `"${filter}"`,
    "-c:v", "libvpx-vp9",
    "-auto-alt-ref", "0",
    "-b:v", "2M",
    "-pix_fmt", "yuva420p",
    "-an",
    `"${outputWebm}"`,
  ].join(" ");

  return new Promise<void>((resolve, reject) => {
    const proc = spawn(cmd, [], {
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
    let stderr = "";
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg chromakey exited ${code}: ${stderr.slice(-600)}`));
    });
    proc.on("error", reject);
  });
}

/**
 * Probe a video file for duration in seconds. Used when avatar duration drifts
 * from the WPS-estimated total in reel.ts.
 */
export async function probeDuration(inputPath: string): Promise<number | null> {
  return new Promise((resolve) => {
    const cmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${inputPath}"`;
    const proc = spawn(cmd, [], { shell: true, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
    let stdout = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.on("close", () => {
      const n = parseFloat(stdout.trim());
      resolve(Number.isFinite(n) ? n : null);
    });
    proc.on("error", () => resolve(null));
  });
}

/**
 * Convenience: chroma-key an mp4 path and return the webm path (next to it).
 * Caches: if the webm already exists and is newer than the mp4, skip.
 */
export async function ensureChromaWebm(
  mp4Path: string,
  webmPath: string
): Promise<string> {
  try {
    const [mp4Stat, webmStat] = await Promise.all([
      fs.stat(mp4Path),
      fs.stat(webmPath).catch(() => null),
    ]);
    if (webmStat && webmStat.mtimeMs > mp4Stat.mtimeMs) {
      return webmPath;
    }
  } catch {
    // mp4 missing — let the caller deal with it
  }
  await fs.mkdir(path.dirname(webmPath), { recursive: true });
  await chromaKeyToWebm(mp4Path, webmPath);
  return webmPath;
}
