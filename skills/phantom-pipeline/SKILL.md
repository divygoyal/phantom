---
name: phantom-pipeline
description: Autonomous URL-to-reel pipeline for @aisimplified. Takes an X post or article URL as input, produces a 1080×1920 vertical reel via HyperFrames composition (NOT Remotion). Designed to run inside the Phantom agent runtime (Next.js app at C:\Users\DivyGoyal\Desktop\heygen trial\phantom) — not in interactive Claude chat. v1 is a simplified 4-6 beat reel; the full @aisimplified editorial brain lives in the separate reel-production skill, which this does NOT modify. Use when the user asks the Phantom agent to "ingest this URL", "make a reel from this tweet", or to run autonomously.
---

# phantom-pipeline — autonomous URL→reel for the Phantom agent

This skill is the editorial brain for the **Phantom agent runtime** (Next.js app). It defines the URL→reel pipeline that runs without a human in the loop. The agent reads this skill at runtime and uses it as its source of editorial judgment.

**This skill is NOT the reel-production skill.** The reel-production skill is your manual interactive workflow with Claude in chat — 716 lines of rubrics, 30+ reference docs, full editorial-brain depth, Remotion-based composition. **Leave it alone.** This skill is the autonomous, simpler, HyperFrames-based v1 that ships *good* reels without you in the loop — not @aisimplified-grade hand-crafted reels.

```
reel-production (your manual skill)   →   you + Claude in chat → 30-60 min/reel → hand-crafted quality
phantom-pipeline (this skill)         →   agent runs solo → 5-10 min/reel → credible autonomous quality
```

---

## Locked-in choices — never re-litigate

- **Output format:** 1080×1920 vertical reel. 25-60 seconds. Never landscape.
- **Avatar visible bottom 40%** — the same @aisimplified rule. Top 60% is asset zone.
- **Channel handle: `@aisimplified`** — in any CTA / handle slot.
- **Composition engine: HyperFrames** — `hyperframes` CLI (`npx hyperframes render`). Never Remotion in this pipeline. The reel-production skill stays on Remotion; this is parallel infrastructure.
- **Voice:** the imported voice in HeyGen (env `HEYGEN_VOICE_ID`). Currently Raunak M. Do not re-clone.
- **Avatar:** the public look (env `HEYGEN_AVATAR_LOOK_ID`). Currently the public avatar provided by user.
- **No paid LLM SDK calls in v1.** The agent uses the Phantom runtime's LLM abstraction (`src/lib/llm.ts`) which defaults to `scripted` — pre-baked editorial reasoning. Anthropic / claude-code modes are pluggable but not required.
- **No live-render in demos.** Pre-render real reels offline; demos play them back. Live HeyGen render takes 5-10 min — too long for a demo slot.
- **Beat count: 4-6.** Not 12 (V46), not 19 (V47). This is the v1 ceiling.
- **Output goes to** `phantom/public/reels/<slug>/final.mp4`. Intermediate artifacts (script, plan, raw avatar) live in `phantom/output/<slug>/`.

---

## Pipeline overview — 6 phases

```
Phase A — Ingest URL              (lib/ingest.ts)
Phase B — Editorial plan          (LLM + scripted brain)
Phase C — Script + beat plan      (LLM + locked-in register)
Phase D — Asset generation        (HeyGen avatar segments + Fal B-roll, parallel)
Phase E — HyperFrames composition (HTML template fill + hyperframes render)
Phase F — Verify + publish        (Read frame samples + fire PostHog events)
```

Each phase emits an `AgentEvent` over the SSE stream. The Live Run UI consumes them and renders the timeline.

---

## Phase A — Ingest URL

The agent accepts these URL forms (v1):

| Source | Mechanism | Reliability |
|---|---|---|
| X post (`x.com/.../status/...` or `twitter.com/...`) | Syndication API `https://cdn.syndication.twimg.com/tweet-result?id=<ID>&token=a` | High — public, no auth |
| Article URL (Substack / Medium / Verge / etc.) | `fetch` + `cheerio` extract `<article>` / `og:description` / `og:image` | High for static, brittle for JS-rendered |
| Reddit thread | `<url>.json` suffix | High |
| YouTube transcript | `youtube-transcript` package | High |

