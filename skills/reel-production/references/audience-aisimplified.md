# Audience model — @aisimplified

The persona the rubrics consult. Drives caption stack, CTA verb, Hinglish density, SFX register, hook archetype availability. Mixed IN+US, AI-curious + AI-builder.

This file is **always loaded** at Phase 0 intake. The output is `audience_persona_lean ∈ {AI-curious-IN, AI-curious-US, AI-builder-IN, AI-builder-US, mixed-default}`. Default is `mixed-default` unless topic is explicitly India- or US-anchored.

---

## Persona block (the canonical reference)

- **AI-curious + AI-builder mix.** Assume both watch every reel. Litmus: "would a smart non-engineer understand this in one listen, while an AI-builder doesn't skim past as obvious?" If neither holds, the script is wrong for this audience.

- **Mixed Indian + US English speakers.** Neutral English by default. Hinglish only when topic is India-anchored (UPI, India-launch, IN tool, Indian creator). Default font stack: Cooper Hewitt italic + Inter (premium register). Mukta only when Hinglish density >30%.

- **Attention-thin.** First 1.5s is everything (retention-template.md §B). Frame-0 hook caption mandatory. No fade-ins on hook text.

- **Sceptical of hype.** Specific numbers in hook outperform vague claims. "4 seconds", "100M users", "$0 vs $200/mo" by ~2× the views of "this changes everything." **Never write "incredible / mind-blowing / game-changing / next-level / insane (when used as actual claim, not ironic)"** — channel gives off course-bro vibes.

- **Allergic to course-bro energy.** Taboos:
  - Shouts / caps-yelling on voice
  - Hormozi yellow-pill captions on premium-tone reels (sincere-awe / ironic-deadpan / dark-humor)
  - "Comment 'AI' for the link" without payoff
  - Follow-ask CTAs ("follow for daily AI" works ONLY on news-drop format, not on takes)
  - Hyperbolic verbs ("will COMPLETELY change", "will DESTROY", "BLEW MY MIND")
  - Orchestral hits on every quote
  - "Wait for it…" hook (peaked 2024, declining hard per GG.3)

- **Comment-CTA preference is regional.**
  - **AI-curious-IN audiences convert on "comment KEYWORD" funnels** — specific keyword, low friction, clear payoff ("Drop REPLIT for the link").
  - **AI-curious-US + AI-builder-US audiences convert on DM-send / save** — IG #1 signal, pairs with parasocial-light register.
  - For `mixed-default`, lead with save-CTA and add a soft keyword fallback: *"Save this; if you want the link, drop a word in the comments."* This double-stacks gently without violating the compounding-penalty list.

- **Saves > follows.** Channel growth is via algorithmic surface, not parasocial. Always favour save-CTA verbs ("save this for the next time someone says AI peaked") over follow-CTA. Save-rate is IG signal #3; follow-rate is not in the top 6.

- **Sound-off default (~85% mobile views muted).** Burned-in captions mandatory. SFX is enhancement, never load-bearing. If the reel makes no sense without sound, it's a partial reel.

- **Frontier-tool literacy.** Naming the tool in the hook (Sora 2, Claude Code, Veo 3.1, Nano Banana Pro, Flux Kontext, Higgsfield, MCP) is the SEO + cohort-routing move (§GG L1966). Audience is fluent in tool names; do not gate behind generic "this AI tool" language.

- **Cynicism ceiling — one layer per reel.** Dark humor and ironic deadpan land beautifully. Snark-on-snark (two cynical layers in one reel) becomes mean. Pick one register; use the rest of the reel to support it.

---

## How this persona shapes each rubric

