# Structures — when to use which template, and how to deviate

R2 (STRUCTURE selector in `decision-rubrics.md`) routes here. Five named structures, plus deviation rules. Pick one; do not stretch.

---

## Selector summary

| Topic shape | Structure | Beats | Pacing | Detail |
|---|---|---|---|---|
| Brand birthday / age / anniversary number = payoff | **V46** | 12 | 38-46s | §1 |
| "Look at these N examples" / before-after × 5+ / multi-tile | **V47** | 19 | 50-68s | §2 |
| Breaking news / single-fact reveal / pacing<30s | **9-beat news-explainer** | 9 | 22-30s | §3 *(new)* |
| Hot-take / opinion / cultural-noticing / pacing 35-45s | **10-beat take** | 10 | 35-45s | §4 *(new)* |
| Tutorial / how-to / recipe | **V47-tutorial** | 14-18 | 45-65s | §5 |
| Quiet-observation cultural notice (FF.6 register) | **6-beat micro** | 6 | 20-25s | §6 *(new)* |

**Deviation rule:** never exceed beats by >2 from the chosen template. If you need >2 beats, you picked the wrong template — go back to R2.

---

## §1. V46 — 12-beat brand-birthday / launch / free-deal

The locked-in pattern from the 2025 Replit reel. **Use when** topic is a single brand event with: (a) a number that is the payoff (anniversary, milestone, free-period count), (b) a free or limited-time hook, (c) a "go to brand.com today" call.

Full layout details in `references/v46-locked-in.md`.

| # | Layout | Voice line shape | Asset |
|---|---|---|---|
| B1 | `hero-video-pane` | hook line (3-5 words) | Veo hook clip 2.5s |
| B2 | `fullframe-broll` | the promise | Gemini still → Veo2 |
| B3 | `calendar-card` | "Check your calendar, if it's [DATE]…" | procedural |
| B4 | `mac-browser-frame` | "go to [BRAND] and …" | tweet video trim 3.5s |
| B5 | `fullframe-broll` | use case 1 | Gemini still → Veo2 |
| B6 | `fullframe-broll` | use case 2 | Gemini still → Veo2 |
| B7 | `fullframe-broll` | use case 3 | Gemini still → Veo2 |
| B8 | `broll-with-countdown` | "burning credits / 24 hours" | Veo2 burning element |
| B9 | `broll-with-price-flip` | "$X normally, today FREE" | Veo2 hero + price tag SVG + stamp |
| B10 | `big-number-confetti` | "[brand] just turned [N]" | procedural cake |
| B11 | `tweet-dark` | takeaway | tweet card |
| B12 | `youtube-comment-cta` | keyword + @aisimplified | YouTube clone |

**When V46 is wrong:**
- Topic is news (no birthday number) → use 9-beat news-explainer instead.
- Topic is comparison (5+ examples) → use V47.
- Pacing target <30s → guardrail #3 forces 9-beat news-explainer.
- No free-deal moment → drop B8 + B9 collapse to single "use case" beat. If 3+ beats are getting dropped, this is the wrong template.

---

## §2. V47 — 19-beat showcase / comparison / viral-prompt

The locked-in pattern from the @arrakis_ai scribble-prompt reel. **Use when** topic is "look at these N examples" with 5+ before/after pairs, or a stacked viral-prompt reveal across multiple tiles.

Full layout details in `references/v47-locked-in.md`.

| # | Layout | Voice line shape |
|---|---|---|
| B1 | `hero-video-pane` | hook ("everyone is doing X / look at this") |
| B2 | `scroll-3d-card-wall` | scope ("hundreds of people are using this") |
| B3 | `scroll-3d-card-wall` | escalation (different topCopy) |
| B4 | `chatgpt-typing-mockup` | "open ChatGPT and upload this" |
| B5 | `chatgpt-typing-mockup` | "paste this prompt" (shows the response) |
| B6-B15 | `side-by-side-horizontal` × 10 | one tile per before/after pair |
| B16 | `rapid-fire-gallery` | rapid cycle of all 10 results |
| B17 | `x-trending-heart-storm` | "going viral / #1 trending" stat reveal |
| B18 | `tweet-dark` | the original viral tweet (source credit) |
| B19 | `youtube-comment-cta` | keyword + @aisimplified |

**When V47 is wrong:**
- Only 1-3 examples → V47 will feel padded; use 10-beat take or 9-beat news instead.
- Topic is birthday/free-deal → V46.
- Pacing target <30s → V47 is too long, won't fit.

