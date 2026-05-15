import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { ingestUrl, slugify, TopicTooThinError, IngestedSource } from "./ingest";
import { generate, llmProvider, REEL_SCRIPT_SYSTEM, CRITIQUE_SYSTEM } from "./llm";
import { generateImage, generateThumbnailVariants, imageGenStatus } from "./fal";
import { createAvatarVideo, HEYGEN_DEFAULTS, heygenStatus } from "./heygen";
import { writeComposition, renderComposition, type Beat } from "./hyperframes";
import { captureEvent } from "./posthog";
import { db } from "./db";
import { ensureChromaWebm } from "./video";
import {
  downloadSourceVideo,
  cutBeatClips,
  pickSourceVideoUrl,
  type BeatClip,
} from "./source-video";

export type ReelEvent = {
  id: string;
  step: string;
  tool: string;
  label: string;
  detail?: string;
  status: "running" | "done" | "failed";
  output?: string;
  data?: Record<string, unknown>;
};

const CHANNEL_HANDLE = process.env.CHANNEL_HANDLE || "@aisimplified";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function* runReelFromUrl(url: string): AsyncGenerator<ReelEvent> {
  const startedAt = Date.now();

  // === Phase A: Ingest ===
  yield emit("ingest", "Phantom", "Ingest URL", `Reading ${truncateUrl(url)}`, "running");

  let source: IngestedSource;
  try {
    source = await ingestUrl(url);
  } catch (err) {
    if (err instanceof TopicTooThinError) {
      yield emit(
        "ingest",
        "Phantom",
        "Topic too thin",
        "Source body < 80 chars OR title empty",
        "failed",
        String(err.message)
      );
      return;
    }
    yield emit(
      "ingest",
      "Phantom",
      "Ingest failed",
      "Check URL or network",
      "failed",
      String(err instanceof Error ? err.message : err)
    );
    return;
  }

  const slug = `${source.type}-${slugify(source.title)}-${Date.now()}`;
  yield emit(
    "ingest",
    "Phantom",
    "Ingest URL",
    undefined,
    "done",
    `type:    ${source.type}\ntitle:   ${truncate(source.title, 80)}\nauthor:  ${source.authorHandle ?? source.authorName ?? "—"}\nbody:    ${source.body.length} chars\nmedia:   ${source.mediaUrls.length} item(s)`
  );

  // === Phase B: Editorial plan ===
  yield emit(
    "plan",
    "Editorial",
    "Pick tone + hook + beat count",
    "Single-pass v1 editorial brain",
    "running"
  );
  await sleep(600);

  const plan = pickPlan(source);
  yield emit(
    "plan",
    "Editorial",
    "Pick tone + hook + beat count",
    undefined,
    "done",
    `tone:         ${plan.tone}\nintent:       ${plan.intent}\nhook_pattern: ${plan.hook_pattern}\nbeat_count:   ${plan.beat_count}`
  );

  // === Phase C: Script (with rubric-rich system + optional critique pass) ===
  yield emit(
    "script",
    "Claude",
    "Draft script",
    `${plan.beat_count}-beat structure · middle-ground Varun register · ${llmProvider()} brain`,
    "running"
  );
  await sleep(900);

  const userPrompt = `Source title: ${source.title}
Source body (truncated):
${source.body.slice(0, 1500)}

Tone: ${plan.tone}
Hook pattern: ${plan.hook_pattern}
Beat count: ${plan.beat_count}

Draft the script following the register rules above. Return ONLY ${plan.beat_count} beat lines, one per line, no numbering.`;

  let scriptText = await generate({
    system: REEL_SCRIPT_SYSTEM,
    prompt: userPrompt,
    maxTokens: 1200,
  });

  // Phase 3: critique + single regen if real LLM is available.
  // Scripted brain skips this (its output is hardcoded anyway).
  if (llmProvider() !== "scripted") {
    const critique = await generate({
      system: CRITIQUE_SYSTEM,
      prompt: `Critique this script:\n\n${scriptText}\n\nReturn PASS or FAIL with reasons.`,
      maxTokens: 500,
    });
    if (/^FAIL/i.test(critique.trim())) {
      // Regen once with critique feedback baked in
      scriptText = await generate({
        system: REEL_SCRIPT_SYSTEM,
        prompt: `${userPrompt}\n\nThe previous draft failed critique:\n${critique}\n\nRewrite addressing each issue. Return ONLY the beat lines.`,
        maxTokens: 1200,
      });
    }
  }

  const beats = parseBeats(scriptText, plan.beat_count, source);
  yield emit(
    "script",
    "Claude",
    "Draft script",
    undefined,
    "done",
    `${beats.length} beats · ~${beats.reduce((s, b) => s + b.durationSec, 0).toFixed(1)}s total\n\n${beats.map((b, i) => `[B${i + 1}] ${truncate(b.voiceover, 72)}`).join("\n")}`
  );

  // === Phase 0.5: Source-video catalog (if X post has video) ===
  const sourceVideoUrl = pickSourceVideoUrl(source.mediaUrls);
  let beatClips: BeatClip[] | null = null;

  if (sourceVideoUrl) {
    yield emit(
      "source-scan",
      "Phantom",
      "Source video catalog + cut",
      "ffmpeg scan → per-beat clips at natural durations",
      "running"
    );
    try {
      const sourceVid = await downloadSourceVideo(sourceVideoUrl, slug);
      beatClips = await cutBeatClips(
        sourceVid,
        beats.map((b, i) => ({ index: i + 1, durationSec: b.durationSec })),
        slug
      );
      yield emit(
        "source-scan",
        "Phantom",
        "Source video catalog + cut",
        undefined,
        "done",
        `source: ${(sourceVid.durationSec).toFixed(1)}s\nclips: ${beatClips.length} cut\n${beatClips.map((c) => `  B${c.beatIndex}: t=${c.srcIn.toFixed(1)}-${c.srcOut.toFixed(1)}s (${c.durationSec.toFixed(1)}s)`).join("\n")}`
      );
    } catch (err) {
      yield emit(
        "source-scan",
        "Phantom",
        "Source video catalog failed (using Gemini fallback)",
        undefined,
        "failed",
        String(err instanceof Error ? err.message : err)
      );
      beatClips = null;
    }
  }

  // === Phase D: Asset gen (B-roll + avatar in parallel) ===
  const brollSource = beatClips
    ? `source-video clips (${beatClips.length})`
    : `${imageGenStatus()} images`;
  yield emit(
    "assets",
    "Fal + HeyGen",
    "Generate assets in parallel",
    `B-roll via ${brollSource} · avatar via HeyGen (${heygenStatus()})`,
    "running"
  );

  // B-roll: use source clips if we have them, else generate Gemini images
  const brollImagesPromise = beatClips
    ? Promise.resolve(
        beatClips.map((c) => ({
          url: c.compositionUrl,
          width: 1080,
          height: 1920,
          provider: "source-video" as const,
        }))
      )
    : Promise.all(
        beats.map((b) => generateImage(b.visualHint, { width: 1080, height: 1280 }))
      );

  const [brollImages, avatarVideo] = await Promise.all([
    brollImagesPromise,
    createAvatarVideo({
      script: beats.map((b) => b.voiceover).join("\n\n"),
      avatarLookId: HEYGEN_DEFAULTS.avatarLookId,
      voiceId: HEYGEN_DEFAULTS.voiceId,
      title: `phantom-${slug}`,
    }).catch((err) => ({
      videoId: `failed_${Date.now()}`,
      status: "failed" as const,
      videoUrl: "/demo/avatar-placeholder.mp4",
      error: String(err),
    })),
  ]);

  yield emit(
    "assets",
    "Fal + HeyGen",
    "Generate assets in parallel",
    undefined,
    "done",
    `b-roll: ${brollImages.length} via ${brollImages[0]?.provider ?? "fallback"}\navatar: ${avatarVideo.videoId} · status=${avatarVideo.status}`
  );

  // === Phase E: Compose + render ===
  yield emit(
    "compose",
    "HyperFrames",
    "Build composition + render",
    "1080×1920 · GSAP timeline · seam fade",
    "running"
  );

  // Resolve avatar src into a file the HyperFrames file-server can serve.
  // It serves from the composition root, so remote URLs work as-is and local paths
  // get staged into composition/assets/.
  const avatarSrc = await stageAvatarForComposition(
    avatarVideo.videoUrl || "/demo/sample-video.mp4",
    slug
  );

  // Chroma-key the green background into a transparent WebM (v67-style cutout).
  // The mp4 keeps the audio; the webm has the transparent video.
  let avatarAlphaSrc: string | undefined;
  if (!avatarSrc.startsWith("http")) {
    const compRoot = path.resolve(
      process.cwd(),
      process.cwd().endsWith("phantom") ? "composition" : "phantom/composition"
    );
    const mp4Abs = path.join(compRoot, avatarSrc);
    const webmAbs = mp4Abs.replace(/\.mp4$/i, ".webm");
    try {
      await ensureChromaWebm(mp4Abs, webmAbs);
      avatarAlphaSrc = `assets/${path.basename(webmAbs)}`;
    } catch (err) {
      // Non-fatal — composition will fall back to non-keyed mp4
      console.error("chroma-key failed:", err);
    }
  }

  // Bind beat-by-beat
  const compositionBeats: Beat[] = beats.map((b, i) => ({
    index: i + 1,
    voiceover: b.voiceover,
    durationSec: b.durationSec,
    visualHint: b.visualHint,
    captionText: b.captionText,
    brollUrl: brollImages[i].url,
    brollIsVideo: !!beatClips,
  }));

  await writeComposition({
    slug,
    beats: compositionBeats,
    avatarVideoUrl: avatarSrc,
    avatarAlphaUrl: avatarAlphaSrc,
    hookText: deriveHookText(compositionBeats[0].voiceover),
    channelHandle: CHANNEL_HANDLE,
  });

  let renderedPath = "";
  try {
    renderedPath = await renderComposition(slug);
  } catch (err) {
    yield emit(
      "compose",
      "HyperFrames",
      "Build composition + render",
      undefined,
      "failed",
      String(err instanceof Error ? err.message : err)
    );
    return;
  }

  yield emit(
    "compose",
    "HyperFrames",
    "Build composition + render",
    undefined,
    "done",
    `rendered: /reels/${slug}/final.mp4\nbeats: ${compositionBeats.length}\ntotal: ${compositionBeats.reduce((s, b) => s + b.durationSec, 0).toFixed(1)}s`
  );

  // === Phase F: Persist + capture ===
  yield emit("persist", "Phantom", "Save run + capture events", "SQLite + PostHog", "running");

  try {
    const channel = await ensureChannel();
    const totalDur = compositionBeats.reduce((s, b) => s + b.durationSec, 0);
    await db.video.create({
      data: {
        channelId: channel.id,
        title: source.title,
        topic: source.title,
        hook: deriveHookText(compositionBeats[0].voiceover),
        script: beats.map((b) => b.voiceover).join("\n\n"),
        videoUrl: `/reels/${slug}/final.mp4`,
        thumbnailUrl: brollImages[0]?.url,
        heygenVideoId: avatarVideo.videoId,
        status: "ready",
      },
    });
  } catch (err) {
    // Non-fatal — still emit done
    console.error("DB persist failed:", err);
  }

  await captureEvent("reel_generated_from_url", {
    source_url: url,
    source_type: source.type,
    slug,
    beat_count: compositionBeats.length,
    duration_sec: compositionBeats.reduce((s, b) => s + b.durationSec, 0),
    tone: plan.tone,
    hook_pattern: plan.hook_pattern,
    elapsed_ms: Date.now() - startedAt,
  });

  yield emit(
    "persist",
    "Phantom",
    "Save run + capture events",
    undefined,
    "done",
    `db: video record saved\nposthog: event=reel_generated_from_url`
  );

  // === Final event with the video URL ===
  yield {
    id: crypto.randomUUID(),
    step: "complete",
    tool: "Phantom",
    label: "Reel ready",
    status: "done",
    output: `/reels/${slug}/final.mp4`,
    data: { videoUrl: `/reels/${slug}/final.mp4`, slug },
  };
}