### R1. HOOK
- Specific-number archetypes (#4) consistently outperform vague-promise archetypes (#5 "Stop scrolling…") for this audience.
- Tool name in the hook is mandatory for launch/news topics.
- Authority + Curiosity Gap (#2) lands when claim is technical and creator can defend it.
- Imperative (#5 "Stop scrolling if you make videos with AI") — works only when paired with genuinely contrarian frame; otherwise reads low-effort.

### R2. STRUCTURE
- 9-beat news-explainer fits when news-drop is the format.
- Mid-week recipe-creator content fits V47.
- "Look at these 10 examples" carousel fits V47 — V46 12-beat would feel oddly birthday-shaped.
- 6-beat micro for once-a-month quiet-observation reels.

### R3. TONE
- Ironic-deadpan available because audience is sceptical-of-hype enough to register the deadpan.
- Sincere-awe must be earned — incremental updates trigger fanboy-aura.
- Dark humor available *only* when no identifiable victim. AI-builder lean tolerates more dark register than AI-curious lean.
- Quiet-observation is once-a-month max — the rarity is the format.

### R6. IMAGE STYLE
- Photoreal default for launch and news-drop topics.
- Cooper-italic captions read warm. Cooper-italic on a sincere-awe reel is fine; on dark-humor reel it's wrong (use DM Serif italic).
- AA.16 wire-photo template lands for AI-builder cohort (they enjoy the 600ms photo-trust trick); AA.17 explainer template lands for AI-curious cohort (they want claims made legible in 1.2s).

### R5/R7. SFX/MOTION
- Whoosh + impact + sub on every cut = lazy 2021 TikTok. Avoid.
- Ticker-tone bed for urgent-breaking is the right register.
- Veo 2 strong motion verbs (slam/shatter) read course-bro for sincere topics; reserve for urgent-breaking.

---

## Hinglish density rules (when applicable)

`audience_persona_lean = AI-curious-IN` or `AI-builder-IN` triggers a Hinglish density check:

```
0%        → topic is global (model launch, US-creator news, frontier capability) → English-only
1-29%     → topic mentions India tangentially; default to English with 1-2 Hindi punch words for emphasis → English-leaning Hinglish
30-60%    → topic is India-anchored (UPI launch, India-creator, IN tool) → balanced Hinglish, switch to Mukta caption stack
61-100%   → topic is hyper-local (rare for @aisimplified) → escalate to user; don't auto-default
```

**Hinglish punch-word patterns that work** (W.15):
- Code-mix density: ~60% Hindi / 40% English by syllable count.
- English for technical/business terms ("model", "API", "pipeline", "agent").
- Hindi for emotional emphasis (excitement, surprise, "yeh dekho", "samjho").
- Bollywood "Interval Twist" at second 2 — premise flip exactly at t=2s (W.18).

**Hinglish-specific anti-patterns**:
- Translating tool names ("Bina-Banana Pro" instead of "Nano Banana Pro") — kills SEO.
- Hyper-formal Hindi (Sanskritized vocabulary) — reads off-channel; this audience speaks casual Hinglish.
- Writing English script and asking voice talent to "do it Indian" — reads as mockery; full Hinglish or full English.

---

## Regional Audience taboos (auto-fail in critique if violated)

For `audience_persona_lean ∈ {AI-curious-IN, AI-builder-IN}`:
- Do NOT use Hormozi yellow-pill captions on sincere-awe or ironic-deadpan reels — reads course-bro. Use Cooper italic or Mukta instead.
- Do NOT use the "World Stop!" trend audio twice in 30 days — IN audiences clock the format quickly.
- Do NOT skip burned-in captions — 85%+ muted on Indian mobile.
- Do NOT use "follow for daily AI" CTA without prior save-CTA history — IN audiences convert on keyword-comment funnels first; follow comes later.

For `audience_persona_lean ∈ {AI-curious-US, AI-builder-US}`:
- Do NOT use heavy Hinglish without India-anchored topic — reads as code-switching for performance, not authenticity.
- Do NOT use Mukta caption stack — reads off-channel.
- Do NOT use "comment KEYWORD" funnel as the *only* CTA — US audiences prefer save/share; layer save first.

For `audience_persona_lean = mixed-default`:
- Lead with save-CTA, add soft keyword fallback.
- Cooper italic + Inter caption stack default (works for both regions).
- English-only script; Hinglish only when topic justifies.
- Tool name in hook (frontier-tool literacy is shared across both lanes).

---

## What distinguishes @aisimplified from generic AI creators

The channel's edge is *editorial taste* — selectively which AI news matters, which models actually deliver, which hype to puncture. The audience reads:
- Sceptical (not anti-AI; pro-quality).
- Frontier-literate (knows tool names, knows what's incremental vs frontier).
- Allergic to course-bro hype (will scroll past "this will change EVERYTHING").
- Save-oriented (uses reels as reference; shares to friends; doesn't follow purely for parasocial reasons).

Reels for this audience must:
1. Have a *specific* claim (number, tool name, demo) — not "AI got smarter."
2. Be honest about the visual delta — sincere-awe must be earned; dark humor must avoid victims.
3. Respect attention — 30-50s sweet spot, not 75s slogs.
4. Default to save-CTA (utility > parasocial).
5. Avoid the declining patterns (GG.3): "wait for it…", "this AI tool will change your life", every-cut whoosh, animated emoji captions.

---

## Cross-references

- `references/hook-archetypes.md` — anti-openers list reflects this audience.
- `references/critique-rubrics.md` — guardrails #9 (course-bro CTA), #10 (Hormozi yellow on premium tones), #11 (course-bro hype words), #12 (Indian sound-off captions) are audience-derived.
- `references/tonal-palettes.md` — caption stack rules explicitly mention "AI-curious-IN with sincere-awe" mismatch.
- `references/creator-tricks.md` — W.14, W.15, W.16, W.18 are India-specific; W.13 is US-leaning.
- `references/retention-template.md` — sound-off audit, save-CTA preference, frame-0 rule are all derived from this audience model.

If the audience model changes (channel pivots, audience shifts), update this file FIRST — every rubric reads from here.
