---
name: reel-production
description: Produce viral 1080×1920 vertical YouTube Shorts / Reels at C:\Users\DivyGoyal\Desktop\heygen trial. The skill applies real editorial judgment — not template execution — across hook design, structure, tone (dark-humor / warm-humor / ironic-deadpan / sincere-awe / urgent-breaking / quiet-observation), effects, SFX, image generation, and animation. Editorial brain runs Phase 0 intake → Phase 1 rubric pass → Phase 2 draft → Phase 3 critique pass → Phase 4 asset gen → Phase 5 render. Use when the user asks to make a reel, swap an asset, redesign a beat, change the script, retone, recritique, or re-render. Channel handle is @aisimplified and the avatar is always visible bottom 40% (never hidden).
---

# Reel production — editorial brain layered on the V46/V47 pipeline

This skill is the editor-in-chief for @aisimplified's reel pipeline. It does not just render — it *decides*: what hook this story deserves, what structural shape, what tonal palette, what the cover frame promises. The decisions go through rubrics; the rubrics go through critique; the critique gates render.

When in doubt about a specific decision, **load the corresponding `references/<X>.md`** for the catalog or rubric. SKILL.md is intentionally tight — 7 rubrics, 1 critique loop, 5 phases.

---

## Locked-in choices — never re-litigate

- **Avatar is ALWAYS visible bottom 40%.** Never add a layout to `HIDE_AVATAR_LAYOUTS`. Two compositional paradigms are valid:
  - **Legacy (`AVATAR_SEAM_Y=1020`)**: cream/light canvas, avatar as CSS-shifted PIP below the seam, visuals capped at the seam. Default for V46/V47 reels.
  - **V67+ black-canvas chroma-cutout**: pure black canvas, avatar is full-frame chroma'd against black, assets sit in a top zone (extends to y=1300 in fullbleed mode) that fades into the avatar zone via a 600 px multi-stop gradient. Use for "I'm-on-camera" cinematic energy or when sources are a mix of portrait/tall and 16:9 (the two-mode `TopPaneClip` handles both). See `references/render-cookbook.md` §V67 for the full recipe (chroma source requirements, edge-fringe overscan, scribble clip, card boxShadow rules).