// === Helpers ===

async function stageAvatarForComposition(srcUrl: string, slug: string): Promise<string> {
  // Remote URLs pass through directly
  if (/^https?:\/\//.test(srcUrl)) return srcUrl;

  // Local path — find the file, copy it into composition/assets/, return relative URL
  const compRoot = path.resolve(
    process.cwd(),
    process.cwd().endsWith("phantom") ? "composition" : "phantom/composition"
  );
  const publicRoot = path.resolve(
    process.cwd(),
    process.cwd().endsWith("phantom") ? "public" : "phantom/public"
  );

  // Strip leading slash to map URL → public/ path
  const relativeFromPublic = srcUrl.startsWith("/") ? srcUrl.slice(1) : srcUrl;
  const srcFile = path.join(publicRoot, relativeFromPublic);

  try {
    await fs.access(srcFile);
  } catch {
    // Fallback: use the demo sample video if it exists
    const fallback = path.join(publicRoot, "demo", "sample-video.mp4");
    try {
      await fs.access(fallback);
      return await copyToCompositionAssets(fallback, compRoot, `avatar-${slug}.mp4`);
    } catch {
      throw new Error(`Avatar source not found: ${srcFile}`);
    }
  }

  return await copyToCompositionAssets(srcFile, compRoot, `avatar-${slug}.mp4`);
}

async function copyToCompositionAssets(
  srcFile: string,
  compRoot: string,
  destName: string
): Promise<string> {
  const assetsDir = path.join(compRoot, "assets");
  await fs.mkdir(assetsDir, { recursive: true });
  const destFile = path.join(assetsDir, destName);
  await fs.copyFile(srcFile, destFile);
  return `assets/${destName}`;
}

function emit(
  step: string,
  tool: string,
  label: string,
  detail: string | undefined,
  status: ReelEvent["status"],
  output?: string
): ReelEvent {
  return { id: crypto.randomUUID(), step, tool, label, detail, status, output };
}

async function ensureChannel() {
  let channel = await db.channel.findUnique({ where: { handle: CHANNEL_HANDLE } });
  if (!channel) {
    channel = await db.channel.create({
      data: {
        handle: CHANNEL_HANDLE,
        displayName: "AI Simplified",
        voiceId: HEYGEN_DEFAULTS.voiceId,
        avatarLookId: HEYGEN_DEFAULTS.avatarLookId,
      },
    });
  }
  return channel;
}

type Plan = {
  tone: "dark-humor" | "warm-humor" | "ironic-deadpan" | "sincere-awe" | "urgent-breaking" | "quiet-observation";
  intent: "news" | "launch" | "take" | "tutorial" | "culture";
  hook_pattern: "wrong-assumption-first" | "shock-fact" | "tension-then-twist" | "question-then-answer" | "list-promise";
  beat_count: 4 | 5 | 6;
};

function pickPlan(source: IngestedSource): Plan {
  const text = (source.title + " " + source.body).toLowerCase();

  // Tone heuristic
  let tone: Plan["tone"] = "sincere-awe";
  if (/layoff|fired|wind.?down|deprecat|shut.?down|die|death|kill/.test(text)) tone = "quiet-observation";
  else if (/launch|release|introduc|announc|ship/.test(text)) tone = "sincere-awe";
  else if (/breaking|just (now|in)|moments ago/.test(text)) tone = "urgent-breaking";
  else if (/drama|controvers|backlash|outrage|fued/.test(text)) tone = "dark-humor";
  else if (/tutorial|how to|here'?s how|guide/.test(text)) tone = "warm-humor";

  // Intent
  let intent: Plan["intent"] = "news";
  if (/launch|release|announc/.test(text)) intent = "launch";
  else if (/tutorial|how to|guide/.test(text)) intent = "tutorial";
  else if (/think|believe|opinion|take|argue/.test(text)) intent = "take";
  else if (/meme|culture|community|vibe/.test(text)) intent = "culture";

  // Hook pattern
  let hook_pattern: Plan["hook_pattern"] = "wrong-assumption-first";
  if (intent === "launch") hook_pattern = "tension-then-twist";
  else if (/\d+%|\d+x|\d+ billion|\d+ million/.test(text)) hook_pattern = "shock-fact";
  else if (intent === "tutorial") hook_pattern = "list-promise";

  // Beat count by source length
  const beat_count: Plan["beat_count"] =
    source.body.length < 400 ? 4 : source.body.length < 1200 ? 5 : 6;

  return { tone, intent, hook_pattern, beat_count };
}

// Note: SCRIPT_SYSTEM was inlined here for v1; v2 uses REEL_SCRIPT_SYSTEM
// imported from ./llm which contains the full reel-production rubric port.

function parseBeats(
  scriptText: string,
  targetCount: number,
  source: IngestedSource
): Array<{ voiceover: string; durationSec: number; visualHint: string; captionText: string }> {
  const lines = scriptText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#") && !l.startsWith("//"))
    .map((l) => l.replace(/^\[[^\]]+\]\s*/, "")) // strip [HOOK] etc.
    .map((l) => l.replace(/^\d+[\.\)]\s*/, "")); // strip "1. " etc.

  // Pad or trim to targetCount
  while (lines.length < targetCount) {
    lines.push(deriveBeatFromSource(source, lines.length));
  }
  const trimmed = lines.slice(0, targetCount);

  return trimmed.map((voiceover, i) => {
    const wordCount = voiceover.split(/\s+/).length;
    const durationSec = Math.max(3, Math.min(15, wordCount / 2.15)); // 2.15 WPS
    return {
      voiceover,
      durationSec,
      visualHint: deriveVisualHint(voiceover, source, i),
      captionText: deriveCaption(voiceover),
    };
  });
}

