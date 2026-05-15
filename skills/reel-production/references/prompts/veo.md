# Veo 3.1 + Veo 2 — image-to-video templates

Loaded by R7 (motion verb selector) when generating animation via Veo. Two model variants: 3.1 (latest, with native audio) and 2 (`veo-2.0-generate-001`, free-tier-friendly).

---

## Veo 3.1 (latest)

**Pricing**: Standard $0.40/sec 1080p, Fast $0.15/sec 1080p, 4K $0.60/sec (8s only). Native synced audio. Duration: **4, 6, or 8 seconds**. 9:16 native since Jan 2026 update.

### Canonical i2v template

```
[Cinematography] + [Subject already in image] + [Action verb] + [Context shift] + [Style/lighting continuity] + [Audio: dialogue / SFX / ambient] + [Negative: ...]
```

**Image-to-video rule**: DO NOT redescribe the still. Spend prompt budget on motion, camera, audio.

### Motion verbs that land (R7 motion-verb tier)

| Tier | Verbs | When to use |
|---|---|---|
| **SUBTLE** | drifts, wobbles slightly, pulses, breathes, sways, glints, shimmers, flickers, ripples, settles | tonal_target ∈ {sincere-awe, quiet-observation, ironic-deadpan, AA.17 explainer} |
| **News-photo subtle** (AA.16) | subject blinks once, slight head settle, single dust mote drifts, paper edge curls 2px, camera-flash burst at one specific second, chyron text scrolls -8px/frame | for AA.16 wire-photo hooks. NO camera move beyond ≤5% dolly. 4-second clamp. |
| **MID** | rotates 90 degrees, tilts forward, unfolds, dissolves into particles, cracks outward, expands, contracts | news, take, launch with strong visual |
| **STRONG** | crashes, explodes outward, morphs, slams down, whips around | ONLY when stakes ≥ high AND tonal_target ∈ {urgent-breaking, dark-humor}; FORBIDDEN for tutorial / culture-meme / sincere-awe |

**AVOID** these verbs entirely:
- `dances` — Veo struggles, animation breaks
- `runs` full-body — warps legs
- `complex hand gestures` — six-finger risk

### Camera moves (verbatim — these are the strings the model accepts cleanly)

`slow dolly in, dolly out, crash zoom, push in, pull out, orbit 180 degrees clockwise, arc shot, crane up reveal, crane down, slow pan left, whip pan right, tracking shot following subject, static locked-off, subtle handheld sway, vertigo dolly-zoom, aerial drone descent, bullet-time freeze with camera orbit`

### Camera vs subject motion (by asset type)

| Subject | Favour | Why |
|---|---|---|
| face / portrait | CAMERA (push-in, slow dolly, rack-focus) | Subject motion reads as deepfake jitter |
| UI / screenshot | SUBJECT motion (cursor moves, panel slides) | Camera motion reads as broken |
| object / product | either, but pair: ONE camera + ONE subject move max, never both at full strength | Layering both reads chaotic |

### AA.17 explainer cap

For AA.17 explainer hooks: 0.5-1.5s motion budget, ONE diegetic micro-element. Enforce at prompt-template level.

### Lighting changes (works)

- "Lights flicker twice, then go fully dark on second 3."
- "Sun rises into frame from off-screen left, golden glow grows from second 2 to second 6."
- "Neon sign buzzes on, casting magenta wash across subject's face on second 4."

### Audio in Veo 3.1

AUTO-generates synced audio by default. Supply explicit cues:
- Dialogue: `Character says: "exact line"` (colon prevents subtitles)
- SFX: `SFX: glass shatters at 0:02, low rumble continuing`
- Ambient: `Ambient: rain on windowpane, distant city traffic, no music`
- To prevent unwanted music: `No background music. Only diegetic sound.`

### Canonical 2026 negative (place at end, keep short)