- **`AVATAR_SEAM_Y = 1020`** (in `src/remotion/constants.ts`) — used directly by the legacy paradigm AND by V67+ card-mode (computes the card's bottom edge).
- **User's YouTube channel: `@aisimplified`.** Use it in any CTA / comment-mockup / social-handle slot — never `@yourchannel`.
- **Stage 1 artifacts (script, visual plan, SFX cues, editorial-brief, critique-log) are produced by Claude in chat.** No paid LLM SDK calls — those modules were ripped out.
- **Hook video is user-provided by default (validated 2026-05).** The user places the hook clip directly at `assets/research/<brand>/animated/<brand>-hero.mp4` (or the path B1's `assetSrc` references) — typically generated externally via Meta AI / Sora 2 / their own browser session, where they can iterate freely on look + likeness. Phase 4 **MUST check this file exists before running ANY Gemini/Veo hook generation**; if present, log "hook user-provided" in the editorial-brief and skip the hook gen step. Other B-roll assets (body beats, calendar cards, tweet cards) still flow through normal Phase 4 generation.
- **Hook clip pre-trim (validated 2026-05-14):** the first 2-3 seconds of user-supplied hero clips are typically slow build-up (fade-in, camera dolly, character assembly). The DRAMATIC frame lives at t=3-5. **Default workflow:** trim the first ~2 seconds off the user file before assigning to B1 with `ffmpeg -y -ss 2 -i <user-file> -c copy <trimmed>`, then use the trimmed clip starting at frame 0 of the reel. **Frame 0 should be the hook punch, not the build-up.** Override only when the user explicitly wants the full build (rare).
- **Hook placement (corrected 2026-05-14):** user hero is **B1 from frame 0**. The earlier text-only-lead-in-then-hero pattern (Googlebook v1/v2, DeepMind, Higgsfield v1) was based on a misreading of "use it after 3 seconds" — the user meant "use the clip from second 3 onward" (i.e., trim first 2-3s), not "place the clip at the 3s mark of the reel." Frame 0 = punchiest visual the user supplies.
- **Asset-mode decision is subject-placement, NOT aspect-ratio (refined 2026-05-15 after trumpt1 session):** the earlier "16:9 → landscape-card by default" rule overcorrected after the Higgsfield session. **The actual question:** *would a vertical 9:16 crop keep the meaningful content in frame?* If yes → `fullbleed` (subject fills the screen, more dramatic). If no → `landscape-card` (preserves full horizontal context with letterbox).

  | Source content type | Mode | Why |
  |---|---|---|
  | Product photography, subject centered + dominant | **fullbleed** + `objectPosition: 'center'` | Subject fills the screen; far more dramatic than a small inset |
  | Product photography, subject offset left/right | **fullbleed** + `'left center'` / `'right center'` | Per-beat object-position tuning keeps subject in frame |
  | UI demo with wide panels / multi-column info | **landscape-card** | Center-crop would lose peripheral panels (Higgsfield Supercomputer flow case) |
  | Cinematic / wide-ensemble shots | **landscape-card** | Multi-element framing depends on full width |
  | Talking-head face center-frame | **fullbleed** | Face full-height more engaging than letterboxed inset |
  | Final brand card / centered text | **fullbleed** | Text reads larger, more impact |
  | User hero (portrait stylized) | **fullbleed** | Hero IS the dramatic frame |

  **Per-beat Phase 4.4 workflow:** for each beat, look at the Phase 0.5 catalog midframe and ask: "is the meaningful content in the center 35% horizontal of the frame?" If yes → fullbleed. If the content is spread across the full width (multi-column UI, product layout with accessories on sides, multi-character ensemble) → landscape-card. Default for ambiguous cases: fullbleed with `objectPosition: 'center'` (vertical impact almost always wins over letterboxed inset).
- **`assetSpeedRatio` field (validated 2026-05-14):** optional plan-schema field. When a source demo runs longer than the beat slot (e.g., podcast-gen demo is 8s but the beat is 4.5s), set `assetSpeedRatio: 1.78` so the full demo fits without trimming mid-action. Wired into `OffthreadVideo playbackRate` in V40Router. **Acceptable range 1.0-1.6×** — past 1.6× UI demos look frantic. Past 2.0× looks broken. For severely over-budget cases, prefer the source-first workflow (see Phase 0.5) over speed-ramp.
- **Veo 2 (`veo-2.0-generate-001`) for image-to-video** when free-tier or batch B-roll. Requires `durationSeconds ∈ [5,8]`. Veo 3.1 for hero shots with synced audio. Veo accepts stylized AI-gen stills (comic-book, photoreal scenes) but refuses recognizable real-celebrity stills as input.
- **Gemini Nano Banana Pro (`gemini-3-pro-image-preview`)** for stills, with brand logo as `refs[]` reference image so the model doesn't hallucinate text. **VALIDATED 2026-05: feeding a recognizable public-figure photo as `refs[]` is now hard-blocked by the safety filter** — refused across military / soft-style-reference / fantasy-superhero framings (3 separate prompt attempts, all returned empty `parts` array silently). For celebrity-adjacent hooks, use either (a) pure text feature description without a ref image — produces fictional general-likeness character that ships; (b) the user-provided hook path above; or (c) the Meta AI short re-costume pattern in `references/prompts/meta-ai.md`. Brand-logo refs[] for non-person assets still works.
- **Comic / satire / relatable hook style.** Simple direct script — never "robotic AI" voice. **Test by reading aloud — if it doesn't sound like a friend talking, rewrite.** For tutorial/recipe content specifically, **never narrate stepwise** ("Step one — Step two —") — write the body as ONE continuous voice; see `references/script-writing.md` §9. For hot-take / comparison / model-vs-model reels (`tech-conflict`, `SaaS-opportunity`, `model-launch + comparison framing`) load `references/script-writing-saas-angle.md` for the validated 6-step argument arc + credible-caveat rule + Pattern B topic-meta rebuttal close. **Register failure modes** documented in `references/script-writing.md` §10: written-aphorism closes ("X is solved. Y isn't."), stacked filler tics ("Bro. Look. Like."), and formula-transition phrases ("Catch is —", "Here's the part that gets me —") are all auto-fails (#31-33 in `critique-rubrics.md`).
- **Script register: middle-ground Varun (validated 2026-05-14).** The earlier punchy-fragment register (8-12 words/beat) loses sound-off viewers because the avatar voice names features faster than the on-screen UI demos resolve. The fully-explanatory register (25+ words/beat) reads as a tutorial, kills pace. **Default register going forward: middle-ground.** 12-18 words per beat, 5-7s beat durations, ONE light connector per beat (`then`, `the way it works`, `that's how`), specifics retained (numbers, names, filters), mechanism-explanation skipped unless critical. Continuity glue between beats (`Then it...`, `And the best part —`, `So yeah —`). See `references/script-writing.md` §11 for the punchy/middle/explanatory comparison table + worked examples.
- **HeyGen avatar WPS calibration (revised 2026-05-15, 5-reel sample):** budget words at **2.0–2.3 WPS** (mean ~2.15) for ironic-deadpan / matter-of-fact / sincere / warm-humor registers — NOT 2.7+. Empirical range across recent reels: Googlebook 2.32, DeepMind cursor 1.97, hfsuper v3 2.14, hfsuper v4 2.20. Pacing varies in BOTH directions vs script estimate (10-20% shorter OR longer depending on register weight). Plan beat durations at 2.15 WPS midpoint AND (mandatory) Whisper-pin after the avatar comes back — see Phase 5. Curious / dry / amused / whisper registers run on the slower end (~2.0); punchy / matter-of-fact run on the faster end (~2.3).
- **End-of-reel outro overlay (`Reel.tsx`).** The Remotion composition stamps a 1-second outro card via `OutroNeonCard` over the LAST 1s of every reel, regardless of B-final's layout. The channelHandle prop there is hardcoded — must read `@aisimplified`, not `@yourchannel`. Also check `SubscribeCTA.tsx:47` and `PhoneMockupCTA.tsx:31` defaults if you add new CTA layouts. The end-card B-beat (YouTubeCommentCTA / OutroNeonCard / CommentSaveCTA / PhoneMockupCTA) and this hardcoded last-second stamp can clash visually — keep B-final ≥1.5s so the underlying CTA registers before the overlay takes the final frame.
- **Asset-verification gate after ffmpeg cuts.** When slicing B-roll from a source video by timestamp, the timestamps in your editorial brief are guesses against an external video; the actual content at those timestamps may not match your label. **MANDATORY:** after cutting `gb-bN-<feature>.mp4`, Read the midframe `output/asset-inspection/...` and confirm it matches the beat's voiceover claim BEFORE running `build-<brand>-plan.mts`. The Googlebook B1 leadin shipped with Tokyo photo collage instead of the rainbow LED bar because the cut was t=50–53 (transition window) rather than t=4–7 (actual LED reveal) — caught only at post-render verification, too late to fix without re-render.

---

## Pipeline overview — 5 phases

```
Phase 0 — Editorial intake (12-field checklist; topic-classifier.md)
Phase 1 — Rubric pass (7 selectors → editorial-brief.md)
Phase 2 — Draft (script.txt + visual-plan-*.json + sfx-cues-*-final.json)
Phase 3 — Critique pass (scorecard + auto-fails → critique-log.md)
Phase 4 — Asset generation (Gemini stills → Veo i2v)
Phase 5 — Render + verify (render-with-heygen.ts)
```

**Do not skip Phase 3.** The critique pass is where the editorial brain pays for itself — it catches mechanical defaults before render. Three render cycles you save = 30 minutes back.

---

## Invocation patterns (conversational)

The skill recognises these natural-language triggers (no slash commands):

| User says | Skill does |
|---|---|
| "make a reel about <topic>" / "reel from this tweet <url>" | Full Phase 0–5 pipeline. Phase 0 hard-gates if topic is too thin. |
| "rehook this" / "the hook is weak" | Re-run only R1 (HOOK rubric); rewrite first 2 beats; re-run Phase 3 critique on those beats. |
| "swap the tone to <palette>" / "make it more deadpan / dark / awe" | Re-run R3 (TONE); regenerate caption stack, EL tags, SFX feel, music bed, MG intensity across all beats; preserve script content. |
| "critique this draft" / "score it" | Phase 3 only; write a new pass to `critique-log.md`; no revisions unless asked. |
| "redo beat <N>" | Rewrite voice line, layout, asset prompt, SFX cues for one beat; re-run Phase 4 asset gen for that beat only. |
| "swap structure to <variant>" | Re-run R2 (STRUCTURE); offer beat-mapping diff before committing. |
| "make it punchier / less hype / more dark / more sincere" | See `references/user-feedback-vocabulary.md` — translate feedback to specific rubric actions. |

---

## Phase 0 — Editorial intake

**Goal:** populate 12 intake fields BEFORE any drafting. No defaults without explicit reasoning.

The intake works from the source material the user dropped (tweet URL, article, topic prompt). Run the topic classifier (`references/topic-classifier.md`) to derive the 12 fields:

```yaml
topic_class: <one of: model-launch | feature-drop | benchmark-news | research-paper | acquisition | drama/discourse | culture-meme | tutorial-howto | hot-take-opinion | death/layoff/wind-down | safety-incident | regulation-policy>
emotional_thesis: <one sentence ≤12 words — what feeling does the viewer leave with?>
audience_persona_lean: <AI-curious-IN | AI-curious-US | AI-builder-IN | AI-builder-US | mixed-default>
reel_intent: <news | launch | take | tutorial | culture>
pacing_target: <"<25s sprint" | "25-40s standard" | "40-55s sweet-spot" | "55-70s deep">
stakes: <low | medium | high | grave>
hype_charge: <-2 | -1 | 0 | +1 | +2>
taboo_zones: [<list>]
novelty_budget: <last-5-reels archetypes/effects/SFX/tones used>
tonal_target_primary: <dark-humor | warm-humor | ironic-deadpan | sincere-awe | urgent-breaking | quiet-observation>
tonal_target_secondary: <optional>
share_trigger: <ick | unease | awe | utility | inside-joke | argument-bait>
frame_zero_promise: <6-word sentence>
```

Also during Phase 0, run the technical pre-flight in parallel:

```bash
# Avatar duration + sanity check
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input/heygen-greenscreen.mp4

# Tweet syndication — saves the JSON for B11 reuse
curl -sL "https://cdn.syndication.twimg.com/tweet-result?id=<TWEET_ID>&token=a" \
  > assets/research/<brand>-tweet-<id>.json

# Pull the tweet's video if it has one (for B4 demo content)
# Find video URL in the JSON's mediaDetails[0].video_info.variants

# Probe the avatar to see where the green screen ends
ffmpeg -y -ss 5 -i input/heygen-greenscreen.mp4 -frames:v 1 output/asset-inspection/avatar-source-mid.png
```

**Hard gate:** if `emotional_thesis` AND `share_trigger` cannot both be written without hand-waving, the topic is too thin. **Escalate to user — do not draft.** See `references/worked-examples.md` Example 6 for the canonical thin-topic refusal.

End of Phase 0: write `output/breaking/<slug>/editorial-brief.md` with the populated fields.

---

## Phase 0.5 — Source-demo cataloging (conditional, validated 2026-05-14)

**Run this phase when** `topic_class ∈ {feature-drop, model-launch, research-paper, tutorial-howto}` AND a multi-demo source video exists. Skip for `hot-take-opinion`, `culture-meme`, `drama/discourse` where the script is the centerpiece (not the source video).

**Why:** the prior "script-first → cuts adapt" pipeline produced beats that cut mid-action. The avatar voice would say "writes it, voices it, plugs in your product" in 4.5s, but the source's actual podcast-gen demo runs 8s — viewer sees a truncated demo. Source-first inverts this so cuts are locked first and the script flexes around them.

**Procedure:**

```bash
# 1. Dense-scan the source video (every 3-5s) and Read each frame to identify
#    the natural in/out of each demonstrable feature.
for t in 1 4 8 12 17 22 28 34 40 46 52 58 65 72 80; do
  ffmpeg -y -ss $t -i assets/research/<brand>/<brand>-tweet-video.mp4 \
    -frames:v 1 "output/asset-inspection/<brand>-scan-t${t}.png"
done
# Read each PNG. For each feature, note: name, source_in, source_out, natural_duration.

# 2. Write the catalog to editorial-brief.md under `## Source demo catalog:`
#    Each row: feature_name | source_in | source_out | natural_duration | one-line description

# 3. Cut each demo at its natural in/out (NOT script-driven beat slots):
ffmpeg -y -ss <source_in> -t <natural_duration> -i <source> \
  -c:v libx264 -crf 18 -preset fast -an <output_clip>.mp4

# 4. Apply §4.3 asset-verification gate: Read each cut's midframe to confirm the
#    visual matches the feature claim.
```

**Output:** a catalog table in `editorial-brief.md` like:

```yaml
source_demo_catalog:
  - feature: hero_title_card
    source_in: 4.0
    source_out: 7.5
    natural_duration: 3.5
    description: "Introducing <Product>" minimalist title card
  - feature: agent_prompt_input
    source_in: 7.0
    source_out: 11.5
    natural_duration: 4.5
    description: User types natural-language request, agent acknowledges
  - feature: competitor_scan
    source_in: 11.0
    source_out: 18.5
    natural_duration: 7.5
    description: Agent scans Meta Ads + YouTube + 30-day rank
  ...
```

**Then in Phase 2.1**, the script is written with each beat's word budget = `natural_duration × WPS` (target 2.0-2.2 WPS for middle-ground register, see `references/script-writing.md` §11). Avatar gets recorded AFTER the cuts are locked. Phase 5.0 Whisper-pin verifies the avatar landed within tolerance.

**Speed-ramp as fallback** (per `assetSpeedRatio` field): if a source demo's `natural_duration` is materially longer than what a beat can carry (e.g., 8s demo but viewer attention budget says 5s), set `assetSpeedRatio: 1.5-1.6` to fit. Acceptable for moderate speed-ups; avoid past 1.6× — UI demos look frantic.

---

## Phase 1 — Rubric pass

Walk the 7 selectors in `references/decision-rubrics.md` in order. Each loads its catalog only for the option chosen. Outputs append to `editorial-brief.md`.

```
1. STRUCTURE   (R2) → references/structures.md (chosen variant only)
2. TONE        (R3) → references/tonal-palettes.md (chosen palette only)
3. HOOK        (R1) → references/hook-archetypes.md (chosen archetype + worked example)
4. COMPONENT   (R1.b) → references/hook-components.md (chosen component's API)
5. IMAGE STYLE (R6) → references/prompts/gemini-image.md
6. MOTION VERB (R7) → references/prompts/veo.md
7. EFFECTS+SFX (R4, R5) → references/effects-and-sfx.md
```

**Auto-fail at Phase 1:** if `topic_class = launch` but `emotional_thesis = melancholy/grief`, halt — these don't combine cleanly. Ask user to refine intent.

The complete list of rubric outputs to log:

```yaml
structure: <variant>
hook_archetype: <#N + name>
hook_visual_template: <AA.X #M>
hook_component: <component name>
tonal_palette_primary: <palette>
tonal_palette_secondary: <optional>
caption_typography: <stack from tonal-palettes.md row>
effects_palette: [<3 chosen>]
forbidden_effects: [<list>]
sfx_bank: <V46 / V47 / custom> + per-cue rationales pending
music_bed: <description + LUFS target>
image_style_anchor: <string>
motion_verbs: [<list>]
veo_duration_clamp: <4|5|6|7|8>
hinglish_density: <0–100%>
```

---

## Phase 2 — Draft

**Authoring order:** hook line first → re-hook at beat 4 → CTA → fill middle. Each beat = one line in `output/script.txt`.

**MANDATORY before drafting any line:** load `references/script-writing.md`. It contains the four locked rules (read-aloud test, first-5-words catch, one-thought-per-beat, callback+reframe close), the Varun-Mayya register patterns, the 6-pass drafting flow, and the delivery-style-script format. **Skipping this reference is the single biggest source of narrator-cadence drift in past reels.**

### 2.1 Script

Write the 12-line (or N-line per chosen structure) script:

```bash
cat > output/script.txt <<'EOF'
[B1 voice line]
[B2 voice line]
…
[BN voice line]
EOF

# Sync to slug folder
cp output/script.txt output/breaking/<slug>/script.txt
```

If re-rendering with a changed plan, **wipe `output/captions.json`** so Whisper re-runs against the new line split.

### 2.2 Visual plan

Build `scripts/build-<brand>-plan.mts` per the chosen structure. Each beat = one entry:

```ts
{
  index: <N>,
  durationSeconds: <approx — Whisper will override at scene-bucket level>,
  voiceoverLine: '<exact text, 1:1 with script.txt line N>',
  layout: '<layout-kind>',
  v40: {
    layoutKind: '<same>',
    assetSrc: 'assets/research/<brand>/...',
    assetKind: 'video' | 'image',
    assetObjectPosition: 'center top',  // mandatory
    // … layout-specific extras
  },
},
```

Per-asset `assetObjectPosition` is mandatory. Read the midframe of each animated clip first to identify focal point + Veo artifacts:

```bash
for f in assets/research/<brand>/animated/*.mp4; do
  name=$(basename "$f" .mp4)
  ffmpeg -y -ss 2.5 -i "$f" -frames:v 1 "output/asset-inspection/${name}.png"
done
```

Then `npx tsx scripts/build-<brand>-plan.mts` regenerates `output/breaking/<slug>/visual-plan-<variant>.json`.

Layout-specific guidance lives in `references/v46-locked-in.md` (V46 12-beat) or `references/v47-locked-in.md` (V47 19-beat).

### 2.3 SFX cues

Hand-author `output/breaking/<slug>/sfx-cues-<variant>-final.json` with `_v43_manual: true`. Render-with-heygen.ts respects this flag and skips auto-placement.

Each cue row:
```json
{
  "startFrame": 0,
  "sample": "7 - SFX Pack EP 1/silex riser.mp3",
  "gainDb": -7,
  "maxDurationSec": 2.5,
  "rationale": "reel-start riser, hook entry"
}
```

**Every cue MUST have a 4-word rationale clause.** Critique fails any cue without one.

R5 in `references/decision-rubrics.md` enforces tonal SFX restrictions. R5 reads `references/effects-and-sfx.md` §K matrix, §L duration clamps, §O avoid-list, plus the chosen palette row in `references/tonal-palettes.md`.

Verify all referenced SFX files exist before render:
```bash
node -e "
const fs = require('fs'); const path = require('path');
const cues = JSON.parse(fs.readFileSync('output/breaking/<slug>/sfx-cues-<variant>-final.json', 'utf8')).cues;
let m = 0;
for (const c of cues) {
  const p = path.join('assets/sfx', c.sample);
  if (!fs.existsSync(p)) { console.log('MISSING:', p); m++; }
}
console.log(m === 0 ? '✓ all ' + cues.length + ' SFX files exist' : m + ' missing');
"
```

### 2.4 Asset prompts

Draft Gemini and Veo prompts based on R6/R7 outputs. Load only the relevant `references/prompts/<provider>.md` (gemini-image, veo, kling, elevenlabs, suno, sora) for selected providers.

---

## Phase 3 — Critique pass

**Mandatory before render.** Load `references/critique-rubrics.md`. Score on 10 dimensions × 3 fields each. Write each pass to `output/breaking/<slug>/critique-log.md`.

**Loop control:** max 3 passes. Pass 4 = escalate.

**Auto-fails (any one = revise immediately, do not score):**

1. Frame-0 has no hook caption (or fades in)
2. Script opens on Hi/Hey/So/Today/Welcome/Let me/I want to talk about
3. Same archetype/effect/SFX-default as last reel (novelty breach)
4. Tag conflict in EL tags
5. Cha-ching SFX in non-money beat
6. Pacing target violated by >15%
7. Taboo-zone phrase in script
8. Confetti / cake / money-rain on industry-disruption topic
9. V46 12-beat used for pacing<30s
10. Hormozi yellow-pill on AI-curious-IN with sincere-awe / ironic-deadpan
11. Course-bro CTA ("tag 3 friends" / "follow for more" alone)
12. SFX cue missing rationale clause
13. Photoreal Gemini stills paired with ironic-deadpan or dark-humor tone
14. Comic / doodle / vintage-CRT image style on death/grave topic
15. Hook claims X but payoff doesn't deliver
16. Re-hook beat absent at 12-18s mark
17. India-leaning reel without burned-in subtitles
18. CTA asks for follows when CTA priority is DM-send/save
19. Loop strategy violated: frame 0 ≠ frame N
20. Avatar visible <40% of bottom pane at any checkpoint

**Gate to render:** every dim ≥ 4, no `Y` mechanical-default flag, no tonal-clash, all auto-fails clear. Each revise pass MUST change at least one of: archetype / effect-palette / SFX subset / tonal target / beat order. Cosmetic edits don't count.

---

## Phase 4 — Asset generation

### 4.0 Hook video check — DO THIS FIRST (validated 2026-05)

Before any Gemini/Veo hook generation, check whether the user has provided the hook clip directly:

```bash
# B1's assetSrc in visual-plan-<variant>.json should point at this path
test -f assets/research/<brand>/animated/<brand>-hero.mp4 && echo "user-provided hook found"
```

If the file exists → log "hook user-provided" in `editorial-brief.md` and **skip §4.1 hook generation entirely**. Proceed to §4.0.5 (pre-trim) then §4.2 (body B-roll, tweet card, etc).

If the file does not exist AND the user hasn't asked you to generate the hook → **ask the user** before burning Gemini/Veo credits. The default 2026-05+ workflow is "user generates hook externally (Meta AI / Sora 2 / their browser) and drops the mp4 in place" — auto-generating without confirmation wastes their credits and often produces a hook they'd reject.

If the user has explicitly asked you to generate the hook → proceed to §4.1.

### 4.0.5 Hook pre-trim (mandatory, validated 2026-05-14)

User-supplied hero clips typically have a 2-3s build-up at the start (fade-in, camera dolly, character/cube assembly). The DRAMATIC frame — fully assembled character with glowing details + brand text visible — lands at t=3-5 of the user file. Frame 0 of the reel must be the punchy frame, NOT the build-up.

**Default workflow:**

```bash
# Inspect: extract midframe + tail-frame to confirm where the punch lives
ffmpeg -y -ss 0.5 -i assets/research/<brand>/animated/<brand>-hero-raw.mp4 \
  -frames:v 1 output/asset-inspection/<brand>-hero-t0.5.png
ffmpeg -y -ss 4.5 -i assets/research/<brand>/animated/<brand>-hero-raw.mp4 \
  -frames:v 1 output/asset-inspection/<brand>-hero-t4.5.png
# Read both. Identify the build-up duration (typically 2-3s).

# Trim: cut the first N seconds off (use a stream-copy for speed; re-encode only if needed)
ffmpeg -y -ss 2 -i assets/research/<brand>/animated/<brand>-hero-raw.mp4 \
  -c:v libx264 -crf 18 -preset fast -an \
  assets/research/<brand>/animated/<brand>-hero.mp4
```

Then B1's `assetSrc` points to the TRIMMED file. Frame 0 of the reel = the dramatic part.

**Override:** if the user explicitly says "use the full clip" or the hook clip is shorter than 4s (no build-up to trim), skip pre-trim. Log the decision in `editorial-brief.md`.

### 4.1 Hook generation (only when user asks for it)

Gemini stills with brand-logo refs (`scripts/gen-<brand>-hooks-v3.mts` template). Veo 2 animation `durationSeconds ∈ [5,8]`, model `veo-2.0-generate-001` (or Veo 3.1 for hero with synced audio).

```ts
const op = await ai.models.generateVideos({
  model: 'veo-2.0-generate-001',
  prompt: '<motion description per references/prompts/veo.md>',
  image: { imageBytes: <base64>, mimeType: 'image/png' },
  config: { aspectRatio: '9:16', durationSeconds: 5, numberOfVideos: 1 },
});
```

Save to `assets/research/<brand>/animated/<label>.mp4`. 720×1280 h264 output.

For tweet demo clip (B4): sample 5-7 candidates and Read each to find segment matching B4's voice line:
```bash
for t in 8 25 40 55 70 82; do
  ffmpeg -y -ss $t -i assets/research/<brand>/<brand>-tweet-video.mp4 \
    -frames:v 1 "output/asset-inspection/tweet-t${t}.png"
done
# Read each PNG. Pick the timestamp that visually delivers B4's promise.
ffmpeg -y -ss <chosen_t> -i <src> -t 4 -c:v libx264 -crf 18 -preset fast -an \
  assets/research/<brand>/<brand>-demo-b4.mp4
```

For tweet card (B11): add a `<BRAND>_LAUNCH_TWEET` const to `src/remotion/TweetCardV2.tsx` (see `references/v46-locked-in.md`). **Then wire it into the V40Router ternary chain** at the `case 'tweet-dark':` arm — add `v40.tweetVariant === '<brand>' ? <BRAND>_LAUNCH_TWEET :` to the chain AND import the const at the top. Past-bug pattern: defining the const but forgetting the router wiring silently falls back to `JEREMY_LAUNCH_TWEET`.

When Veo refuses real-person animation (Trump/Sam/Elon) — fall back to `HeroScribblePane` CSS-motion (see `references/render-cookbook.md`).

### 4.3 Asset-verification gate (MANDATORY, validated 2026-05 Googlebook session)

After every ffmpeg cut from a source video, **Read the midframe of the cut clip BEFORE running `build-<brand>-plan.mts`**:

```bash
# For each cut you just made:
for f in assets/research/<brand>/gb-*.mp4; do
  name=$(basename "$f" .mp4)
  ffmpeg -y -ss $(echo "scale=2; $(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$f") / 2" | bc) \
    -i "$f" -frames:v 1 "output/asset-inspection/${name}-mid.png" 2>&1
done
# Read each PNG. Confirm visual matches the beat's voiceover claim.
```

Why this is mandatory: timestamps from a dense source-video frame scan capture the editor's INTENT, not always the actual content. A transition wipe, a cross-fade, a lingering previous-feature shot can sit at your assumed start time. The Googlebook B1 leadin shipped with Tokyo photo collage (tweet t=50-51 is the photo-share tail) instead of the rainbow LED bar (tweet t=4-7) because the asset-mid wasn't Read before render. Verification caught it at Phase 5 — too late to fix without a full re-render.

**Auto-fail at Phase 4**: any harvested clip whose midframe doesn't visibly deliver the beat's voiceover claim. Re-cut at a tighter window OR pick a different source timestamp.

### 4.4 Asset-mode decision (refined 2026-05-15 — subject-placement-driven, NOT aspect-ratio-driven)

**The decision rule:** for each beat with an `assetSrc`, Read the Phase 0.5 midframe and ask — *"would a vertical 9:16 crop keep the meaningful content in frame?"*

```
condition                                        → assetMode              → rationale
─────────────────────────────────────────────────────────────────────────────────
meaningful content in center 35% horizontal       → fullbleed              → subject fills screen, dramatic impact
subject offset left/right                         → fullbleed + objectPos  → per-beat 'left center' / 'right center'
content spread across full width                  → landscape-card         → preserves multi-column UI / multi-element
                                                                              (Higgsfield Supercomputer agent UI is the
                                                                              canonical case for this — text panels
                                                                              extend left + right of center)
user-supplied hero (portrait or stylized)         → fullbleed              → hero IS the dramatic frame
final brand card / centered tagline               → fullbleed              → text reads larger, more impact
talking-head face center                          → fullbleed              → face full-height more engaging
```

**The key insight (validated 2026-05-15 trumpt1 session):** the earlier "16:9 → landscape-card by default" rule overcorrected after the Higgsfield session. Most product photography is shot with the subject centered + dominant, occupying the middle 35-50% horizontal. Center-cropping to vertical INCREASES the subject's screen presence rather than losing context. Landscape-card is only the right call when the source has *meaningful content on both sides* — wide UI panels, multi-column layouts, ensemble framing. For single-subject product photography, fullbleed (with per-beat `objectPosition` tuning when needed) is the better default.

**`landscape-card`** is a V72+ mode (defined in `src/remotion/V40Router.tsx`). Renders the source as a wider inset card on a black canvas with vertical letterbox above + below, avatar at the seam. Use it *only when subject placement forces it* — not as a default for 16:9.

**`fullbleed`** is the DEFAULT for most beats. Pair with `assetObjectPosition` for per-beat horizontal alignment. Vertical impact almost always wins over letterboxed inset when the subject fits.

**`assetSpeedRatio`** (optional, V72+): set on a per-beat basis when source demo is longer than beat slot. Acceptable range 1.0-1.6×. Past 1.6× UI demos look frantic.

---

## Phase 5 — Render + verify

### 5.0 Whisper-pin to actual avatar duration (MANDATORY, validated 2026-05)

When the user delivers a HeyGen avatar mp4, **never trust the planned beat durations against the actual take.** HeyGen avatars routinely come in 10–20% slower than WPS estimates for deadpan / sincere registers (Googlebook session: 58s plan → 68.4s actual, 17% over). Procedure:

```bash
# 1. Probe actual duration
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input/heygen-greenscreen.mp4

# 2. Extract audio + run Groq Whisper directly to get word-level timings
ffmpeg -y -i input/heygen-greenscreen.mp4 -vn -ac 1 -ar 16000 -c:a pcm_s16le \
  output/breaking/<slug>/avatar-audio.wav
# (then call Groq whisper-large-v3 with timestamp_granularities[]=word — see render-with-heygen.ts)

# 3. Find the LAST WORD of each beat in the transcript; set beat endSec to the
#    midpoint of the silence GAP between that word and the next beat's first word.
#    Beats whose last word is mid-sentence get cut points at the natural pause.

# 4. Rewrite scripts/build-<brand>-plan.mts with the pinned startSec/endSec values.
#    Re-run npx tsx scripts/build-<brand>-plan.mts.
```

If the avatar is materially over (>15%) and the script has multi-sentence beats, **consider splitting the longest beat at its internal pause** (e.g., split the MacBook-jab + CTA close into two beats at the "I'm sorry → Save this" pause). Each gets its own visual register. Validated in Googlebook v3 (13 beats → 14 beats at 63.66s natural pause).

If the avatar is materially under, either trim trailing silence (only if real silence exists past last word) or accept a slightly faster reel. Don't pad with held frames.

### 5.1 Cache invalidate + render

Bundle cache invalidate when introducing a new layout (mandatory):

```bash
rm -rf node_modules/.cache && touch src/cli/render-only.ts
```

Then:

```bash
nohup npx tsx src/cli/render-with-heygen.ts \
  --variant <brand> --slug <brand>-<id> \
  --avatar input/heygen-greenscreen.mp4 \
  > output/render-<brand>-v<NN>.log 2>&1 &
```

Bundle: ~3s if cached, ~35s cold. Frame render: ~6-10 min for ~2000 frames @ 30fps × 8 workers. Post-process: ~1 min (cinematic LUT + film grain + loudnorm).

### 5.2 Verify

Sample frames at `scene_start + duration/2` (NEVER fixed timestamps — Whisper bucketing shifts boundaries). Read each frame. Confirm:
- Hook visible at frame 0 (use accurate seek `-ss N` AFTER `-i` to bypass keyframe rounding)
- `assetObjectPosition` correctly framed each beat
- Avatar visible bottom 40% at every timestamp
- No black gap at seam
- Frame 0 = frame N (loop strategy)
- **End-of-reel outro overlay shows `@aisimplified`** — the 1-second `OutroNeonCard` stamp in `Reel.tsx` is hardcoded and overrides B-final's last second. If it reads `@yourchannel` or anything else, patch `src/remotion/Reel.tsx` then re-render.
- **Source-cut content matches beat claim** — if a beat's voiceover says "rainbow LED" but the harvested clip shows photo collage, the cut timestamps were wrong (Phase 4 asset-verification gate failed).

See `references/render-cookbook.md` for the full verification workflow + pixel-scan pattern.

### 5.3 Post-render audio normalization

Already applied by render-only.ts post-process. If a fresh standalone loudnorm pass is needed:

```bash
ffmpeg -i output/final-video.mp4 -af loudnorm=I=-12:TP=-1.5:LRA=11 -c:v copy output/final-loudnorm.mp4
```

Brings master to -12 LUFS, true peak -1.5 dBTP, LRA 11 — algorithm-friendly for vertical-feed distribution.

### 5.4 Mobile / IG-safe sibling encode (validated 2026-05, Googlebook session)

Remotion writes the master as `yuvj444p` (full-range 4:4:4) which several Android players and IG's transcoder mishandle (color crush, occasional decoder refusal). Always produce a mobile-safe sibling at `output/final-video-mobile.mp4`:

```bash
ffmpeg -y -i output/final-video.mp4 \
  -c:v libx264 -preset slow -crf 20 \
  -profile:v high -level 4.0 \
  -vf "scale=in_range=full:out_range=tv,format=yuv420p" \
  -movflags +faststart \
  -c:a aac -b:a 192k -ar 48000 -ac 2 \
  output/final-video-mobile.mp4
```

This converts to **yuv420p tv-range** (universal mobile compatibility), keeps h264 High@4.0 (Android-supported), adds `+faststart` (instant streaming preview), and re-encodes AAC at 192 kbps stereo / 48 kHz. The master stays untouched as the editorial reference; the mobile sibling is what gets uploaded to Reels / Shorts / TikTok.

---

## Anti-mechanical guardrails (enforced in Phase 3 critique)

The 17 numbered guardrails live in `references/critique-rubrics.md`. Headlines:

1. **No cha-ching** on death/layoff/regulation/safety topics
2. **No confetti/cake/money-rain** on industry-disruption-anxiety topics
3. **No V46 12-beat** for pacing<30s — drop to 9-beat news-explainer
4. **No tag conflicts** in EL voice tags
5. **No V47 19-beat** for single-fact news
6. **No beat-deviation >2** from chosen template
7. **No >2 EL tags per line**
8. **No course-bro CTA** ("tag 3 friends" / "follow for more")
9. **No archetype #1 (Product Showcase) 3+ reels in a row**
10. **No Hormozi yellow** on sincere-awe/ironic-deadpan
11. **No "incredible/insane/mind-blowing"** in scripts (course-bro)
12. **No Indian-target reel without burned-in subtitles** (85% muted)
13. **No archetype #1 / Cooper italic / drift-verb / V46 default 3-in-row** (mech-default cool-down)
14. **No photoreal stills** for ironic-deadpan / dark-humor (clash)
15. **No AA.16-vs-AA.17 confusion** (different prompt vocabularies)
16. **No cha-ching+confetti+ascend at one beat** (celebration mud)
17. **No STRONG verb + glitch + sub-bass at same frame** (perceptual mud)

Plus 3 always-on rules:
- `Math.random()` anywhere — non-deterministic across workers
- CSS animations / transitions — don't render correctly
- Sed-edits on plan files — linter reverts; use Edit tool with `replace_all`

See `references/editorial-instincts.md` §3 for anti-AI-output-tells (what tells the critique pass scans for).

---

## Memory + integration with two-stage pipeline

This skill reads from auto-memory:
- `user_channel.md` — channel handle (currently @aisimplified)
- `workflow_no_paid_llm.md` — no LLM SDK calls in Stage 1

If those memories are missing, ask the user to confirm the channel handle before generating any CTA.

**Stage 2 (`render-with-heygen.ts`) is unchanged.** It consumes the existing `output/script.txt` + `output/breaking/<slug>/visual-plan-<variant>.json` + `output/breaking/<slug>/sfx-cues-<variant>-final.json`. The new editorial files (`editorial-brief.md`, `critique-log.md`) are Claude-side only — Stage 2 doesn't read them.

The artifact directory after a complete reel run:

```
output/breaking/<slug>/
├── script.txt                       # Phase 2 (Stage 2 reads)
├── visual-plan-<variant>.json       # Phase 2 (Stage 2 reads)
├── sfx-cues-<variant>-final.json    # Phase 2 (Stage 2 reads)
├── captions.json                    # Stage 2 generates (Whisper)
├── editorial-brief.md               # Phase 0 + Phase 1 (Claude-side)
└── critique-log.md                  # Phase 3 (Claude-side, append per pass)
```

---

## Reference index — load on demand

The skill body keeps the decision logic. Catalogs and worked examples live in references that load only when needed.

### Editorial brain (the decision logic)
- **`references/decision-rubrics.md`** — the 7 rubric trees (R1-R7)
- **`references/critique-rubrics.md`** — scorecard + auto-fail signals + revision triggers
- **`references/script-writing.md`** — drafting playbook: read-aloud rule, first-5-words catch, friend-talking register, Varun-Mayya signature moves, callback+reframe close patterns, 6-pass drafting flow, delivery-style script format. **Mandatory load in Phase 2.1 — single biggest source of narrator-cadence drift if skipped.**
- **`references/tonal-palettes.md`** — 6 named palette recipes (dark-humor / warm-humor / ironic-deadpan / sincere-awe / urgent-breaking / quiet-observation) with lands-vs-bombs heuristics
- **`references/audience-aisimplified.md`** — persona + taboos + IN+US lean + save-CTA preference
- **`references/structures.md`** — V46 / V47 / 9-beat-news / 10-beat-take / V47-tutorial / 6-beat-micro
- **`references/topic-classifier.md`** — how to classify source material into rubric inputs
- **`references/editorial-instincts.md`** — the human-editor register; how to think about each rubric; anti-AI-output-tells; when to override
- **`references/user-feedback-vocabulary.md`** — translate "make it punchier" / "less hype" / "more dark" into specific rubric actions
- **`references/worked-examples.md`** — 6 fully reasoned examples (Sora 2 launch, Anthropic acquisition, Adobe disruption, restoration demo, AI-influencer noticing, thin-topic escalation)

### Catalogs
- **`references/hook-archetypes.md`** — 12 archetypes + 132 visual hooks (AA.1-AA.17)
- **`references/hook-components.md`** — 45 drop-in Remotion components
- **`references/effects-and-sfx.md`** — FX catalog + motion→SFX matrix + duration clamps + 2026 avoid-list + spring constants
- **`references/retention-template.md`** — 0-60s curve, WPS targets, 12-18s re-hook map, algorithm signals, CTAs
- **`references/viral-anatomies.md`** — 15 reel breakdowns + 2026 emerging patterns
- **`references/creator-tricks.md`** — 20 reverse-engineered techniques + India tactics

### Cookbooks
- **`references/render-cookbook.md`** — Remotion 4 APIs, render speed wins, chroma-key, sidechain ducking, verify
- **`references/asset-cookbook.md`** — fetch X / IG / TikTok / YT / Reddit / News / GitHub + AI-gen pricing matrix
- **`references/pipeline-bugs.md`** — common-bug table + V47 anti-patterns + linter / cache / sed footguns

### Version-locked structures
- **`references/v46-locked-in.md`** — 12-beat skeleton + layout guidance + V46 SFX palette + TweetCardV2 props
- **`references/v47-locked-in.md`** — 19-beat showcase + layouts + V47 SFX additions + X-cookie scrape

### Provider-specific prompt templates
- **`references/prompts/gemini-image.md`** — Gemini 3 Pro Image (Nano Banana Pro) 9 templates, refs[] rules
- **`references/prompts/veo.md`** — Veo 3.1 + Veo 2 motion verbs, camera moves, refusal workarounds
- **`references/prompts/kling.md`** — Kling 3.0 templates
- **`references/prompts/elevenlabs.md`** — v3 voice tag inventory + settings
- **`references/prompts/suno.md`** — Suno V5.5 metatag patterns
- **`references/prompts/sora.md`** — Sora 2 prompt structure
- **`references/prompts/meta-ai.md`** — Meta AI web image-gen + image-to-video pipeline (Playwright + cookies); the validated path for celebrity-cameo hooks when Sora 2 isn't accessible

---

## Quick-start checklist (the master pre-flight, with editorial-brain steps)

When the user gives you a new tweet URL or topic:

1. **Phase 0 intake** — run `references/topic-classifier.md` workflow → populate 12 fields → write `editorial-brief.md`. **Hard gate** if topic is too thin.
2. **Phase 0 technical pre-flight** — fetch tweet syndication JSON, ffprobe avatar duration, extract avatar midframe to confirm geometry.
2.5. **Phase 0.5 source-demo catalog** — when `topic_class ∈ {feature-drop, model-launch, research-paper, tutorial-howto}` AND source has a multi-demo video: dense-scan source frames, identify each feature's natural in/out timestamps, log catalog to `editorial-brief.md`. Cuts get locked HERE; script flexes around them in Phase 2.1.
3. **Phase 1 rubric pass** — walk R1-R7 in `references/decision-rubrics.md` → append rubric outputs to `editorial-brief.md`.
4. **Phase 2.1 script** — write N-line script (1 line per beat per chosen structure). **Default register: middle-ground Varun** (12-18 words/beat, 5-7s beats, light connectors — see `references/script-writing.md` §11). For source-first reels (Phase 0.5 ran), each beat's word budget = `natural_duration × 2.0-2.2 WPS`. Sync `output/script.txt` → `output/breaking/<slug>/script.txt`. Wipe `output/captions.json` if re-rendering.
5. **Phase 2.2 assets** — Gemini stills with brand-logo refs[]. Veo 2 animations (parallel-ish, ~45s each). For source-video harvested B-roll, ffmpeg-cut at the Phase 0.5 natural-duration timestamps (NOT script-driven beat slots). **Hook clip pre-trim:** trim first 2-3s off user-supplied hero before assigning to B1. **Then Phase 4.3 asset-verification gate: Read midframe of each cut and confirm visual matches the beat's voiceover claim.** **Phase 4.4 asset-mode:** pick `landscape-card` for 16:9/4:3/1:1 source clips, `fullbleed` for portrait/9:16 + the user hero. Add `<BRAND>_LAUNCH_TWEET` const to TweetCardV2.tsx if needed AND wire it into V40Router's `case 'tweet-dark':` ternary.
6. **Phase 2.3 visual plan** — author `scripts/build-<brand>-plan.mts` with all beats + per-asset `assetObjectPosition`. Run `npx tsx scripts/build-<brand>-plan.mts`.
7. **Phase 2.4 SFX cues** — author `output/breaking/<slug>/sfx-cues-<variant>-final.json` with sound at every motion event AND a 4-word rationale on every cue.
8. **Phase 3 critique pass** — score against `references/critique-rubrics.md`. Revise until gates pass (max 3 passes). Write `critique-log.md`.
9. **Phase 5.0 Whisper-pin** (when user delivers HeyGen avatar) — ffprobe avatar duration. If it differs from planned by >5%, extract audio + run Groq Whisper, get word-level timings, re-time `build-<brand>-plan.mts` beats to natural speech pauses, re-build the plan. Consider splitting overlong beats at internal pauses.
10. **Phase 5.1 render** — cache invalidate (`rm -rf node_modules/.cache && touch src/cli/render-only.ts`). Render with `nohup npx tsx src/cli/render-with-heygen.ts --variant <brand> --slug <brand>-<id> --avatar input/heygen-greenscreen.mp4`.
11. **Phase 5.2 verify** — wait ~12 min. Extract frames at scene_start + duration/2 (accurate seek: `-ss N` AFTER `-i`). Read each. Confirm B1 hook visible, end-card reads `@aisimplified`, every cut content matches its voice claim.
12. **Phase 5.4 mobile sibling encode** — `ffmpeg -i output/final-video.mp4 -c:v libx264 -preset slow -crf 20 -profile:v high -level 4.0 -vf "scale=in_range=full:out_range=tv,format=yuv420p" -movflags +faststart -c:a aac -b:a 192k -ar 48000 -ac 2 output/final-video-mobile.mp4`. Mobile sibling is what gets uploaded to Reels/Shorts/TikTok.

---

## What NOT to do

Editorial-level (most also auto-fails in Phase 3 critique):
- Don't draft on a thin topic — escalate. (Phase 0 hard gate.)
- Don't ship a draft without Phase 3 critique. The mech-default detection is what makes this skill worth using.
- Don't switch tonal palettes within a reel without logging a tonal-switching pattern in `editorial-brief.md`.
- Don't override rubric outputs without logging the override + reason.
- Don't use `@yourchannel` — always `@aisimplified`.

Mechanical (technical):
- Don't add captions overlay in Remotion (user adds them manually post-edit).
- Don't add the torn-paper seam (user disliked it).
- Don't add B-roll PIP corner cards (clutter, drops viewer attention).
- Don't add any layout to `HIDE_AVATAR_LAYOUTS` — avatar is always visible.
- Don't generate stills without brand-logo refs (Gemini hallucinates "zeplit" / "edidframe").
- Don't render without verifying SFX file paths (a missing path silently drops the cue).
- Don't sed-edit plan files (linter reverts; use Edit with `replace_all`).
- Don't render without bundle cache invalidation when adding a new layout.
- Don't verify at fixed timestamps (Whisper bucketing shifts boundaries).
- Don't use `Math.random()` (non-deterministic across workers).
- **Don't trust planned beat durations against the actual HeyGen avatar** — always Whisper-pin in Phase 5.0 if duration drifts >5%.
- **Don't ship harvested B-roll without reading the midframe** — Phase 4.3 asset-verification gate is mandatory.
- **Don't ship without the mobile sibling encode** — yuv420p tv-range + faststart at `output/final-video-mobile.mp4` is what goes to Reels/Shorts/TikTok; the master stays as the editorial reference.
- **Don't leave `@yourchannel` in `Reel.tsx:197` outro stamp** — the 1-second outro overlay covers B-final's last second; the hardcoded handle there must be `@aisimplified`. Same for `SubscribeCTA.tsx:47` and `PhoneMockupCTA.tsx:31` defaults.
- **Don't define a `<BRAND>_LAUNCH_TWEET` const without wiring it into V40Router's `tweet-dark` ternary** — silent fallback to `JEREMY_LAUNCH_TWEET`.
- **Don't use `fullbleed` mode for 16:9 source clips** — center-crop loses ~40% horizontal context (peripheral UI text, side panels). Use `landscape-card` for 16:9/4:3/1:1 sources. Reserve `fullbleed` for portrait sources + user hero where the punch IS the centered subject.
- **Don't place the user hero as B2 with a 3-second text lead-in** — the user hero IS the punch; put it at B1 frame 0. Pre-trim the first 2-3s of build-up off the user file (Phase 4.0.5) so frame 0 is the dramatic frame, not the slow build-in.
- **Don't ship a punchy-fragment script for a multi-demo source-first reel** — the avatar names features faster than the on-screen UI demos resolve, losing sound-off viewers. Middle-ground register (12-18 words/beat, light connectors, mechanism-skipped specifics) is the default. See `references/script-writing.md` §11.
- **Don't cut source-demo clips to script-driven beat slots when topic is source-driven** — invert the pipeline: catalog source demos at their natural in/out (Phase 0.5), then write the script with each beat's word budget sized to the locked clip duration. Beats that show a full multi-step demo (write → voice → plug-in) need the full clip, not a 4.5s truncation.

---

## How to use this skill

1. **First-time setup** — read `references/audience-aisimplified.md` once to internalize the persona. Skim `references/editorial-instincts.md` to understand the register. Skim `references/worked-examples.md` to see the rubrics in action.

2. **Per reel** — start at Phase 0. If the topic is concrete (tweet URL, named tool launch, specific take), the intake takes 2-3 min. If thin, escalate.

3. **When stuck** — `references/user-feedback-vocabulary.md` translates user feedback into rubric actions. `references/worked-examples.md` shows reasoning anchors for similar topics.

4. **When the user says "perfect"** — log the validated combo to `editorial-brief.md` under `## Validated patterns:`. Update `novelty_budget` so next reel varies at least one dimension.

5. **When the user overrides a rubric** — honor it; log to `editorial-brief.md` `rubric_overrides:`. After 3 same-overrides across reels, raise it: maybe the rubric should be updated.

The skill is the editor-in-chief's *junior with extraordinary memory*. It runs the checklists, never forgets a guardrail, scores against rubrics. The editor-in-chief is still the user. The skill scales taste — it doesn't replace it.
