# Decision rubrics — the editorial brain

The seven editorial choices on every reel. Each rubric resolves `(topic_class, emotional_thesis, audience_persona_lean, reel_intent)` plus dimension-specific inputs into a **concrete output** (an archetype name, a SFX filename pattern, a verb).

Outputs append to `output/breaking/<slug>/editorial-brief.md`. No defaults without rationale logged.

Walk in this order — earlier rubrics constrain later ones:

```
1. STRUCTURE   (topic + pacing)              → load structures.md
2. TONE        (emotional_thesis + hype)     → load tonal-palettes.md
3. HOOK        (topic + hero asset)          → load hook-archetypes.md
4. COMPONENT   (archetype + hero asset type) → load hook-components.md
5. IMAGE STYLE (tone + topic)
6. MOTION VERB (emotional intensity)
7. EFFECTS+SFX (tone + topic)                → load effects-and-sfx.md
```

**Phase 1 auto-fail:** if `topic_class = launch` but `emotional_thesis = melancholy/grief`, halt — these don't combine cleanly. Ask user to refine intent before drafting.

---

## R1. HOOK archetype selector

**Source catalogs:** `references/hook-archetypes.md` (12 archetypes + 132 visual hooks across AA.1–AA.17). Validate against anti-openers list (kill any draft starting with Hi/Hey/So/Today/Welcome/Let me).

**Inputs:** `topic_class`, `emotional_thesis`, `audience_persona_lean`, `reel_intent`, `stakes`, `hype_charge`, `novelty_budget`.

**Decision tree** (first match wins):

```
0. topic has a clear company-protagonist with a recognizable public face
   (Sam → OpenAI; Sundar → Google; Dario → Anthropic; Elon → xAI;
    Robin Li → Baidu; Liang Wenfeng → DeepSeek; Demis → DeepMind)
     → arch #1 Product Showcase + AA.18 Celebrity Cameo Cold-Open
        OR + AA.19 Multi-Instance Sora-Cameo Flex (if the absurdity
        amplifies the topic — e.g. "OpenAI shipped pets" → 50 Sams
        in stadium each holding a pet)
     This fires FIRST — overrides clauses 1-11 below — because
     celebrity-recognition stacking is the strongest viral hook engine
     for AI-news topics in 2026 (validated via Varun Mayya frame study
     and the Petdex reel shipment).

1. reel_intent=news ∧ pacing<30s
     → arch #7 Breaking-News + AA.16 wire-photo-from-fiction (#116-120)

2. reel_intent=launch ∧ has_visual_payoff ∧ hype_charge≥+1
     → arch #1 Product Showcase + AA.2 AI-image-hero (#11-20)

3. topic_class=benchmark-news ∧ has_real_number
     → arch #4 Specific-Number + AA.6 number/metric (#47-53)

4. topic_class=drama/discourse ∧ audience holds the belief
     → arch #3 Contrarian + AA.11 shock/disgust (#85-90)

5. topic_class=tutorial-howto
     → arch #6 Negative-Bias-Mistake + AA.10 movement-trick (#79-84)

6. topic_class=culture-meme ∧ tone=ironic-deadpan
     → arch #12 In-Medias-Res + AA.12 pattern-interrupt (#91-97)

7. hype_charge≤-1 ∧ topic_class=model-launch
     → arch #9 Curiosity-Gap + AA.15 loop-bait (#109-115)
       (anti-hype framing — "apparently X" beats "X just dropped")

8. topic_class=research-paper ∧ audience_lean ∈ {AI-builder-IN, AI-builder-US}
     → arch #2 Authority + AA.17 edutainment AI-image (#121-132)

9. stakes=grave (death / layoffs / safety incidents)
     → FORCE arch #11 Pattern-Interrupt + AA.16 wire-photo
     → NEVER arch #10 "Everyone-is-doing-X" (FOMO clashes with grief)

10. novelty_budget flags arch #1 used in last 3 reels
     → step down to next-best in OpusClip ranking (arch #4 → #2 → #6)

11. fallback (no match above)
     → arch #1 Product Showcase
```