```
Negative: face distortion, warping, morphing faces, duplicate limbs, six fingers, eye distortion, teeth morphing, jittering, flickering, motion blur on face, plastic skin, uncanny valley, identity drift, background shifting, floating limbs, jump cut, text overlay, watermark
```

### Refusal workarounds

- **Real famous face animation** → animate background/lighting only; OR extremely subtle ("breathing, eye blink once") not lip-sync. Last resort: fall back to `HeroScribblePane` CSS-motion (render-cookbook.md).
- **Violence/gore** → "shockwave ripples outward from impact point"
- **Copyrighted character** → describe by traits, not name; use refs (Veo 3.1 supports up to 3 character refs)
- **Brand likeness** → "preserve all on-screen text and branding exactly"

### Reliability data

| Camera move | Success rate | Retry budget |
|---|---|---|
| Static + small dolly-in | >90% | 1 |
| Crash zoom / whip pan | ~56% | 2-3 |
| Vertigo dolly-zoom | ~40% | 3 |

Long Veo prompts truncated at ~500 tokens — front-load identity + camera; cut adjectives; negatives last.

### Viral creator example (vertical reel hook)

```
9:16 vertical, 8 seconds. Slow push-in from medium shot to extreme close-up on the subject's eyes (already in source image). Eyes blink once at 0:01. At 0:03, the cracked phone screen in their hand pulses with red emergency light, casting flickering glow on their face. Subtle handheld tremor. Cinematic teal-orange grade, anamorphic flare across eyes at 0:05. SFX: low tense drone building, single sharp glitch at 0:03 with red flash, faint heartbeat 70 BPM throughout. No music. Negative: face distortion, eye warp, duplicate fingers, jitter.
```

---

## Veo 2 (`veo-2.0-generate-001`)

The free-tier-friendly model. Used by the current pipeline.

- **Strict duration**: 5/6/7/8 only ("duration out of bounds" otherwise)
- **Output**: 720×1280 → upscale to 1080×1920 in post (Real-ESRGAN x1.5)
- **No native audio** — add in post via SFX cues
- **Same template as Veo 3.1 minus audio block.** Prepend `[STATIC SHOT]` if you want minimal motion (Veo 2 over-animates by default vs 3.1)
- Still useful for: free-tier batch B-roll, static-camera slow-mo, logo reveals, environmental shots

### Veo 2 invocation pattern (TypeScript SDK)

```ts
const op = await ai.models.generateVideos({
  model: 'veo-2.0-generate-001',
  prompt: '<motion description — what should move, how>',
  image: { imageBytes: <base64>, mimeType: 'image/png' },
  config: { aspectRatio: '9:16', durationSeconds: 5, numberOfVideos: 1 },
});
// Poll ai.operations.getVideosOperation(op) until op.done, then ai.files.download.
```

Save to `assets/research/<brand>/animated/<label>.mp4`. 720×1280 h264 output.

---

## When to choose Veo 2 vs Veo 3.1

| Use case | Choose | Why |
|---|---|---|
| Hero shot with synced audio | Veo 3.1 | Native audio is the killer feature |
| B-roll batch (5+ clips) | Veo 2 or Kling 3.0 | Cost — Kling is 30-40% of Veo 3.1 |
| Free-tier prototyping | Veo 2 | No API gating |
| 8-second cinematic single-clip "wow" | Veo 3.1 | Audio+visual single take is the FF.13 Higgsfield format |
| Quick iteration on motion before committing | Veo 3.1 Light ($0.05/clip) | Cheapest credible model |

---

## Output: prompt template per beat

The R7 selector outputs a tier + verbs. The prompt-author then fills the canonical template:

```
[Cinematography from camera-moves list] [Subject from source image] [Verb from R7 tier]. 
[Context shift]. [Style anchor matches R6 style]. 
[Audio cue if Veo 3.1]. 
Negative: [canonical 2026 negative]
```

Save the prompt + the source image path + the chosen duration to `editorial-brief.md` under `## Phase 4 asset prompts:` for future reference.