function deriveBeatFromSource(source: IngestedSource, index: number): string {
  // Fallback beats if LLM under-delivers
  const fallbacks = [
    source.title,
    source.body.split(/[.!?]/)[0]?.trim() || "Here's the thing —",
    source.body.split(/[.!?]/)[1]?.trim() || "The catch:",
    `Source: ${source.authorHandle ?? source.url}`,
    `Save this. Follow @aisimplified for more.`,
  ];
  return fallbacks[index] ?? fallbacks[fallbacks.length - 1];
}

function deriveVisualHint(voiceover: string, source: IngestedSource, beatIndex: number): string {
  // First beat tends to be the hook — pick something dramatic
  if (beatIndex === 0) {
    return `cinematic vertical 9:16 close-up illustration, ${source.title}, dramatic lighting, dark background, photoreal`;
  }
  // Last beat: brand/cta vibe
  if (voiceover.toLowerCase().includes("aisimplified") || voiceover.toLowerCase().includes("save")) {
    return `minimal abstract cyan glow on black, vertical, modern tech aesthetic`;
  }
  // Middle: derive from voiceover words
  const focus = voiceover.split(/\s+/).slice(0, 8).join(" ");
  return `vertical 9:16 illustration, ${focus}, modern editorial style, dramatic lighting`;
}

function deriveCaption(voiceover: string): string {
  // Take the first ~6-8 words; uppercase the punchy fragment
  const words = voiceover.split(/\s+/).slice(0, 8).join(" ");
  return words.replace(/[.!?,;:]$/, "");
}

function deriveHookText(firstBeat: string): string {
  // Big hook overlay text — the punch
  return firstBeat.replace(/[.!?]$/, "").trim();
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + "…";
}

function truncateUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname}${u.pathname.slice(0, 30)}${u.pathname.length > 30 ? "…" : ""}`;
  } catch {
    return url.slice(0, 50);
  }
}
