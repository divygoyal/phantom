import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Build an ffmpeg filter chain that adds 1.3x speedup + word-level
 * Playfair Display captions, pinned to a Whisper transcript.
 *
 * The transcript JSON is the one the reel-production skill writes during
 * Phase 4 (Whisper-large-v3 over the avatar audio). It carries one entry
 * per word with startSec/endSec timestamps.
 *
 * Caption styling matches the Higgsfield reference reels:
 *   - PlayfairDisplay-Regular, white, ~130pt
 *   - One word visible at a time, swapping at the next word's startSec
 *   - Subtle black border + shadow for contrast on varied B-roll
 *   - Position y=h*0.50 (the gap above the avatar's head)
 *
 * Speed: timings are POST-speedup, so Whisper times are divided by SPEED.
 */

const SPEED = 1.3;
const FONT_REL = "assets/fonts/PlayfairDisplay-Regular.ttf";
const FONT_SIZE = 130;
const Y_POS = "h*0.50";

type WhisperWord = { word: string; startSec: number; endSec: number };
type Transcript = { words: WhisperWord[]; duration?: number; text?: string };

export async function findTranscript(
  workspaceRoot: string,
  skillSlug: string
): Promise<string | null> {
  const dir = path.join(workspaceRoot, "output", "breaking", skillSlug);
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return null;
  }
  const matches = entries.filter(
    (f) => f.startsWith("transcript-") && f.endsWith(".json")
  );
  if (matches.length === 0) return null;
  // Pick the most recently modified.
  const stats = await Promise.all(
    matches.map(async (f) => ({
      file: f,
      mtime: (await fs.stat(path.join(dir, f))).mtimeMs,
    }))
  );
  stats.sort((a, b) => b.mtime - a.mtime);
  return path.join(dir, stats[0].file);
}

export async function buildCaptionFilter(
  transcriptPath: string,
  outFilterPath: string
): Promise<{ wordCount: number; filterChars: number }> {
  const raw = JSON.parse(
    await fs.readFile(transcriptPath, "utf8")
  ) as Transcript;

  // Merge Whisper artifacts into the canonical channel handle: the model
  // hears "@aisimplified" as "Jodas iSimplified" (or close variants). Show
  // it as one visual word spanning both whisper-word time-ranges.
  const merged: WhisperWord[] = [];
  for (let i = 0; i < raw.words.length; i++) {
    const w = raw.words[i];
    const next = raw.words[i + 1];
    const bareW = w.word.replace(/[.,;:!?]+$/, "");
    const isJodas = /^Jodas?$/i.test(bareW);
    const nextIsSimplified = next && /iSimplified/i.test(next.word);
    if (isJodas && nextIsSimplified && next) {
      merged.push({
        word: "@aisimplified",
        startSec: w.startSec,
        endSec: next.endSec,
      });
      i++;
      continue;
    }
    if (/^iSimplified$/i.test(bareW)) {
      merged.push({
        word: "@aisimplified",
        startSec: w.startSec,
        endSec: w.endSec,
      });
      continue;
    }
    merged.push({ word: w.word, startSec: w.startSec, endSec: w.endSec });
  }

  // Small per-token cleanups that Whisper consistently gets wrong.
  for (const w of merged) {
    w.word = w.word
      .replace(/^Mini$/g, "mini")
      .replace(/^DevBox$/g, "Devbox")
      .replace(/^Previews$/g, "Preview’s");
  }

  // Each word stays on screen from its startSec to the NEXT word's startSec
  // (no gap, no overlap). The last word holds until its own endSec.
  const captions = merged.map((w, idx) => {
    const nextStart = merged[idx + 1]?.startSec ?? w.endSec;
    return {
      word: w.word,
      startSec: w.startSec / SPEED,
      endSec: nextStart / SPEED,
    };
  });

  const escapeText = (t: string) =>
    t
      .replace(/\\/g, "\\\\")
      .replace(/:/g, "\\:")
      .replace(/'/g, "’")
      .replace(/"/g, '\\"')
      .replace(/%/g, "\\%");

  const drawCmds = captions.map((p) => {
    const text = escapeText(p.word);
    return [
      `drawtext=fontfile='${FONT_REL}'`,
      `text='${text}'`,
      `fontcolor=white`,
      `fontsize=${FONT_SIZE}`,
      `x=(w-text_w)/2`,
      `y=${Y_POS}`,
      `shadowcolor=black@0.55`,
      `shadowx=0`,
      `shadowy=4`,
      `borderw=3`,
      `bordercolor=black@0.35`,
      `enable='between(t,${p.startSec.toFixed(3)},${p.endSec.toFixed(3)})'`,
    ].join(":");
  });

  const filter = [
    `[0:v]setpts=PTS/${SPEED},${drawCmds.join(",")}[v]`,
    `[0:a]atempo=${SPEED}[a]`,
  ].join(";");

  await fs.writeFile(outFilterPath, filter, "utf8");
  return { wordCount: captions.length, filterChars: filter.length };
}
