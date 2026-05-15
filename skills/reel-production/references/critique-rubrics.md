# Critique rubrics — the editor's last look

The Phase 3 critique pass. Score the draft, force revisions when mechanical defaults are detected, never silently ship a failing draft. Persists to `output/breaking/<slug>/critique-log.md`.

---

## Loop control

- **Max 3 critique passes.** Pass 4 = escalate to user with unresolved gates.
- Each revise pass MUST change at least one of: archetype / effect-palette / SFX subset / tonal target / beat order / structure variant. **Cosmetic edits (rewording captions) don't count as a revision.**
- If a pass produces all-PASS scores AND no auto-fails, exit early. Don't over-iterate.

---

## Asset-sufficiency gate (run BEFORE scoring; auto-escalate if fails)

**This gate fires at the START of Phase 3, before the scorecard, before auto-fails.** The reel cannot pass critique if its visual plan demands assets that don't exist or are insufficient.

For each beat in the visual plan, check:

1. **Does the chosen `assetSrc` exist on disk?** Missing = escalate.
2. **Is the asset distinct from other beats?** If 3+ beats reference the same `assetSrc`, that's slideshow-energy mech-default — escalate, propose distinct assets.
3. **Does the beat make a *demonstration claim*?** Lines like "you type one thing in the terminal", "the pet shows up", "watch this", "look at this" require *visible motion of the demonstrated thing*. A static screenshot of a tool's homepage does not satisfy a "watch the tool work" claim. Escalate with a specific asset request.
4. **Does the beat make a *transformation claim*?** Lines like "X became Y", "before / after", "Saturday morning this existed" need *evidence of the transformation* — a scroll, a wipe, a side-by-side, a screen-rec. Static stills with a caption stamped on top do not count.
5. **Does the chosen tonal palette have an asset shape it implies?**
   - `sincere-awe` → demands a *cinematic visual delta*. Static stills break the format.
   - `urgent-breaking` → demands wire-photo or screen-grab with motion (chyron scroll, camera flash, etc).
   - `ironic-deadpan` → demands *real footage with subtle motion* (Justine FF.6 = phone-feed POV with finger swipes, not slideshow). Restraint applies to SFX/effects/captions, NOT to visual motion. Static stills with deadpan captions = slideshow, not deadpan.
   - `warm-humor` → static permitted only if effects/animations carry motion (comic-pow, spring-bounce).
   - `quiet-observation` → static permitted at minimum 1-2 beats; remaining beats need motion.
6. **For each beat, what's the *motion source*?** Mark one of: `screen-rec`, `Veo-i2v`, `CSS-animation`, `Remotion-component-motion`, `static`. **No more than 2 beats can be `static`** in a reel of 6+ beats. (Tweet cards count as static-acceptable; everything else does not.)
7. **For demo / install / "watch this" beats specifically**, the motion source MUST be `screen-rec` or `Veo-i2v`. CSS-animation is not enough — the viewer must see the actual product working, not a recreation.

If ≥1 of the above gates fails, **DO NOT score the scorecard yet.** Write the failure to `critique-log.md` under `## Asset-sufficiency gate — FAIL`, list the missing/insufficient assets, propose specific generation jobs (Veo prompt, screen-rec target, Playwright capture), and escalate to user before any further critique.

**This gate exists because**: a reel can pass every editorial dim (hook, tone, structure, pacing, captions, SFX) and still ship as a slideshow with a voiceover. The editorial brain returns the right *plan* but does not guarantee the *production* matches. This gate forces the production check before render approval.

**Failure mode this catches**: "I'm using ironic-deadpan so I'll keep visuals static" — wrong. Deadpan applies to audio register and effects palette, not to visual motion. A viewer watching ~85% muted needs *visible motion* even more in deadpan reels because the silence-as-texture means the visuals are doing all the work.

### Asset-sufficiency gate — additional checks (Petdex-validated, May 2026)

Two more failure modes added after the Petdex shipment session:

**Harvest-before-generate gate**:
- For each beat, check `assets/research/<slug>/` for source-tweet videos / harvested footage that match the beat's content
- If matching source clip exists AND it's being ignored in favor of generated motion → **escalate**, not ship
- This catches: "I downloaded `openai-pets-launch.mp4` at Phase 0 and never used it; I generated Veo i2v assets that recreated the same content less authentically"
- Real footage carries the *"is this real?"* viewer payload that recreated motion can't. Generation is the fallback, not the default.

**Celebrity-cameo gate (for AI-news topics)**:
- If `topic_class ∈ {model-launch, feature-drop, acquisition, drama/discourse, hot-take-opinion}` AND the topic has a clear company-protagonist with abundant public-figure footage AND R1 did NOT fire AA.18/AA.19 → **escalate**
- This catches: "I picked archetype #1 Product Showcase because the topic is a launch; I missed that the launch has a celebrity protagonist (Sam/Sundar/Elon/Dario) and the strongest viral hook for 2026 is a celebrity cameo cold-open"
- Validated: the Petdex reel's strongest hook (50-Sams stadium) was the multi-instance Sora-cameo flex (AA.19), not a generic Product Showcase.

**Meta-AI-onboarding gate (for celebrity-likeness assets)**:
- If the visual plan calls for *pixel-perfect* celebrity likeness AND we're using Meta AI web (not the mobile app) → that's a hard policy block
- Meta AI web only generates *general likeness* from a ref image, not pixel-perfect preservation. Pixel-perfect requires the user to onboard their own face via the "Imagine Me" mobile app feature.
- For third-party celebrity likeness (Sam Altman, Sundar, etc.) the only reliable paths are: Sora 2 with cameo permissions OR accept "Sam-adjacent" general-likeness via Gemini Nano Banana Pro + ref image
- See `references/prompts/meta-ai.md` for the validated Petdex two-stage pipeline (Gemini still + Meta AI animate)

---

## Auto-fail signals (any one = revise immediately, do not score)

These are non-negotiable. If detected, kick directly to revision before doing the full scorecard.

1. **Frame-0 has no hook caption** (or caption fades in). Frame-0 rule, retention-template.md.
2. **Script opens on Hi/Hey/So/Today/Welcome/Let me/I want to talk about** — anti-opener list, hook-archetypes.md.
3. **Same archetype/effect/SFX-default as last reel** — novelty_budget breach (mechanical default).
4. **Tag conflict** in EL voice tags: `[serious][amused]`, `[deadpan][shouts]`, `[whispers][enthusiastic]`, `[urgent][casual]`.
5. **Cha-ching SFX present in non-money beat** — guardrail #1.
6. **Pacing target violated by >15%** (e.g. target 40s, draft is 32s or 47s).
7. **Taboo-zone phrase appears in script** — pulled from `editorial-brief.md` taboo_zones.
8. **Confetti / cake / money-rain on industry-disruption-anxiety topic** — guardrail #2.
9. **V46 12-beat used for pacing<30s** — guardrail #3.
10. **Hormozi yellow-pill caption stack on AI-curious-IN with sincere-awe or ironic-deadpan tone** — guardrail #10.
11. **Course-bro CTA: "tag 3 friends" / "comment below" / "like for part 2" / "follow for more"** — guardrail #9.
12. **SFX cue without rationale clause** — every cue must have a 4-word rationale linking it to a motion event.
13. **Photoreal Gemini stills paired with ironic-deadpan or dark-humor tone** — credibility/tone clash, guardrail #14.
14. **Comic / doodle / vintage-CRT image style on death/grave topic** — trivialising, guardrail.
15. **Hook claims X but payoff doesn't deliver** — algorithm trust erosion, retention-template.md.
16. **Re-hook beat absent at 12-18s mark** — retention dies; see retention-template.md.
17. **India-leaning reel without burned-in subtitles** — 85% muted; guardrail #12.
18. **CTA asks for follows when CTA priority is DM-send/save** — see audience-aisimplified.md save-CTA rule.
19. **Loop strategy violated: frame 0 ≠ frame N visually** — algorithm signal in 2026 (each loop = 1 view).
20. **Avatar visible <40% of bottom pane at any checkpoint** — locked-in non-negotiable.

### Script-writing auto-fails (read script.txt aloud, mark each line)

