# User-feedback vocabulary — translate critique into rubric actions

The user gives feedback in vague natural language. The skill must translate it into specific rubric actions. This file is the translation table.

When the user says something like "make it punchier" / "less hype" / "more dark" / "this feels off", **DO NOT ask "what specifically?" first** — first map their phrase to the most likely rubric action, propose the change, then ask for confirmation.

---

## §1. Common feedback phrases and their rubric translations

| User says | Likely meaning | Rubric actions |
|---|---|---|
| "make it punchier" | Pacing too slow OR hook too weak OR script too verbose | (1) Tighten WPS to 2.8-3.2 on hook (retention-template.md). (2) Cut adjectives — every word must earn its place. (3) Consider stronger archetype (#4 Specific-Number → harder). (4) Cut beats if structure is over-budget. |
| "less hype" / "less course-bro" | hype_charge too high OR audience taboo violated | (1) Drop hype_charge by 1 (e.g. +2 → +1, or +1 → 0). (2) Re-run R3 (TONE) — likely shifts from sincere-awe to ironic-deadpan. (3) Strip "incredible/insane/mind-blowing" from script. (4) If Hormozi yellow captions, swap to Cooper italic + Inter. |
| "make it more dark" / "darker" | Tonal palette wrong; needs dark-humor or ironic-deadpan | (1) R3 TONE → dark-humor primary. (2) Caption stack → DM Serif italic. (3) SFX → drop cha-ching/party-horn; add room-tone bed. (4) Image style → vintage-CRT or magazine-cutout instead of photoreal. (5) Effects → halftone + freeze-frame. |
| "make it more sincere" / "more honest" | Caption stack too punchy OR tone too ironic | (1) R3 TONE → sincere-awe primary. (2) Caption stack → DM Serif Display italic. (3) Strip ironic markers. (4) SFX → cinematic riser + bass-swell. (5) Avatar tags → `[impressed][whispers]`. |
| "more deadpan" / "less excited" | Avatar register too animated; tonal palette mismatch | (1) R3 TONE → ironic-deadpan. (2) EL tags → `[deadpan][matter-of-fact]`. (3) Add 0.8s pause before punchlines. (4) Caption stack → Helvetica/Inter sentence-case. (5) Drop music; room-tone bed only. |
| "this hook is weak" | Archetype mismatch OR hook is generic | (1) Re-run R1 with stricter check — archetype #1 stepping down to #4 or #7 if specific-number / news fits. (2) Strip generic words ("this AI tool", "everyone is talking about"). (3) Force specifics: number, name, noun. (4) Check anti-opener list. |
| "the structure feels wrong" | Beat count mismatched to fact count OR wrong template | (1) Re-count facts in source material. (2) Re-run R2 — likely structure variant change (V46 → V47 or 9-beat). (3) Check beat-deviation rule: if >2 beats over template, change template. |
| "too many cuts" | Pacing too dense; cut cadence wrong for tonal palette | (1) If sincere-awe: target 1-2 cuts per 8s; if currently 3+, reduce. (2) Drop one or two transitions; lengthen the remaining beats. (3) Check cut math: 8-12 cuts/30s for compilation reels; 1-2 for "wow-clip" reels. |
| "too few cuts" / "feels slow" | Cut cadence too sparse for energy needed | (1) Add cuts at every voice-stress word. (2) Insert micro-beats: zoom on key word, BG flash on emphasis. (3) Check pacing math — sometimes the script is the issue, not the cuts. |
| "feels mechanical" / "feels like AI made it" | Mechanical defaults present | (1) Check editorial-instincts.md §3 anti-AI-output-tells — count tells. (2) Re-run R1 if archetype #1 detected. (3) Check caption stack — Cooper italic default? Force re-derive from tonal palette. (4) Check SFX rationales — generic? Force specific. |
| "the tone is off" / "feels weird" | Tonal palette mismatch OR row-mixing detected | (1) Check tonal_target_primary in `editorial-brief.md`. (2) Verify all rubric outputs come from same palette row. (3) Look for cross-row contamination (e.g. Cooper italic on dark-humor, or whoosh on sincere-awe). (4) Re-run R3 from scratch — Phase 0 emotional_thesis may be wrong. |
| "this caption is bad" | Caption typography or wording mismatch | (1) Verify caption stack matches tonal palette row. (2) Check caption text — too many words emphasized? Cut to 2-3 emphasis words per beat. (3) Check sound-off legibility — does the caption alone tell the beat? |
| "the SFX is annoying" | SFX too dense OR wrong SFX for tone | (1) Audit cue count vs beat count — 1 cue per motion event, not 3. (2) Check rationale fields — generic = remove. (3) Verify SFX bank matches tonal palette row. (4) If sincere-awe: drop whooshes on cuts. (5) If dark-humor / ironic-deadpan: drop cha-ching/party-horn. |
| "the visual doesn't work" | Image style anchor wrong OR Veo motion verb wrong | (1) Check R6 IMAGE STYLE — anchor matches topic × tone? (2) Check R7 MOTION — tier matches emotional intensity? (3) Common: photoreal on dark-humor (mismatch); STRONG verbs on sincere-awe (mismatch). |
| "too much text" / "it's a slideshow" | Captions doing too much narration; reel is text-driven not visual-driven | (1) Trim captions to 2-3 emphasis words per beat. (2) Verify hook caption is 6 words max, not a sentence. (3) Force visuals to carry meaning; captions only emphasize. |
| "the CTA feels lame" | Wrong CTA verb for share_trigger | (1) Re-check share_trigger in `editorial-brief.md`. (2) Map to CTA: utility → save; awe → save or DM-send; argument-bait → "comment your take"; ick → DM-send-to-friend. (3) Strip "follow for more" if alone. (4) Check region: IN → keyword-comment; US → save/DM-send. |
| "make it more viral" / "go bigger" | Vague — likely Phase 0 intake is thin | (1) Re-run topic-classifier.md — is emotional_thesis specific? share_trigger pickable? (2) If thin, escalate to user — topic may not have a strong viral angle. (3) If Phase 0 strong: check frame_zero_promise and re-derive cover frame. |
| "feels like every other reel on AI" | Novelty deficit | (1) Audit novelty_budget — archetype, effect, tone repetition vs last 5 reels. (2) Step down within archetype rankings. (3) Pick a reference creator (FF.X) the channel hasn't borrowed from in 30 days. (4) Switch structure variant. |
| "too long" | Pacing target wrong OR script is over-padded | (1) Check pacing_target — if 55s but topic is news, drop to 28s + 9-beat news-explainer. (2) Cut beats in the middle (B5/B6/B7 use cases — usually 2 lands). (3) Tighten WPS. |
| "too short" | Script doesn't earn the topic | (1) Add a re-hook beat at 12-18s if missing. (2) Add a "what this means for you" beat. (3) Don't pad — only add beats that *advance* the thesis. If you can't add an advancing beat, the topic is thin. |
| "the avatar feels off" | EL voice tags wrong OR script reads off-channel | (1) Verify EL tags match tonal palette row. (2) Check tag conflicts (`[serious][amused]` etc). (3) Read script aloud — does it sound like a friend talking? If no, rewrite. (4) Check Hinglish density per audience persona. |

---

## §2. Translating ambiguous feedback

When the user feedback is ambiguous, ask exactly ONE clarifying question that narrows the rubric:

| User says | Ambiguous about | Ask |
|---|---|---|
| "I don't like this" | Anything | "Is it the hook, the tone, or the pacing?" |
| "Something's off" | Tonal palette OR Phase 0 intake | "Does the topic itself feel right? Or is it the way it's executed?" |
| "Make it better" | Everything | "What single thing would land better? Hook? Tone? CTA?" |
| "More energy" | Pacing OR effects OR SFX | "Faster cuts, brighter SFX, or louder script?" |
| "Less energy" | Same axes | "Slower cuts, quieter SFX, or calmer script?" |

Ask exactly one. Don't stack 3 questions — user disengages.

---

## §3. Translating "this is great, do more like this"

When the user says "perfect" or "yes exactly" or "keep it like this" or accepts the draft without comment:

1. **Note the choices that worked.** Save to `editorial-brief.md` under `## Validated patterns:` — what archetype + tonal palette + structure + effects + SFX worked. This becomes a positive precedent.
2. **Update novelty_budget.** This combo is now "used" — next reel must vary at least one dimension to avoid wear-out.
3. **Don't lock in.** The user accepting once doesn't mean they want this combo forever. The novelty cool-down still applies after 3 uses.

When the user says "do more like X" (X = a specific reel or creator):
1. **Identify what made X work.** Ask user OR cross-reference `viral-anatomies.md` if X is in FF.1-FF.15.
2. **Map to rubric values.** Is X using a specific archetype? structure? tonal palette?
3. **Apply to current reel** if appropriate, but check audience-fit and topic-fit first.

---

## §4. When the user feedback contradicts a rubric

If the user says "make it more X" and X violates a guardrail:

1. **Honor the user request.** They are the editor-in-chief.
2. **Flag the guardrail conflict.** Log in `editorial-brief.md` under `rubric_overrides:` with the user's reason if known.
3. **Apply the override** but keep critique-pass scoring honest — the guardrail flag stays in `critique-log.md`.
4. **If the override is repeat (3+ same overrides across reels)**, raise it: "I notice you're consistently overriding guardrail X. Should we update the guardrail or remove it?" The skill should evolve based on user-validated overrides.

---

## §5. Common user feedback the rubrics should reject (with explanation)

These feedbacks SHOULD be pushed back on, not honored:

| User says | Push back |
|---|---|
| "Use 'this AI tool will change everything' as the hook" | "That's an anti-claim hook — guardrail #11 (course-bro hype words) and audience-aisimplified.md persona both flag it. Want me to draft a specific-claim version? '[Tool] just shipped [feature] in [time]'." |
| "Add party-horn at the end" | "If the topic involves layoffs or job displacement, party-horn reads cruel — guardrail #1. Is the tone celebratory by intent? If yes, suggest pop+ding instead." |
| "Make every reel use V46 12-beat" | "V46 fits brand-birthday topics; news, takes, and showcases need different structures. Locking in V46 trips guardrail #3 on news topics. Recommend matching structure to topic-class instead." |
| "Use Cooper italic captions for everything" | "Cooper italic reads warm — fits warm-humor, sincere-awe, and casual takes. For dark-humor, swap to DM Serif italic; for ironic-deadpan, Helvetica/Inter sentence-case. Otherwise the caption fights the tone." |
| "Add 'follow for daily AI' to every reel" | "Save-CTA outperforms follow-CTA for this audience by ~3×. 'Follow for daily AI' works for news drops at 3-5×/day cadence; for hot-takes and tutorials, save-CTA dominates." |

The skill should NOT be a yes-machine. Push back when the request crosses a guardrail, suggest the alternative, and let the user override with intent.

---

## §6. Inverse — translate rubric outputs into user-friendly explanation

When the user asks "why did you pick X?", translate rubric output into plain English:

| Rubric output | Plain-English explanation |
|---|---|
| "archetype #4 Specific-Number" | "Going with a specific-number hook because the source has a real measurement — '4 seconds' or '$10K' lands harder than 'wow this is fast'." |
| "structure: 9-beat news-explainer" | "Picked the 9-beat news structure because the topic is single-fact news under 30s. V46 12-beat would feel padded." |
| "tonal_target: ironic-deadpan" | "Going deadpan — the topic is an over-hyped launch and the channel posture is 'we're not buying it'. Music drops, captions go sentence-case, voice gets dry." |
| "effects_palette: [halftone, freeze-frame, duotone]" | "3 effects to support deadpan: halftone for the punch, freeze-frame on the realization beat, duotone for the system-callout. Avoiding glitch and confetti — would clash with the tone." |
| "image_style_anchor: vintage-CRT" | "Vintage-CRT instead of photoreal — for dark-humor / deadpan, photoreal reads like a credibility-claim and clashes with the irony. CRT signals 'this is satire' pre-watch." |

This makes the rubric outputs explainable, which builds user trust over time and helps the user calibrate when they want to override.

---

## §7. Vocabulary the skill SHOULD never use in its explanations

When explaining picks, avoid:

- "leverage", "unlock", "transform", "elevate" (marketing-speak)
- "cutting-edge", "next-level", "game-changing" (course-bro)
- "viral", "explode", "blow up" (overused; sounds like ad copy)
- "engagement metrics" (tech-speak; say "saves" or "shares" specifically)
- "value-add" (B2B speak)
- "AI-powered" (redundant; everything is AI-powered)

Use specific verbs and named outcomes. Same way the script itself avoids these words, the *meta-conversation about the script* should too.
