# Tonal palettes — the 6 named recipes

Six tones. Each is a complete recipe: ElevenLabs voice tags + caption typography + visual style anchor + SFX bank + motion-graphics intensity. **When R3 (TONE) selects a palette, every other rubric must draft from the same row.** Mixing rows without explicit justification = critique tonal-clash flag.

The user's emphasis is here — dark humor, humor, and feelings. Each palette below has lands-vs-bombs rules. The skill must apply them, not copy them blindly.

---

## The recipe table

| Palette | EL voice tags (max 2/line) | Caption stack | Visual style anchor | SFX pairing | MG intensity |
|---|---|---|---|---|---|
| **dark-humor** | `[dry][smirks]` + `[long pause]` before punch | DM Serif italic OR Cooper italic, low-contrast | vintage-CRT or magazine-cutout | sparse: ONE dry click + sub on landing; **NO cha-ching, NO trombone, NO party-horn** | low, 2 effects |
| **warm-humor** | `[playful][amused]` | Cooper italic OR Mukta for IN | photoreal-bright or comic | pop + ding + soft whoosh; cha-ching ONLY at literal money | mid, 3 effects |
| **ironic-deadpan** | `[deadpan][matter-of-fact]` + 0.8s pause before punch | Helvetica/Inter sentence-case, no caps drama | photoreal or AA.17 explainer | room-tone bed only + 1 diegetic per cut; **NO music, NO cha-ching, NO whoosh-on-cut** | minimal, 1-2 effects |
| **sincere-awe** | `[impressed][whispers]` | DM Serif Display italic OR lowercase serif | cinematic shallow-DOF photoreal | cinematic riser + bass-swell + reversed bell; **NO whoosh-on-cut** | mid-low, 2-3 effects |
| **urgent-breaking** | `[urgent][serious]` | Anton or Archivo Black caps OR Komika (sparingly) | AP-wire grain (AA.16) | short riser + impact + sub; ticker-tone bed | high, 3-4 effects |
| **quiet-observation** | `[casual][matter-of-fact]` | sentence-case Inter, soft shadow | photoreal handheld | room-tone only, **NO music, NO whoosh** | minimal, 1 effect |

The recipe row is the contract. If R5 (SFX) wants cha-ching but tonal_target=dark-humor, R5 loses — palette wins. If a creative reason demands deviation, log it in `editorial-brief.md` under `tonal_deviations:`.

---

## 1. dark-humor

**The system is the joke; the person is not.**

Lands when:
- Topic is *systemic* — jobs evaporating, app categories collapsing, white-collar disruption.
- Audience is sceptical-by-trade (AI-builder lean helps).
- No identifiable real victim. The joke sits with the *system*, not the *person*.
- Channel posture is "we see what's happening, not panicking, not celebrating either."

Bombs on:
- A death (founder, employee, public figure).
- A real layoff at a named company employees of which might watch.
- A safety incident with named victims.
- A religious or political flashpoint.
- Topics involving identifiable individuals as casualties — even if the system is the actual subject.

Voice register:
- VO is dry, slow, two-step. The first beat says the fact; the second beat says what the fact actually means. Pause between.
- Punchline is a deadpan observation, not a snarl.
- Never sound-effects-laughing-at-own-joke. The audience laughs; the channel watches.

Caption typography:
- DM Serif italic OR Cooper italic. **Low contrast** — soft drop-shadow, no caps drama.
- One word in slightly-bolder weight per beat at most. Yellow Hormozi-pill is **forbidden** — it makes dark humor read as snark, kills the register.

Visual style anchor:
- Vintage-CRT (90s broadcast aesthetic with mild scanlines and saturated reds).
- Magazine-cutout collage (deliberately lo-fi).
- **Never photoreal** — credibility/tone clash. Photoreal makes dark humor look like a cynical news report rather than a wry observation.

SFX bank:
- ONE dry click on each scene cut. ONE sub-bass on the landing line.
- **NO cha-ching, NO trombone, NO party-horn, NO record-scratch, NO mario-coin.** Each of these neutralises the irony or makes the joke read as cruel.
- Room-tone bed at -28 LUFS continuous. Music: none, OR a single ambient pad at -22 LUFS that fades out 1.5s before the punchline.

MG intensity:
- Low. 2 effects max — typically halftone Ben-Day for the punch beat + freeze-frame red-circle for the system-callout beat.
- No confetti, no money-rain, no comic-pow.