**Output of Phase A:**

```ts
type IngestedSource = {
  type: "x" | "article" | "reddit" | "youtube";
  url: string;
  title: string;
  body: string;          // canonical text content
  authorHandle?: string;
  authorName?: string;
  mediaUrls: string[];   // images / videos referenced inline
  publishedAt?: string;
}
```

**Hard gate:** if `body.length < 80 chars` OR `title` is empty → the topic is too thin. The agent should emit a "topic_too_thin" event and stop. Don't generate a script on vapor.

---

## Phase B — Editorial plan

The agent picks four things, in order. **Each is a single decision.** No multi-rubric depth like reel-production has.

```ts
type EditorialPlan = {
  tone: "dark-humor" | "warm-humor" | "ironic-deadpan" | "sincere-awe" | "urgent-breaking" | "quiet-observation";
  intent: "news" | "launch" | "take" | "tutorial" | "culture";
  hook_pattern: "wrong-assumption-first" | "shock-fact" | "tension-then-twist" | "question-then-answer" | "list-promise";
  beat_count: 4 | 5 | 6;
}
```

**Tone-picking rules (simplified — full taste lives in reel-production):**

| Source signal | Likely tone |
|---|---|
| Layoff / wind-down / death / safety incident | `quiet-observation` or `sincere-awe` (never warm-humor) |
| Model launch / feature drop | `sincere-awe` (default) or `ironic-deadpan` (if launcher has hype history) |
| Drama / discourse | `dark-humor` or `ironic-deadpan` |
| Tutorial / how-to | `warm-humor` (default) or `sincere-awe` |
| Breaking news (just-happened) | `urgent-breaking` |
| Culture-meme / observation | `quiet-observation` or `dark-humor` |

**The full nuance lives in `reel-production/references/decision-rubrics.md`** — but v1 doesn't read it. v1 picks the dominant tone and ships. v2 will plug the full rubric in.

**Hook pattern:** prefer `wrong-assumption-first` for take/opinion topics (PostHog says it converts 4× on @aisimplified). Use `shock-fact` for benchmark news. Use `tension-then-twist` for launches.

**Beat count:** `4` for sub-30s reels (news / single-fact), `5` for 30-45s, `6` for 45-60s. Default `5`.

**Output of Phase B:** appended to the agent run record.

---

## Phase C — Script + beat plan

The script is generated by the LLM using the editorial plan + ingested source. Each beat is one line, one thought.

**Beat structure (5-beat default):**

```
B1 (0-3s)    HOOK            — must promise the punch in <12 words; no "in this video"
B2 (3-12s)   SETUP           — the wrong assumption / the context
B3 (12-25s)  PAYOFF          — the actual insight / the reveal
B4 (25-38s)  PROOF           — a specific example / a number / a quote from the source
B5 (38-50s)  CALL            — what the viewer should think / save / do
```

**Voice register (locked):** middle-ground Varun.
- 12-18 words per beat
- Connectors allowed: "Then", "So", "Here's the thing —", "The catch is —"
- Specifics retained: numbers, names, model versions, dollar amounts
- Forbidden openers: "Hi", "Hey", "So today", "Welcome", "Let me tell you"
- Forbidden closers: "Tag 3 friends", "Follow for more", "Smash that like"
- Always say `@aisimplified` (never `@yourchannel`)

**Read-aloud test (mandatory):** the LLM produces a draft; the agent re-checks: does each beat sound like a friend talking? If a beat has narrator-cadence drift (e.g. "In this video, we will explore..."), flag and rewrite.

**Output of Phase C:**

```ts
type Script = {
  beats: Array<{
    index: number;
    voiceover: string;
    durationSec: number;        // estimated at 2.15 WPS
    visualHint: string;         // 8-word description for Fal B-roll prompt
    captionText: string;        // short overlay text (3-7 words)
  }>;
  totalDurationSec: number;
};
```

---

## Phase D — Asset generation

All assets generate in **parallel**. Two channels:

### Channel 1: Avatar segments (HeyGen)

For each beat (1...N), call HeyGen avatar API with that beat's voiceover. Receive a 1080×1920 mp4. Each call: 30s–2min.