---

## §3. 9-beat news-explainer (new)

The missing pattern in the original skill. **Use when** topic is a single-fact news reveal: a model just dropped, a benchmark just published, an acquisition just announced, a feature just shipped. Pacing target <30s. The hook is the news; the body explains stakes; the close is save-CTA.

| # | Layout | Voice | Asset |
|---|---|---|---|
| B1 | `hero-video-pane` | breaking hook 5-8 words ("OpenAI just dropped this / Sora 3 is here") | AA.16 wire-photo OR screen-rec of the announcement |
| B2 | `tweet-dark` | the source claim ("here's what they said") | tweet card from source (preserved verbatim) |
| B3 | `fullframe-broll` | what changed ("now it does X") | Veo i2v of capability demo |
| B4 | `mac-browser-frame` OR `prompt-window` | the proof ("we ran it") | screen-rec of the feature working |
| B5 | `fullframe-broll` | the implication ("what this means for…") | Gemini still |
| B6 | `big-number-fact` (no confetti) | the stake ("affects 100M users / Free until Friday") | procedural number, NO confetti |
| B7 | `fullframe-broll` | who-it-hits ("so if you're a [X], here's…") | Veo i2v |
| B8 | `tweet-dark` | takeaway / quote (your take, or a smart reply) | tweet card |
| B9 | `youtube-comment-cta` | save+share CTA ("save this; if you want the link, drop a word") | @aisimplified clone |

**Critical rules for 9-beat news-explainer:**
- B6 uses `big-number-fact` NOT `big-number-confetti` — confetti reads celebratory, news register wants restraint.
- B6 SFX is sub-bass impact, NOT cha-ching. Even at acquisition-money beats, cha-ching is forbidden in this register.
- Re-hook beat falls at B5 (around t=14-18s in a 28s reel). The "what this means for you" pivot IS the re-hook.
- AA.16 wire-photo for B1 lands beautifully if the topic is genuinely current. Use only when news is <2h old; otherwise it reads manufactured.
- Avatar register is `[urgent][serious]` (urgent-breaking palette in tonal-palettes.md).

**When 9-beat news is wrong:**
- News is >24h old → audience already knows; pacing fights the thinking. Use 10-beat take instead, with hot-take framing.
- Topic has multiple facts, not single-fact → use V47 if 5+ facts, custom if 3-4.
- You don't have the source tweet/announcement → reconsider the topic.

---

## §4. 10-beat take (new)

For hot-take / opinion / cultural-noticing reels at 35-45s pacing. V46 trimmed: drop B3 calendar (no date payoff), drop B8 countdown (no urgency claim), drop B10 cake (no birthday). Lean B11 tweet + B12 CTA harder.

| # | Layout | Voice line shape |
|---|---|---|
| B1 | `hero-video-pane` | hook (your take in 5-10 words: "AI didn't kill design — it killed bad design") |
| B2 | `fullframe-broll` | the setup ("everyone says X") |
| B3 | `fullframe-broll` | the contradiction ("but here's what's actually happening") |
| B4 | `mac-browser-frame` | the evidence ("look at this") |
| B5 | `fullframe-broll` | example 1 |
| B6 | `fullframe-broll` | example 2 |
| B7 | `fullframe-broll` | example 3 |
| B8 | `tweet-dark` (lean hard) | a quote that supports OR a reply that disputes |
| B9 | `tweet-dark` (your take) | your formulation ("the real question is…") |
| B10 | `youtube-comment-cta` | "comment your take" or save-CTA |

**Critical rules for 10-beat take:**
- Tonal palette typically `dark-humor` or `ironic-deadpan` — see tonal-palettes.md for register.
- B5/B6/B7 are 3 supporting examples (rule of three: establish → reinforce → subvert in beats 5/6/7 respectively).
- B8/B9 lean tweet-dark — this is where the takes argue. Two tweet beats = the discourse engine.
- Re-hook at B4 (around t=14-16s) — "look at this" pivots the reel from setup to evidence.
- Avatar register: depends on tonal_target. Dark-humor = `[dry][smirks]`, ironic-deadpan = `[deadpan][matter-of-fact]`.

**When 10-beat take is wrong:**
- Topic is single news event, not a take → 9-beat news-explainer.
- Topic is a list of >5 examples → V47.
- Topic is a recipe/tutorial → V47-tutorial.
- You don't have a contrarian frame → it's not a take; reconsider.