Sample script structure (40s, dark-humor on "graphic designers replaced"):
- B1 (hook, 2s): "Adobe just shipped this." [duotone flash on screenshot]
- B2 (3s): "It does the job your designer charges $400 for. In 12 seconds." [photoreal screen-rec]
- B3 (4s): "[long pause] Anyway." [magazine-cutout collage, freeze-frame]
- ... 

The "anyway" beat is the dark-humor punch. No SFX, just the pause. Caption: serif italic, "Anyway." centered.

Common dark-humor mistakes the critique should flag:
- Punchline played for laughs (warm-humor lapse).
- Multiple punchlines per reel (one per reel; rest of script supports it).
- Cha-ching at the moment a tool replaces a job (dystopic-celebratory clash).
- Using dark humor for a death — auto-fail.

---

## 2. warm-humor

**The thing fails funnily; we love it anyway.**

Lands when:
- A tool *fails* funnily — image generator hallucinates extra fingers, voice clone says someone's name wrong, agent gets stuck in a loop.
- An in-AI-community meme pops (the "vibes" debate, the "is this AGI?" graph).
- Low-stakes launch with quirky output.
- Topic is genuinely playful in source.

Bombs when:
- Drama-with-real-victims.
- Regulation / safety / breaking-news with real consequences.
- Tutorials — warm-humor on a recipe sounds like mum-energy, "you got this!" course-bro adjacent.

Voice register:
- VO is animated but not yelling. `[playful]` over `[excited]`.
- Beats end with rising intonation slightly more than dark-humor; punchlines land on a small lift.
- Avatar can mug (slight smile / raised eyebrow expression).

Caption typography:
- Cooper italic for US-leaning audience. Mukta for India-leaning if Hinglish density >30%.
- Word-by-word reveal works here (it kills dark-humor and ironic-deadpan but works for warm).

Visual style anchor:
- Photoreal-bright (well-lit, soft shadows, warm grade).
- Comic-book pop-art for tonal cousin moments.
- Both are fine for warm; dark-humor's vintage-CRT looks too cold here.

SFX bank:
- pop + ding + soft whoosh on element entries.
- cha-ching ONLY at literal money moment. If beat shows price → cha-ching is fine. If beat shows tool-replaces-job → still forbidden (clash).
- Music: light comedic bed at -22 LUFS, allowed but optional.

MG intensity:
- Mid. 3 effects — comic-pow on the punch, spring rubber-bounce on the entry, heart-pop on the warmth beat.
- Confetti permitted at literal celebrations only.

Common warm-humor mistakes:
- Drifts into course-bro energy (every line ends "isn't that AMAZING?").
- Music too loud (bed should be at -22, not -16).
- Used on a topic where the failure has real-world impact — reads naive.

---

## 3. ironic-deadpan

**We're not buying it. The viewer figures out the joke without us spelling it.**

Lands when:
- Topic is over-hyped and the channel's posture is "we're not buying it."
- Justine Moore's FF.6 / FF.8 register: room-tone only, sentence-case captions, NO music, single dry punch.
- Hype-overload moments where the entire AI community is performing awe — channel pulls back.
- Audience is in on the joke (AI-builder lean dominant).

Bombs on:
- Tutorials — viewer wants plain instruction, deadpan reads as cold.
- First-time-creator content — deadpan needs an established posture; cold to newcomers.
- Genuinely impressive launches (e.g. a frontier model that *actually* lands) — anti-promotional, kills tool-name SEO.
- Anything where viewer needs to trust a recipe.