```ts
for (const beat of script.beats) {
  const video = await createAvatarVideo({
    script: beat.voiceover,
    avatarLookId: HEYGEN_DEFAULTS.avatarLookId,
    voiceId: HEYGEN_DEFAULTS.voiceId,
    title: `phantom-${slug}-b${beat.index}`,
  });
  // poll until status === "completed"
}
```

**Concurrency:** HeyGen's free plan limits concurrent renders. Run sequentially OR with `await Promise.all` if concurrency is allowed. In `scripted` fallback mode (no HEYGEN_API_KEY), use the demo placeholder from `phantom/public/demo/avatar-placeholder.mp4`.

### Channel 2: B-roll images (Fal FLUX)

For each beat, generate one B-roll image from the `visualHint`. Optionally also generate a thumbnail variant for the cover frame.

```ts
const brollImages = await Promise.all(
  script.beats.map(b => generateImage(b.visualHint, { width: 1080, height: 1080 }))
);
const thumbnails = await generateThumbnailVariants(script.beats[0].voiceover, 4);
```

---

## Phase E — HyperFrames composition

The reel is composed in HTML using HyperFrames. The template lives at `phantom/composition/index.html`. The agent fills in placeholders and invokes the render.

### Composition layout (1080×1920, locked)

```
┌────────────────────────────────┐ y=0
│                                │
│      ASSET ZONE (60%)          │
│   B-roll image + caption       │
│   Hook overlay on B1           │
│                                │
├────────────────────────────────┤ y=1152 (60%)
│                                │
│      AVATAR ZONE (40%)         │
│   HeyGen avatar segment        │
│   (chroma'd or framed)         │
│                                │
└────────────────────────────────┘ y=1920
```

- Top 60% (y=0 to y=1152): rotating B-roll asset per beat, with caption text overlaid (bottom of asset zone, large font)
- Bottom 40% (y=1152 to y=1920): the HeyGen avatar segment, played at native size or scaled

### Composition file pattern

The HTML composition has:
- Hidden `<video>` element per beat preloading the avatar segment
- Hidden `<img>` per beat with the B-roll
- A GSAP timeline driving:
  - Per-beat scene change (asset swap + caption swap + avatar segment cue)
  - Caption animation (slide up + fade)
  - Hook overlay on B1 (full-frame, fades after 2.5s)
  - Outro card on last 1s (channel handle + "subscribe")

The agent generates this HTML by filling a template (`phantom/composition/template.html`) with the script's beat data + asset URLs.

### Render command

```bash
cd phantom/composition
npx hyperframes render \
  --input index.html \
  --output ../public/reels/<slug>/final.mp4 \
  --duration <totalDurationSec> \
  --width 1080 --height 1920
```

Render time: 30-90s for a 50s reel. CPU/GPU-bound, depends on machine.

---

## Phase F — Verify + publish

1. **Frame sample:** extract a frame at `t = beat.start + beat.duration/2` for each beat. Read each. Confirm:
   - Asset matches beat's `visualHint`
   - Caption matches beat's `captionText`
   - Avatar visible in bottom 40%
   - No black gap at the seam

2. **Mobile-safe sibling encode** (the @aisimplified rule):
   ```bash
   ffmpeg -y -i final.mp4 -c:v libx264 -preset slow -crf 20 \
     -profile:v high -level 4.0 \
     -vf "scale=in_range=full:out_range=tv,format=yuv420p" \
     -movflags +faststart \
     -c:a aac -b:a 192k -ar 48000 -ac 2 \
     final-mobile.mp4
   ```

3. **PostHog capture:**
   ```ts
   await captureEvent("video_published", {
     video_id: slug,
     source_url: input.url,
     beat_count: script.beats.length,
     duration_sec: script.totalDurationSec,
     hook_pattern: plan.hook_pattern,
     tone: plan.tone,
   });
   ```