**Validation step (always run):** check first 1-3 words of drafted hook against anti-openers — Hi, Hey, So, Today, Welcome, Let me, I want to talk about. Any match = rewrite.

**Output format** (append to `editorial-brief.md`):
```
hook_archetype: #4 Specific-Number
hook_visual_template: AA.6 #52 PopulationCounterLive
hook_word_count: 8-18
rationale: topic=benchmark-news + has real measurement (10M users in 4 days)
```

---

## R2. STRUCTURE selector

**Source catalog:** `references/structures.md` (V46 12-beat / V47 19-beat / 9-beat news-explainer / 10-beat take / custom).

**Inputs:** `topic_class`, `pacing_target`, `reel_intent`.

**Decision tree:**

```
1. brand birthday / age / anniversary number is the payoff
     → V46 12-beat (load v46-locked-in.md)

2. "look at these N examples" / before-after × 5+ / multi-tile comparison
     → V47 19-beat showcase (load v47-locked-in.md)

3. breaking news / single-fact reveal / pacing<30s
     → 9-BEAT NEWS-EXPLAINER (custom — see structures.md §3)

4. hot-take / opinion / cultural-noticing / pacing 35-45s
     → 10-BEAT TAKE (V46 trimmed: drop B3 calendar, B8 countdown, B10 cake; lean B11 tweet + B12 CTA)

5. tutorial / how-to / recipe
     → V47 spine, replace marquee/stat-counter with prompt-window + result + tweak panels

6. quiet-observation cultural notice (Justine FF.6 register)
     → 6-BEAT MICRO (intro observation → 4 evidence beats → close, no CTA)
```

**Deviation rule:** **NEVER exceed beats by >2 from the chosen template.** If the script naturally wants 17 beats but you picked V46 (12-beat), pick V47 instead. Stretching breaks pacing math.

**Auto-fail guards (from critique-rubrics.md):**
- pacing_target<30s + V46 12-beat = guardrail #3 violation → force 9-beat news-explainer
- topic_class=tutorial-howto + V46 = mismatch → force V47-tutorial

**Output format:**
```
structure: 9-beat-news-explainer
pacing_target: 28s
deviation_budget: 0 beats (exact)
rationale: breaking news, single-fact reveal, pacing<30s gates V46 out
```

---

## R3. TONE selector

**Source catalog:** `references/tonal-palettes.md` (6 named palettes with EL tags + caption stack + visual style + SFX bank + MG intensity recipes).

**Inputs:** `topic_class`, `hype_charge`, `audience_persona_lean`, `stakes`.

**Decision tree** (each clause checks lands-vs-bombs from tonal-palettes.md):

```
TONE = dark-humor       IF topic_class ∈ {drama/discourse, layoff-but-not-death,
                             model-killing-jobs, app-category-collapsing}
                          AND audience is sceptical-by-trade (AI-builder lean helps)
                          AND stakes ≠ grave
                          AND no identifiable real victim in the story
                        BOMBS on: deaths, named-victim layoffs, safety incidents,
                                  religious/political flashpoints

TONE = warm-humor       IF topic_class ∈ {culture-meme, low-stakes launches,
                             tool-fails-funnily}
                        BOMBS on: drama-with-real-victims, regulation, breaking-news,
                                  tutorials (mum-energy if warm-humored)

TONE = ironic-deadpan   IF hype_charge ≤ -1 AND topic_class is over-hyped
                          (channel posture: "we're not buying it"; FF.6 / FF.8 register)
                        BOMBS on: tutorials (viewer needs trust), first-time-creator
                                  content (deadpan needs an established posture)

TONE = sincere-awe      IF reel_intent=launch ∧ hype_charge ≥ +1
                          AND visual delta is the entire argument
                          (frontier capability that ACTUALLY lands; FF.2, FF.3, FF.13)
                        BOMBS on: incremental "8% faster" (fanboy aura);
                                  drama (reads pre-PR'd)

TONE = urgent-breaking  IF reel_intent=news AND pacing<30s
                          AND news genuinely <2h old, channel is first/early voice
                        BOMBS on: evergreen content, second-day stories,
                                  philosophical takes (manufactured stakes get clocked)

TONE = quiet-observation IF reel_intent=culture AND topic is "I keep seeing this"
                          AND not used in last 30 days (rarity is the format)
                        BOMBS if used >1× per 30 days (becomes the schtick)
```