21. **Read-aloud fails** — any line sounds like an article being read, not a friend talking. See `references/script-writing.md` §0 rule 1.
22. **First-5-words catch is generic** — first 5 spoken words could open a hook on any topic. The catch must name a specific subject + an unexpected verb. See `script-writing.md` §1.
23. **Beat with subordinate clauses** — any beat has "X, which is Y" / "and that's when..." / "...because..." structure. Telegraph cadence required: one thought per beat, max two clauses. See `script-writing.md` §0 rule 3.
24. **Date-as-opener cadence** — beat starts with "Twelve months ago" / "By March" / "Last week" / "In 2026". Real speech buries the date inside a sentence; narrator-cadence puts it first.
25. **Triple-clause beat** — "It dances, skates, and fishes." Fragment across separate beats with period-as-pause.
26. **Course-bro hype word in script** — "incredible", "insane", "mind-blowing", "game-changing", "unbelievable" present anywhere. Drop the word; let the visual carry. (Reinforces guardrail #11.)
27. **Three or more filler tics stacked** — "I'm telling you" / "look" / "honestly" / "here's the thing" used in different beats of same reel. Pick ONE recurring voice-tic per reel, max.
28. **Question-mark close** — last beat ends in "?" with a rhetorical/open question. Closes must be declarative; use Pattern A/B/C from `script-writing.md` §4.
29. **Close adds a new fact** — last beat introduces information the rest of the reel didn't carry. The close is callback + reframe; it doesn't teach.
30. **Closing word doesn't echo the hook word** — visual callback rule. The hook noun (e.g. "fishing") must appear in the close; the visual loops back to it.

### Register / friend-voice auto-fails (added 2026-05-12, validated via veo4vs session)

31. **Credible-caveat missing** — for `topic_class ∈ {tutorial-howto, feature-drop, model-launch + comparison, tech-conflict, SaaS-opportunity, consumer-product-explainer}` the script MUST include a credibility line acknowledging what the tool/model CAN'T do. Without it, the reel reads as an ad. See `script-writing-saas-angle.md` §5 for canonical caveat forms. The validated veo4vs form is `But here's the twist. [Reveal]. The hard part is still [4-item enumeration].`

32. **Written-aphorism close** — close uses a screenshot-quotable parallel contrast (`X is solved. Y isn't.` / `Models are free. Lesson plans aren't.` / `The model is the product. The workflow isn't.`). These read as essay-pull-quotes, not voice-notes. Replace with Pattern A prediction-close (`Give it [N] months. [Your X] is [subject] too.`) OR Pattern B topic-meta rebuttal (`So no, [hook claim] didn't [verb]. [Specific narrowing] did.`). See `script-writing.md` §10.1.

33. **Formula-transition phrase stacking** — script opens multiple beats with stock pivot phrases (`Catch is —`, `Here's the thing —`, `Here's the part that gets me —`, `The thing is —`). Used once they're invisible; stacked across beats they read template-y. Pick ONE pivot phrase max per reel — preferably zero, with sentences starting directly with the new claim. See `script-writing.md` §10.2.

34. **Narrator-cadence at the WORD level (added 2026-05-15, validated via hfsuper-v4 session)** — even when overall register density is correct (middle-ground 12-18 words/beat per §11) and the read-aloud test passes at the sentence level, SPECIFIC WORD CHOICES still trigger narrator-voice failure. The four signal patterns: (a) **subjectless verb chains** — three or more verbs in a row without an explicit subject pronoun (`Writes the script, voices it, plugs your product in.` ← missing `It`); (b) **writerly verbs** — `land`, `emerge`, `manifest`, `leverage`, `harness`, `unlock`, `unleash` used as user-facing actions; (c) **dev jargon as user-facing verbs** — `hooks into`, `pipelines`, `interfaces with`, `integrates with`, `syncs to`; (d) **corporate marketing nouns** — `brief`, `asset`, `deliverable`, `stakeholder`, `synergy`, `leverage` (as noun), `solutions`. When detected, rewrite: add explicit subject (`It writes...`), swap writerly verb for everyday verb (`land → show up`), swap jargon for friendly verb (`hooks into → plugs into / connects to / remembers`), swap corporate noun for universal noun (`brief → project / ask / thing`). See `script-writing.md` §12 for the full bad → good mapping table + worked examples from the hfsuper-v4 session.

If ANY auto-fail trips → write the trip to `critique-log.md`, kick to revision, restart Phase 3 after fix.

---

## Critique scorecard (run after all auto-fails clear)

10 dimensions × 3 fields each. Each field is mandatory.

| Dimension | Score 1-5 | Mech-default? (Y/N) | Tonal-clash flag | Note |
|---|---|---|---|---|
| 1. Hook archetype fit | | | | |
| 2. Effects palette fit | | | | |
| 3. SFX cue rationale | | | | |
| 4. Image style anchor | | | | |
| 5. Motion-verb tier | | | | |
| 6. Tone coherence | | | | |
| 7. Structure fit | | | | |
| 8. Audience-fit (@aisimplified persona) | | | | |
| 9. Novelty-vs-last-5 | | | | |
| 10. Frame-0 cover | | | | |

### Scoring rubric (1-5)

- **5** — exemplary; this beat will be cited as the rationale next reel
- **4** — strong; passes without comment
- **3** — acceptable; works but not memorable. **Gate fails at 3 — revise.**
- **2** — weak; mechanical default suspected
- **1** — broken; auto-fail likely missed

### Mechanical-default detection (per dim)

For each dimension, mark `Y` if you can answer "yes" to **any** of:

| Dim | Mechanical-default checks |
|---|---|
| 1. Hook archetype | (a) #1 Product Showcase used for 3rd time in 5 reels? (b) hook is generic ("this changed everything") with no specific number/name? (c) opener is "wait for it…" or similar declining pattern? |
| 2. Effects palette | (a) same 3 effects as last 2 reels? (b) effects do not match tonal_target row in tonal-palettes.md? (c) >5 effects (slideshow energy)? |
| 3. SFX cue rationale | (a) cha-ching used at every payoff beat? (b) generic "whoosh + impact" combo on every cut? (c) any cue missing a rationale clause? |
| 4. Image style anchor | (a) photoreal default chosen without considering vintage/comic/AP-wire alternatives for tone? (b) Cooper italic + Inter caption stack chosen by default? |
| 5. Motion-verb tier | (a) `drifts` or `wobbles` used 3 reels in a row? (b) STRONG verbs used for tutorial/culture/sincere-awe? |
| 6. Tone coherence | (a) every beat is the same tone (no arc)? (b) palette row mixed with another row's recipe (e.g. dark-humor caption stack but warm-humor SFX)? |
| 7. Structure fit | (a) V46 12-beat chosen for 5 reels regardless of topic? (b) structure has >2 beats deviation from chosen template? (c) re-hook beat absent at 12-18s? |
| 8. Audience-fit | (a) "incredible / mind-blowing / game-changing" appears in script? (b) follow-ask CTA used despite save-CTA preference? (c) India-leaning reel without Hinglish despite India-anchored topic? |
| 9. Novelty-vs-last-5 | (a) archetype used 3+ times in last 5 reels? (b) effect repeated 2+ times in last 3? (c) tone repeated 3+ in last 5? |
| 10. Frame-0 cover | (a) frame 0 has no hook caption? (b) frame 0 ≠ frame N (loop strategy violated)? (c) face/output composition not in center 60% vertical? |

### Tonal-clash flag

For each dim, mark tonal-clash if the field's choice contradicts the chosen `tonal_target_primary`:
- Dim 2 effects don't match palette row in tonal-palettes.md
- Dim 3 SFX uses bank forbidden by tonal-palettes.md row
- Dim 4 image style anchor not in palette row recommendations
- Dim 5 motion-verb tier doesn't match emotional intensity
- Dim 6 itself is tone — flag if any beat's voice tags conflict with palette row

### Note column

Each row gets one specific observation. Generic notes ("looks good") = treat as if note was empty. Examples:
- Dim 1 Note: "Hook claims '7 reels' but payoff shows 5 — promise/payoff mismatch"
- Dim 3 Note: "B5 cue cha-ching at $0 reveal — celebratory clash with audience anxiety"
- Dim 9 Note: "Archetype #4 used in last 2 reels — flag as wear-out"

---

## Gate to render

**All of the following must hold:**
- Every dim ≥ 4
- No `Y` mechanical-default flag on any dim
- No tonal-clash flag on any dim
- All 20 auto-fails clear

If any condition fails → revise (max 3 passes total).

If pass 3 still fails → escalate to user with the unresolved gates. Do not silently ship.

---

## The 17 anti-mechanical guardrails

These are referenced from R-rubrics in `decision-rubrics.md` and enforced in this pass.

### Tonal clashes

1. **Do NOT use cha-ching SFX if `topic_class ∈ {death, layoff, regulation, safety-incident, drama-with-victims}`.** Celebratory SFX clashes with grief/anxiety register.

2. **Do NOT use confetti / cake / money-rain effects on industry-disruption-anxiety topics** (jobs evaporating, white-collar replacement, app categories collapsing). Reads dystopic-celebratory.

3. **Do NOT use sad-trombone or vine-boom-as-default** — both kill irony and date the reel (peaked 2022-23; only ironic now per §O 2026 avoid-list).

### Format mismatches

4. **Do NOT use V46 12-beat if `pacing_target<30s`** — drop to 9-beat news-explainer (structures.md §3).

5. **Do NOT use V47 19-beat showcase for single-fact news reveal** — wrong rhythm; viewer expects examples but you have one fact.

6. **Do NOT exceed beats by >2 from the chosen template.** If script naturally wants 17 beats but R2 chose V46 (12-beat), pick V47 instead.

### Tag conflicts

7. **Do NOT combine EL tags `[serious][amused]`, `[deadpan][shouts]`, `[whispers][enthusiastic]`, `[urgent][casual]`** — voice-stem will fail (or sound chaotic).

8. **Do NOT stack >2 EL tags on a single line** — model loses control beyond 2.

### Audience taboos

9. **Do NOT use "tag 3 friends / comment below / like for part 2 / follow for more"** — compounding penalty across all your content for weeks (§G 2026 CTAs).

10. **Do NOT use Hormozi yellow-pill caption stack on AI-curious-IN audiences when tone is sincere-awe or ironic-deadpan** — both audiences read it as course-bro.

11. **Do NOT write "incredible / mind-blowing / game-changing" in scripts** — channel gives off course-bro vibes; @aisimplified persona is sceptical of hype.

12. **Do NOT caption an India-leaning reel without burned-in subtitles** — 85% muted on mobile; partial captioning costs ~20% retention.

### Mechanical-default detection

13. **Do NOT use archetype #1 Product Showcase if it was used in the last 3 reels** — force novelty (R1 cool-down).

14. **Do NOT use photoreal Gemini stills for ironic-deadpan or dark-humor takes** — credibility/tone clash; switch to vintage-CRT or comic.

15. **Do NOT use AA.16 AP-wire-photo template for an AA.17 explainer topic, or vice versa** — audience confusion (different signal, different prompt vocabulary).

16. **Do NOT layer cha-ching + confetti + ascend at single beat** — celebration mud, course-bro vibe.

17. **Do NOT stack STRONG motion verb + glitch effect + sub-bass impact at the same frame** — pick 2 of 3; 3 layers = perceptual mud.

### Structure / retention

(implicit but listed for completeness:)

- Re-hook beat at 12-18s is **mandatory** — auto-fail if absent.
- Loop strategy (frame 0 = frame N) is **mandatory** — algorithm signal in 2026.
- 12+ frame stagger between siblings = lazy; sub-300ms entry animation = rushed.
- `Math.random()` anywhere = non-deterministic across workers.

---

## Revision triggers — what to change

When a critique pass fails, the next draft pass MUST change at least one of these (cosmetic edits don't count):

| Trigger | What to change | Where |
|---|---|---|
| Dim 1 < 4 OR Dim 1 mech-default | Hook archetype OR visual template OR component | R1 in decision-rubrics.md |
| Dim 2 < 4 OR Dim 2 mech-default | Effects palette (drop one, swap two) | R4 in decision-rubrics.md |
| Dim 3 < 4 OR Dim 3 missing rationales | SFX cue list (rebuild from beat plan) | R5 in decision-rubrics.md |
| Dim 4 < 4 OR style-anchor mismatch | Image style anchor across all Gemini prompts | R6 in decision-rubrics.md |
| Dim 5 < 4 OR motion-tier mismatch | Veo motion verbs across all clips | R7 in decision-rubrics.md |
| Dim 6 < 4 OR tonal-clash on any dim | Tonal palette (entire row swap) | R3 in decision-rubrics.md |
| Dim 7 < 4 OR structure-fit mismatch | Structure variant (V46 → V47 / 9-beat / 10-beat) | R2 in decision-rubrics.md |
| Dim 8 < 4 OR audience-fit fail | CTA verb / Hinglish density / caption stack | audience-aisimplified.md |
| Dim 9 < 4 OR novelty < 4 | Step down within R1/R2/R3/R4/R5 ranking | rubric outputs |
| Dim 10 < 4 OR loop violation | Frame-0 caption + frame-N visual match | retention-template.md frame-0 rules |

**Do not revise the same dim twice in a row** — if Dim 3 fails on pass 1 and pass 2 again, it's a deeper problem (likely tonal palette wrong); escalate to R3 instead.

---

## Persistence — `critique-log.md` per slug

Written end of Phase 3. Append per pass. Format:

```markdown
# Critique log — <slug>

## Pass 1 — <ISO datetime>

**Auto-fails triggered**: [<list, or "none">]

| Dim | Score | Mech-default? | Tonal-clash | Note |
|---|---|---|---|---|
| 1. Hook archetype fit | 3 | Y | - | Arch #1 used 3rd time in 5 reels |
| 2. Effects palette fit | 5 | N | - | duotone+parallax fits sincere-awe |
| 3. SFX cue rationale | 4 | N | - | all cues have rationales, gain calibrated |
| 4. Image style anchor | 4 | N | - | photoreal + brand-logo refs locked |
| 5. Motion-verb tier | 5 | N | - | SUBTLE matches sincere-awe |
| 6. Tone coherence | 4 | N | - | sincere-awe held across all 12 beats |
| 7. Structure fit | 4 | N | - | V46 12-beat fits brand-birthday |
| 8. Audience-fit | 4 | N | - | save-CTA, no course-bro hype words |
| 9. Novelty-vs-last-5 | 2 | Y | - | arch + effect palette both stale |
| 10. Frame-0 cover | 5 | N | - | hook caption present, loop confirmed |

**Gate**: FAIL (Dim 1 = 3, Dim 9 = 2, two mech-default flags)

**Revisions for Pass 2**:
- Step down archetype: #1 → #4 Specific-Number (R1 rule 10)
- Swap effect: parallax → 2.5D Ken-Burns (novelty)

## Pass 2 — <ISO datetime>
...

## Final — render approved <ISO datetime>
```

The user can grep `critique-log.md` across slugs to see common failure modes — that's how the channel develops editorial taste over time.

---

## What critique cannot catch (escalation cases)

Critique scores draft against rubrics. Critique CANNOT detect:

- **Whether the topic itself is interesting.** If the user picks a thin topic ("AI got smarter again"), every dim can pass and the reel still flops. Phase 0 hard gate (emotional_thesis + share_trigger writable without hand-waving) is the upstream defense.
- **Whether the visual delta is genuinely impressive.** Sincere-awe palette assumes the visual *actually* lands. If the Gemini still came out mediocre, no rubric can fix it. Phase 4 asset-gen iteration loop is the upstream defense.
- **Whether the avatar voice take is good.** ElevenLabs render quality, regional accent slip, prosody flatness — these need user/human review.
- **Drift from `editorial-brief.md` Phase 0 intake** during long iterative sessions. The skill MUST re-read intake at the start of every critique pass and confirm it still holds.

When critique can't catch something but the draft feels off, escalate to user with: "Pass 2 scored all green but I'm not confident — the [topic / visual / voice] feels [X]. Want me to flag a specific dim or rerun [Y]?"