4. **Persistence:** save the run record to SQLite (Phantom's DB) with the final video URL pointing at `/reels/<slug>/final.mp4`.

---

## Hard gates (the agent halts on any of these)

1. URL ingestion fails OR body < 80 chars OR title empty → "topic_too_thin"
2. LLM script generation returns no `[HOOK]` block in first beat → re-prompt once, then fail
3. Avatar render times out (>5 min per beat) → fall back to scripted/demo segment, log
4. HyperFrames render exits non-zero → emit failure event, save partial artifacts for debug
5. Output mp4 is < 5 seconds OR > 90 seconds → fail (likely wrong duration calc)

---

## What v2 will add (and what reel-production already does)

| Capability | v1 (this skill) | v2 (port from reel-production) |
|---|---|---|
| Editorial rubrics | 1 tone-picker, simple hook patterns | 7 rubrics (R1-R7) with full catalogs |
| Critique loop | None — single-pass | Phase 3 critique with auto-fails + revisions |
| Beat structures | 4-6 beat default | V46 (12-beat), V47 (19-beat), 9-beat-news, etc. |
| SFX | Library presets only | Hand-authored per-beat SFX cues with rationale |
| Captions | Plain text overlay | Whisper-pinned, animated, Hormozi/Cooper typography |
| Asset modes | Fullbleed default | Fullbleed / landscape-card / chroma-cutout based on subject |
| Hook clip pre-trim | None | Auto-trim first 2-3s of build-up |
| Asset verification | Frame sample + Read | Full Phase 4.3 verification gate per asset |

When v2 lands: the agent imports `reel-production/references/*.md` at runtime and switches editorial mode based on a `--quality high` flag.

---

## How the Phantom Next.js runtime uses this skill

The Phantom agent (`phantom/src/lib/reel.ts`) reads this `SKILL.md` at startup and:

1. Parses out the locked-in choices section → uses as system prompt
2. Uses the Phase B tone-picking table → tone selection logic
3. Uses the Phase C voice register rules → script generation prompts
4. Uses the Phase D parallel asset generation pattern → calls heygen.ts + fal.ts
5. Uses the Phase E composition layout → fills the HyperFrames template
6. Uses the Phase F verification pattern → calls posthog.captureEvent + saves DB record

If `LLM_PROVIDER=scripted` (default), the agent's editorial decisions come from canned patterns inspired by this skill. If `LLM_PROVIDER=anthropic` or `claude-code`, the LLM reads this skill as its system prompt and makes live decisions.

---

## Demo mode (for the hackathon)

For live demos, the agent runs Phases A-D live (showing reasoning), but **Phase E rendering is replaced with playback of a pre-rendered reel** at `phantom/public/demo-reel.mp4`. Honest framing:

> *"The agent reasoned live against the URL you gave me. The render is what it produced at 6am this morning from a similar URL — full HeyGen + HyperFrames pipeline. Live render takes 5-10 minutes, so you're seeing the artifact, not the render."*

This is documented and defensible. Judges respect honesty about render time more than they punish pre-rendering.

---

## Quick-start checklist

When the Phantom agent receives a URL:

1. **Phase A** — ingest URL, validate `body.length >= 80`. Halt if too thin.
2. **Phase B** — pick tone + intent + hook pattern + beat count (5 default). Persist editorial plan.
3. **Phase C** — generate script via LLM. Apply read-aloud test. Reject narrator-cadence drift.
4. **Phase D** — kick off avatar renders (HeyGen) + B-roll generation (Fal) in parallel. Poll until all complete.
5. **Phase E** — fill HyperFrames template + render via `npx hyperframes render`. Wait for mp4.
6. **Phase F** — frame-sample + mobile-encode + PostHog capture + DB save.
7. Emit `done` event with final video URL. UI plays it inline.

---

## What NOT to do

- Don't modify `reel-production/SKILL.md` or any of its references. This is parallel, not replacement.
- Don't render landscape (16:9). Always vertical (9:16).
- Don't generate scripts longer than 6 beats in v1.
- Don't hide the avatar — bottom 40% always visible.
- Don't use `@yourchannel` — always `@aisimplified`.
- Don't run live-render during a demo presentation. Pre-bake.
- Don't trust planned beat durations against HeyGen actuals — for v1, accept the drift; v2 adds Whisper-pin.
- Don't promise hand-crafted quality. v1 is "credible autonomous". Honest framing wins.