**Tonal switching within a single reel** — patterns that work:
- **deadpan-open → sincere-build → playful-close** (Justine pattern). Best for hot-takes that don't want to come off as cynics.
- **awe-open → dark-humor-close**. Hook sells the magic, last beat undercuts ("you have 90 days before this is normal"). Pairs with sceptical-AI-builder audience.
- **urgent-open → quiet-close**. News lede, then 1.5s contemplative ducked-audio beat at -3s before CTA. The CC "breath" beat (retention-template.md).

**Patterns that break** (treat as critique auto-fail):
- warm-humor → dark-humor inside one reel = reads cruel.
- sincere-awe → ironic-deadpan inside one reel = bait-and-switch, kills trust.

**When tone is selected, the skill MUST draft EL tags + caption stack + visual anchor + SFX bank + MG intensity from the same palette row** (see tonal-palettes.md recipe table). Never mix without justification logged in `editorial-brief.md`.

**Output format:**
```
tonal_target_primary: ironic-deadpan
tonal_target_secondary: (optional) sincere-awe at beats 4-6
tonal_palette_row: tonal-palettes.md §4
rationale: hype_charge=-1 + audience sceptical of "model X just dropped" 5th time this month
```

---

## R4. EFFECTS palette selector

**Source catalog:** `references/effects-and-sfx.md` §J motion-FX catalog (50+ effects across J.1-J.9), §Z anti-patterns 2026.

**Inputs:** `tonal_target`, `topic_class`, `pacing_target`, `novelty_budget` (effects used in last 3 reels).

**Hard rules:**

```
1. Pick exactly 3 effects per reel (4 if pacing≥45s). NEVER 5+ — slideshow energy.

2. By tonal_target:
   sincere-awe       → 2.5D parallax + duotone flash + slow dolly-zoom
                       (avoid: glitch RGB, comic-pow, ransom-note)
   dark-humor        → halftone Ben-Day + zoom-out rug-pull + freeze-frame red-circle
                       (avoid: confetti, money-rain, sad-trombone visuals)
   ironic-deadpan    → halftone + freeze-frame + duotone (1-2 effects max)
                       (avoid: glitch, comic-pow, confetti, RGB-split)
   urgent-breaking   → whip-pan + glitch RGB + news-ticker
                       (avoid: dolly-zoom slow, parallax, gentle bob)
   warm-humor        → comic-pow + spring rubber-bounce + heart-pop
                       (avoid: glitch, vhs-error, shatter)
   quiet-observation → single dolly-in + duotone (NEVER more than 2 effects)

3. By topic_class:
   death/layoffs/grave → forbidden: comic-pow, money-rain, confetti, ransom-note,
                                    sad-trombone, party-horn visuals
   culture-meme        → ransom-note OR comic-pow encouraged; parallax discouraged
   tutorial-howto      → forbidden: glitch RGB, dolly-zoom vertigo, sudden zoom
                          (interferes with following the recipe)
   regulation-policy   → forbidden: comic-pow, confetti, ransom-note (naive aura)

4. Always avoid (effects-and-sfx.md §Z):
   - feTurbulence per-frame (bake to PNG instead)
   - filter: drop-shadow on per-frame elements (GPU brutal)
   - CSS animations / transitions (don't render correctly)
   - Math.random() anywhere (non-deterministic across workers)

5. Cool-down: if 2 of last 3 reels used the same effect → forbid for this reel.
```

**Output format:**
```
effects_palette:
  - 2.5D parallax (J.1) — for B2/B5/B6/B7 fullframe-broll
  - duotone flash (J.3) — for B1 hero pulse
  - slow dolly-zoom (J.1) — for B10 payoff
forbidden_effects:
  - comic-pow (clashes with sincere-awe)
  - confetti (last reel used it; cool-down)
  - vhs-error (mismatched with sincere tone)
rationale: sincere-awe palette + frontier model launch = restrained 3-effect set
```