Voice register:
- `[deadpan][matter-of-fact]` is the canonical pair. Not `[smirks]` — that's dark-humor's cousin.
- 0.8s pause before the punch line (versus dark-humor's `[long pause]` which is ~1.2s).
- Avatar expression: neutral, slight head-tilt at the punch. No smile.

Caption typography:
- Helvetica or Inter, sentence-case, no caps drama. Soft shadow. Low contrast.
- The captions are the *content*, not the styling. Anti-design serif lowercase variants also work (FF.2 register).

Visual style anchor:
- Photoreal — but understated. NOT cinematic-shallow-DOF; that reads pre-PR'd.
- AA.17 explainer aesthetic also works.
- **Never** comic, doodle, vintage-CRT — those signal "we think this is funny" pre-watch and ruin the deadpan.

SFX bank:
- Room-tone bed only at -28 LUFS continuous.
- ONE diegetic SFX per cut (paper-tear, page-turn, distant phone). NO whoosh-on-cut, NO cha-ching, NO music.
- Silence does the heavy lifting — the absence of music is the texture.

MG intensity:
- Minimal. 1-2 effects max. Halftone or duotone, used once.
- Confetti, comic-pow, glitch RGB are all forbidden — they signal "we think this is exciting" and kill the deadpan.

Sample script structure (25-30s, ironic-deadpan on "AI influencers fooling dudes"):
- B1 (hook, 2s): silent room-tone, finger swipes phone feed [POV phone].
- B2 (3s): "She's not real." [sentence-case caption, sub-only SFX]
- B3 (5s): "Eyes don't reflect the same way." [pinch-zoom on eye, paper-tear SFX]
- B4 (3s): "Engagement is up 4×." [chart screen-rec, no music]
- B5 (3s): "[long pause] We're going to be fine." [black frame, sentence-case].

The understated close is the joke. No CTA, no cha-ching.

Common ironic-deadpan mistakes:
- Dropping in any music bed (kills the deadpan).
- Using cha-ching at the "engagement up 4×" beat (clash).
- Letting the avatar smile (kills the register).
- Using ironic-deadpan on a model launch you *actually* think is impressive (anti-promotional, hurts SEO).

---

## 4. sincere-awe

**The visual delta is the entire argument. Get out of its way.**

Lands when:
- A frontier capability *actually* lands. The model's output is genuinely impressive (FF.2 Nano Banana, FF.3 restoration, FF.13 Higgsfield).
- The visual delta is the entire argument — viewer sees it and you don't need to explain.
- Restoration content (sepia photograph → full color), single-take cinematic clips, cross-domain demos.

Bombs on:
- Incremental "now 8% faster" updates — reads as fanboy.
- Drama (reads pre-PR'd, viewers smell it).
- Anything where the visual is mediocre and you need to oversell.

Voice register:
- `[impressed][whispers]` is the canonical pair.
- Slow, slight breath. The script gets out of the way of the visual.
- Avatar expression: open, slight head-back wonder.

Caption typography:
- DM Serif Display italic, 80-110px on 1080×1920, top-third.
- OR lowercase serif (anti-Helvetica, signals "premium" not "TikTok-bro" — FF.2 register).
- Single declarative line per beat. White-on-shadow, NO emojis.

Visual style anchor:
- Cinematic shallow-DOF photoreal. Anamorphic 2.39:1 letterbox, teal-orange grade, halation bloom, Kodak Vision3 500T grain.
- Frame composition: subject not centered; rule-of-thirds; gestural moment captured.

SFX bank:
- Cinematic riser at -22 LUFS leading into reveal beats.
- Bass-swell + reversed bell on the punch.
- **NO whoosh-on-cut** — kills the register; the silence between cuts is part of the awe.
- Music: light cinematic synth bed at -18 LUFS, evolving pads, no drum loop.

MG intensity:
- Mid-low. 2-3 effects — 2.5D parallax on hero, slow dolly-zoom on payoff, duotone flash for emphasis.
- Confetti, comic-pow, glitch — all forbidden (rookie energy in a register that should feel earned).

Sample script structure (30s, sincere-awe on "Flux Kontext photo restoration"):
- B1 (3s): "This is my grandfather. 1936." [sepia 1936 portrait, slow dolly-in]
- B2 (4s): "Six seconds later." [wipe-line traverses left→right, restored full color]
- B3 (3s): "Same face." [DM Serif Display italic caption]
- B4 (5s): "Restored by AI." [tool-name overlay, cinematic riser]
- B5 (rest): "How to try it yourself." [link in bio; CTA is utility, not hype]

Common sincere-awe mistakes:
- Hyperbolic captions ("MIND-BLOWING", "INSANE") — wrong register, makes it course-bro.
- Whoosh on every cut — kills the silence-between-cuts that sells the awe.
- Used on incremental updates — fanboy aura.
- Avatar yelling — `[shouts]` is forbidden in this palette.

---

## 5. urgent-breaking

**The news is real and recent. Move fast, don't sound rehearsed.**

Lands when:
- News is genuinely <2h old.
- Channel is the first/early voice (Rowan Cheung FF.12 model).
- Acquisition announcements, model launches at the moment of drop, regulatory rulings.

Bombs on:
- Evergreen content — manufactured urgency gets clocked.
- Second-day stories — the audience already knows.
- Philosophical takes — pacing fights the thinking.
- Tutorials — urgency interferes with following the recipe.

Voice register:
- `[urgent][serious]` is the canonical pair.
- Faster pacing — 2.8-3.2 WPS on hook, 2.5-2.8 on build.
- Avatar slightly more upright; less mugging. Direct address.

Caption typography:
- Anton or Archivo Black, ALL CAPS, sentence per beat. White-on-shadow, possibly red highlight on key word.
- OR Komika Axis, 2-word stamps (used sparingly — once per reel max; otherwise reads MrBeast-clone).

Visual style anchor:
- AP-wire grain (AA.16 vocabulary). Press-photo aesthetic — subject not centered, telephoto compression, available light, ENG broadcast color.
- Real-source watermark in corner ("AP / 2026", "Reuters / Pool") — even though it's fake, brain reads watermarks before content and removes the "this is AI" tell.

SFX bank:
- Short riser (1.5s) leading into hook impact.
- Sub-impact on the hook reveal.
- Ticker-tone bed at -25 LUFS continuous (suggests live broadcast).
- One camera-flash burst at the news-photo motion start.

MG intensity:
- High. 3-4 effects — whip-pan + glitch RGB on cut + news-ticker scroll + chyron text.
- This is the one palette where high MG intensity is appropriate. Sincere-awe and ironic-deadpan would both punish it.

Sample script structure (25s, urgent-breaking on "Anthropic acquisition rumor"):
- B1 (3s): "Anthropic just got an offer." [AP-wire photo of Dario, ticker scrolls]
- B2 (4s): "Ten billion. From [redacted]." [redacted document on desk]
- B3 (5s): "The deal closes Friday." [chyron text, ticker-tone bed]
- B4 (5s): "Here's what changes." [explanatory beats, slow chyron scroll]
- B5 (8s): "Save this if you use Claude." [save-CTA, no cha-ching]

The save-CTA is critical. Urgent-breaking does NOT pair with cha-ching or party-horn — those undermine the "I have real news" frame.

Common urgent-breaking mistakes:
- Used on second-day stories — manufactured-stakes clock.
- Cha-ching at the "$10B" beat — celebratory clash.
- Avatar smiling on hook — wrong register.
- Music drum loop — interferes with ticker-tone bed.

---

## 6. quiet-observation

**Once a month. The rarity is the format.**

Lands when:
- Topic is "I keep seeing this and it's weird" — cultural noticing without judgment.
- Used precisely *because* it's rare — the channel has earned a once-a-month register shift.
- Discourse-by-noticing rather than discourse-by-arguing.
- Reels FF.6 register — Justine's "AI influencers fooling dudes" pattern.

Bombs if:
- Used twice in 30 days (becomes the schtick, stops feeling noticed).
- Used on launches or time-sensitive news.
- Used as a default for hot-takes — different register; hot-take wants ironic-deadpan, not quiet-observation.

Voice register:
- `[casual][matter-of-fact]` — softer than ironic-deadpan, less performative.
- Pace is slower — ~2.0 WPS sustained.
- Avatar register: relaxed, looking slightly off-camera as if thinking aloud.

Caption typography:
- Sentence-case Inter, soft shadow. Single line per beat.
- No emphasis colors, no caps. The text is information, not stylized.

Visual style anchor:
- Photoreal handheld, slightly imperfect. Phone-feed POV is the canonical hero (FF.6).
- Daylight or filmic key. Minimal grade. Looks "just shot."

SFX bank:
- Room-tone bed only. NO music, NO whoosh, NO cha-ching, NO ding.
- One ambient diegetic per beat (the swipe sound on phone, distant traffic, paper rustling).

MG intensity:
- Minimal. 1 effect — typically a single dolly-in or duotone flash — used once across the whole reel.
- The visual restraint is the format.

Sample script structure (20-25s, quiet-observation on "everyone using same prompt"):
- B1 (3s): "Every reel I see this week opens with this prompt." [phone-feed POV, swipe SFX]
- B2 (5s): "Same wording. Different creator." [side-by-side stills, no music]
- B3 (5s): "I don't think they're copying. I think the model trained on the same example." [contemplative pause]
- B4 (5s): "Anyway. Here's what to use instead." [single tip, no CTA fanfare]
- B5 (3s): silent close, tool-name pinned.

No CTA fanfare; the discourse IS the CTA.

Common quiet-observation mistakes:
- Treating it as ironic-deadpan-lite (different register; quiet-observation has no irony).
- Adding music (kills the noticing-frame).
- Using twice in a month (loses the rarity).

---

## Tonal switching within a single reel

Patterns that **work**:

### deadpan-open → sincere-build → playful-close (the Justine pattern)
- Hook beats 1-2: ironic-deadpan ("ok"). Cold observation, no music.
- Beats 4-8: sincere-awe builds. Music fades up at -22 LUFS. Visual delta accumulates.
- CTA: warm-humor. Closing wink, save-CTA, light cha-ching allowed if a literal money moment.

Best for hot-takes that don't want to come off as cynics. The deadpan opener sets the channel as a watcher; the sincere middle earns trust; the playful close releases tension.

### awe-open → dark-humor-close
- Hook beats 1-2: sincere-awe. Cinematic riser, the visual sells.
- Beats 3-N: technical demonstration, sincere palette.
- CTA: dark-humor undercut. "You have 90 days before this is normal." Caption in DM Serif italic.

Pairs with sceptical-AI-builder audience. Hook respects the frontier achievement; close acknowledges what it costs.

### urgent-open → quiet-close
- Hook beats 1-2: urgent-breaking. Ticker-tone, AP-wire visual.
- Beats 3-N: news beats with chyron.
- Last beat (-3s before CTA): quiet-observation 1.5s contemplative ducked-audio "breath beat" (retention-template.md §CC).
- CTA: save-CTA, no cha-ching.

The breath beat lets the news land. Without it, urgent-breaking-only reels feel manufactured.

Patterns that **break** (treat as critique auto-fail):

### warm-humor → dark-humor inside one reel
Reads cruel. Audience invested in the warmth gets blindsided by the dark beat.

### sincere-awe → ironic-deadpan inside one reel
Bait-and-switch. Kills trust. If the reel was sincere about the visual delta and then closes with "anyway, you'll all be unemployed in a month" without earning the shift through the structure, the audience feels played.

Acceptable shift requires either (a) explicit sincere → dark-humor pairing pattern above, where the sincere is genuine and the dark-humor close is the *cost* not the punchline, or (b) tonal_target_secondary explicitly logged in `editorial-brief.md` with a one-line rationale.

---

## Mistakes the existing skill is silent about (this palette layer closes the gaps)

These are scenarios the original 2056-line SKILL.md had no rule for. Each is now a critique auto-fail or guardrail.

| Scenario | Why it bombs | Where caught |
|---|---|---|
| Dark humor on a death topic | Cruel. The system isn't the joke; a person is. | guardrail #1 + topic_class=death triggers `tonal_target=dark-humor` auto-fail |
| Deadpan on a hype-launch (model genuinely impressive) | Anti-promotional; kills tool-name SEO; viewer reads cynicism even though channel is excited | R3 lands-vs-bombs check |
| Sincere awe on incremental release | Fanboy aura; "now 8% faster" doesn't earn the awe | R3 lands-vs-bombs check |
| Cha-ching on a layoff topic | Celebratory clash with grief register | guardrail #1 + topic_class triggers |
| Warm humor on regulation/safety topics | Naive aura; sounds like channel doesn't grasp stakes | R3 lands-vs-bombs check |
| Confetti at the moment a feature replaces a job | Reads dystopic-celebratory; FF-anti-pattern | guardrail #2 + dim 2 mech-default |
| Cooper-italic captions on dark-humor reel | Wrong register (Cooper italic reads warm); use DM Serif italic instead | dim 4 tonal-clash flag |
| Yellow Hormozi-pill captions on sincere-awe | Course-bro clash; kills premium register | guardrail #10 + dim 4 tonal-clash |
| Room-tone bed missing on ironic-deadpan | Silence is the texture; without bed, beats feel empty | dim 3 tonal-clash flag |

---

## How to use this file

1. R3 in `decision-rubrics.md` selects `tonal_target_primary` (and optional secondary).
2. Read this file for the chosen palette ONLY.
3. Other rubrics (R1 hook, R4 effects, R5 SFX, R6 image style, R7 motion verb) draft from the chosen palette's row.
4. Phase 3 critique scores draft against this file's rules.
5. Tonal-switching patterns are explicit at the doc level; if reel mixes palettes, log the secondary tone and pattern in `editorial-brief.md`.