---

## §5. V47-tutorial (variant of V47 for how-to / recipe)

Same V47 spine, but replace marquee + stat-counter beats with prompt-window + result + tweak panels.

| # | Layout | Voice line shape |
|---|---|---|
| B1 | `hero-video-pane` | hook ("here's how to do X in 10s") |
| B2 | `chatgpt-typing-mockup` (upload) | "open the tool, upload this" |
| B3 | `chatgpt-typing-mockup` (typing) | "paste this exact prompt" |
| B4-B5 | `prompt-window` | the actual prompt typed out (large, readable) |
| B6-B10 | `side-by-side-horizontal` × 5 | example results (5 not 10) |
| B11 | `mac-browser-frame` | the tweak panel ("change this knob if X") |
| B12 | `prompt-window` | one tweak example |
| B13 | `fullframe-broll` | "the trick is…" key insight |
| B14 | `youtube-comment-cta` | save-CTA + tool name |

**Critical rules for V47-tutorial:**
- Tonal palette is `warm-humor` or `sincere-awe` — never ironic-deadpan or dark-humor (viewer needs to trust the recipe).
- Avatar register: `[playful]` or `[curious]` or `[matter-of-fact]` — never `[smirks]` or `[deadpan]`.
- The actual prompt (B4-B5) should be readable in the viewer's first scrub-back — they will rewind to copy it.
- 5 examples (not 10) so the recipe stays the focus.
- Save-CTA dominates over keyword-CTA — tutorials are reference content, audience saves for later.

**When V47-tutorial is wrong:**
- Topic is news or take → 9-beat news / 10-beat take instead.
- You don't have a working recipe → don't ship; tutorials need real recipes.

---

## §6. 6-beat micro (new — quiet-observation register)

The Justine FF.6 / FF.8 pattern. Once-a-month max. Cultural noticing, not argument. No CTA fanfare.

| # | Layout | Voice line shape |
|---|---|---|
| B1 | `phone-feed-pov` OR `fullframe-broll` | observation ("every reel I see this week opens with…") |
| B2 | `side-by-side-stills` | evidence 1 ("same wording") |
| B3 | `side-by-side-stills` | evidence 2 ("different creator") |
| B4 | `fullframe-broll` (slow) | the noticing ("I don't think they're copying") |
| B5 | `fullframe-broll` | the gentle insight ("the model trained on the same example") |
| B6 | `fullframe-broll` (silent) | quiet close — no CTA, just a tool-name pinned and avatar at bottom |

**Critical rules for 6-beat micro:**
- Tonal palette MUST be `quiet-observation` (see tonal-palettes.md).
- Music: NONE. Room-tone bed only.
- SFX: minimal — one ambient diegetic per beat (swipe sound, paper rustle, distant traffic).
- Avatar register: `[casual][matter-of-fact]`, not direct address.
- NO save-CTA. The discourse IS the CTA. Quote-tweet ratio explodes precisely because the reel doesn't ask.
- Used >1× per 30 days = critique flags as the schtick (loses rarity).

**When 6-beat micro is wrong:**
- Topic is news / launch / take / tutorial — wrong register.
- Used in last 30 days — escalate to user; don't auto-pick.

---

## Custom structures (escalation case)

If R2 cannot match the topic to any of §1-§6, the skill must:
1. Log to `editorial-brief.md`: `structure: custom — none of the 6 templates fit`.
2. Sketch a beat plan with explicit reasoning ("topic has 4 facts and a recap; closest is 9-beat news but needs B7-B8 expansion to recap").
3. Escalate to user with the proposed custom structure for approval BEFORE drafting.

Do not silently invent a 14-beat custom structure when V47 (19) or 9-beat news fits. Custom is the last resort.

---

## Where the structure plugs into beats

Once the structure is chosen, R1 (HOOK) drafts B1 from the chosen archetype + visual template. R5 (SFX) builds the cue list per beat. R6 (IMAGE) selects style anchor for all Gemini stills. R7 (MOTION) selects motion verbs for all Veo clips.

The structure determines: beat count, layout assignment, beat-level voice line shapes, re-hook position, where the CTA goes, and which SFX bank applies (V46-locked-in, V47-locked-in, or custom).

The beat plan goes into `output/breaking/<slug>/visual-plan-<variant>.json` via `scripts/build-<brand>-plan.mts` (Phase 2).