---

## R5. SFX selector

**Source catalog:** `references/effects-and-sfx.md` §K motion→SFX matrix, §L duration clamps, §O 2026 avoid-list, V46/V47 SFX palettes (v46-locked-in.md / v47-locked-in.md).

**Inputs:** beat plan (motion events), `tonal_target`, `topic_class`, voice stem LUFS.

**Hard rules:**

```
1. Build cue list FROM the beat plan, NOT from a fixed palette.
   Each motion event = 1 cue. Each cue must have a 4-word rationale.

2. For each cue:
   a. Pick row from §K matrix by motion_type (whoosh / impact / pop / riser / ...)
   b. Pick filename from V46 or V47 palette (or custom)
   c. Apply §L maxDurationSec clamp (mandatory)
   d. Compute gain: voice stem at -12 LUFS = ceiling
      • SFX simultaneous with voice → -8 to -12 dB below
      • Sub-bass impact            → -10 to -15 dB below
      • Ambient bed                → -28 to -30 LUFS
   e. Write rationale field linking it to the motion event

3. If motion is already energetic (whip-pan + bg flash + caption pop),
   DROP sub-bass on that cut. Layering 3 audio + 3 visual = mud.

4. By tonal_target:
   dark-humor / ironic-deadpan
       → forbidden: cha-ching, vine-boom-default, mario-coin, party-horn,
                    sad-trombone (neutralises irony)
       → required: room-tone bed at -28 LUFS; ONE dry click + sub on landings
   sincere-awe
       → forbidden: cha-ching, comic-pow, hard-thud, click-tick spam
       → required: cinematic riser + bass-swell + reversed bell;
                   NO whoosh-on-cut
   urgent-breaking
       → forbidden: cha-ching, ascend-magic, party-horn
       → required: 1 short riser + sub-impact on hook; ticker-tone bed
   warm-humor
       → cha-ching ALLOWED only at literal money moment
       → pop + ding + soft whoosh
   quiet-observation
       → required: room-tone only, NO music, NO whoosh

5. By topic_class:
   death/layoffs/grave → forbidden ENTIRE celebratory bank
                          (cha-ching, ascend, pop-bubble, party-horn,
                           candleLight ding, magic-ding)
   regulation-policy   → forbidden: cha-ching, party-horn (clash with seriousness)

6. Always (effects-and-sfx.md §O 2026 avoid-list):
   vine boom AS DEFAULT, metal pipe falling, generic whoosh+vine combo,
   loud record-scratch on freeze, course-bro orchestral hit on every quote,
   Apple Mac startup chime, cash register at non-money moments,
   Mario coin (childish), 5-10 separate candle dings, "what the dog doin'"
```

**Cue row format** (every entry in `sfx-cues-<variant>-final.json`):
```json
{
  "startFrame": 0,
  "sample": "7 - SFX Pack EP 1/silex riser.mp3",
  "gainDb": -7,
  "maxDurationSec": 2.5,
  "rationale": "reel-start riser, hook entry"
}
```

**Critique fails any cue without a rationale clause.**

---

## R6. IMAGE-generation style anchor selector

**Source catalog:** `references/prompts/gemini-image.md` (style anchor tokens, 9 templates, refs[] rules), `references/hook-archetypes.md` (AA.16 vs AA.17 distinction).

**Inputs:** `topic_class`, `emotional_thesis`, `tonal_target`, asset role (hero / b-roll / B11 tweet card / etc).

**Decision matrix:**

```
By (topic_class × emotional_thesis):

news + grave/serious      → AP-wire photoreal grain (AA.16 vocabulary,
                            wire-photo template EE.1 #9)
news + absurd/culture     → cinematic-stylised (Sora-2 lookbook anchor)
launch (UI product)       → photoreal product-still + brand-logo refs[]
                            (template EE.1 #2 brand-logo-shaped object)
tutorial-howto            → clean cinematic; NO grain, NO film stock anchor
take + dark-humor         → vintage 90s-CRT or magazine-cutout collage
                            (NEVER photoreal — clashes with irony)
take + sincere-awe        → cinematic widescreen with shallow DOF
                            (anamorphic 2.39:1 + Vision3 grain)
culture-meme              → comic-book or doodle-marker
                            (signals "lol" pre-watch — comic anchor or
                             arrakis crayon anchor)
research-paper explainer  → AA.17 edutainment vocabulary
                            (35mm photoreal, naturalistic light, no chyron)
death/layoff/grave        → photojournalism-restraint
                            (photoreal candid, ungraded, no styling)
```

**Bombs (auto-fail in critique):**
- photoreal on a hot-take = uncanny-credibility clash
- comic/doodle on death/grave topic = trivialising
- vintage CRT on model-launch hype piece = anti-promotional, kills tool-name SEO
- AA.16 AP-wire grain on AA.17 explainer territory = audience confusion
- magazine-cutout on tutorial = looks unprofessional, viewer doubts recipe

**refs[] rules** (always apply):
- WORKS for: same character across scenes, product mockups, style transfer, composition mimicry
- FAILS at: >5 unique entities, copying poses precisely, mixing photoreal ref with stylized prompt
- Brand assets ALWAYS come in as refs[] for any logo'd surface (prevents "zeplit" hallucination)

**Output format:**
```
image_style_anchor: cinematic-photoreal-shallow-DOF
prefix_for_all_gemini_prompts: "anamorphic 2.39:1, teal-orange grade, halation bloom, Kodak Vision3 500T grain"
refs_required: [brand-logo.png] for B1/B4/B11
rationale: take + sincere-awe + frontier launch = cinematic anchor
```

---

## R7. IMAGE-animation motion verb selector

**Source catalog:** `references/prompts/veo.md` (motion verbs that land, camera moves, refusal workarounds), `references/prompts/meta-ai.md` (image-to-video pipeline).

**Inputs:** `emotional_thesis` intensity, `tonal_target`, `stakes`, asset type (face / UI / object / scene).

**HARVEST-FIRST RULE (validated in Petdex session):**

Before generating ANY motion asset, check whether the topic has **public video coverage** — source tweets with embedded videos, official launch demos, podcast clips, conference keynotes. The Petdex reel had `openai-pets-launch.mp4` (15s) + `petdex-gallery-build.mp4` (23s) sitting on disk unused while I was generating Veo i2v assets that recreated the same content less authentically.

```
Step 0 (BEFORE running R7's motion-verb tier selector):
  - List source tweets / videos on disk for this topic
  - For each beat, check: does a clip from harvested footage match the beat's content?
  - If yes → cut harvested clip with ffmpeg (-ss start -t duration), no generation needed
  - If no → fall through to R7 motion-verb tier selection (generate via Veo / Meta AI / etc.)

Generation is the FALLBACK, not the default. Recreated motion is inferior to real
footage because it loses authenticity (the viewer's "wait, is this real?" payload).
```

**Beat-by-beat motion-source priority (in order):**
1. `harvested-from-source-tweet-video` (cheapest, most credible) — see asset-cookbook.md
2. `screen-recording` (user records the actual product working) — for tutorials / install demos
3. `Meta-AI-image-to-video` (animate an existing still) — when motion is subtle and Veo would refuse
4. `Veo-3.1-with-character-refs` (~50% success on real-celebrity refs) — when likeness preservation is critical
5. `Veo-2-i2v` (free-tier batch) — when the asset is generic (B-roll, screenshots)
6. `CSS-Remotion-motion` (HeroScribblePane + spring-bounce + parallax) — when above all fail
7. `static` — only acceptable for tweet cards and ≤2 beats per reel

**Tier the motion verb by emotional_thesis intensity, NOT by topic.**

```
SUBTLE  drift, ripple, breathe, settle, glimmer, hover, sway, glint, flicker
        → tonal_target ∈ {sincere-awe, quiet-observation, ironic-deadpan}
        → AA.17 explainer beats (motion budget 0.5-1.5s)
        → 4-second Veo clamp

MID     tilt, pan, push-in, dolly, crack, lean, unfurl, exhale, rotate 90°,
        unfold, dissolve into particles
        → news, take, launch with strong visual
        → 5-6-second Veo clamp

STRONG  slam, shatter, rupture, cascade, detonate, vault, plummet, surge,
        crashes, explodes outward, morphs, slams down, whips around
        → ONLY when stakes ≥ high AND tonal_target ∈ {urgent-breaking, dark-humor}
        → 7-8-second Veo clamp
        → forbidden for tutorial, culture-meme, sincere-awe
```

**Camera vs subject motion** (by asset type):

```
face / portrait subject  → favour CAMERA (push-in, slow dolly, rack-focus)
                            subject motion reads as deepfake jitter
                            for AA.16 wire-photo: blink + slight head settle ONLY

UI / screenshot subject  → favour SUBJECT motion (cursor moves, panel slides)
                            camera motion reads as broken
                            for AA.17 explainer: 0.5-1.5s budget, ONE diegetic element

object / product subject → either, but pair: ONE camera + ONE subject move max
                            never both at full strength
                            for hero shots: 5% dolly-in + glints/breathes settles
```

**Forbidden verbs** (Veo struggles with these):
- `dances` — Veo struggles, animation breaks
- `runs` full-body — warps legs
- `complex hand gestures` — six-finger risk
- For real famous faces: any verb beyond `breathing, eye blink once` triggers refusal — fall back to `HeroScribblePane` CSS-motion (render-cookbook.md)

**Camera-move success rates** (budget retries accordingly):
- Static + small dolly-in: >90% success
- Crash zoom / whip pan: ~56% success — budget 2-3 retries
- Vertigo dolly-zoom: ~40% — budget 3 retries

**Output format:**
```
motion_verb_tier: SUBTLE
chosen_verbs: [drifts, glints, settles]
camera_moves: [5% slow dolly-in]
veo_duration_clamp: 5s
rationale: sincere-awe + face/portrait subject + AA.17 explainer = subtle camera-only
```

---

## How rubrics chain

After all 7 rubrics resolve, `editorial-brief.md` Phase 1 section contains the full plan:

```markdown
## Phase 1 rubric outputs
- structure: <variant>
- hook_archetype: <#N + name>
- hook_visual_template: <AA.X #M>
- hook_component: <component name>
- tonal_palette_primary: <palette>
- tonal_palette_secondary: <optional>
- caption_typography: <stack>  (from tonal-palettes.md)
- effects_palette: [<3 chosen>]
- forbidden_effects: [<list>]
- sfx_bank: <V46 / V47 / custom> + per-cue rationales
- music_bed: <description + LUFS target>
- image_style_anchor: <string>
- motion_verbs: [<list>]
- veo_duration_clamp: <4|5|6|7|8>
- hinglish_density: <0–100%>
```

Phase 2 (drafting) reads this. Phase 3 (critique) scores against it. Revisions append a new Phase 1 block — never overwrite.

---

## Mechanical-default detection

The critique pass (`references/critique-rubrics.md`) flags mechanical defaults. The rubrics themselves should pre-empt them:

- **Archetype #1 cool-down:** if last 3 reels = arch #1, R1 must step down to next-best. Rubric outputs flagged.
- **Cooper-italic default:** if every reel uses Cooper italic, R3 (TONE) is being skipped or every reel is being labelled sincere-awe — escalate to user.
- **Drift verb default:** if R7 outputs `drifts` 3 reels in a row, force a different SUBTLE verb (`ripples`, `breathes`, `glints`, `sways`).
- **V46 default:** if R2 outputs V46 5 reels in a row, escalate — channel is locked into one structure regardless of topic.
- **Cha-ching present:** if R5 outputs cha-ching on a non-money beat, auto-fail.

The `novelty_budget` field in Phase 0 intake is the memory the rubrics consult. Populate it from the last 5 `editorial-brief.md` files in `output/breaking/*/`.
