# Topic classifier — from raw source to rubric inputs

The Phase 0 intake (in SKILL.md) requires `topic_class`, `emotional_thesis`, `share_trigger`, `stakes`, `hype_charge`, `frame_zero_promise`. **This file is how you derive those values from a tweet URL, article, or vague topic prompt.** Without this, garbage in → garbage out → mechanical rubric outputs.

R1-R7 in `decision-rubrics.md` assume the intake fields are accurate. If you cannot answer the questions in this file with concrete claims, the topic is too thin — escalate to user before drafting.

---

## §1. Classifying `topic_class`

12 valid values. Read the source material (tweet body + any thread, article, announcement) and pick exactly one. Multi-class topics: pick the dominant frame; flag the secondary in `editorial-brief.md` notes.

| Class | Match if source material is… | Quick disambiguation |
|---|---|---|
| `model-launch` | A new AI model just shipped (GPT-X, Claude X, Sora N, Veo N, Gemini N, Nano Banana, etc.) — usually has a launch tweet from official account | distinguish from `feature-drop` by: is this a new MODEL, or a new FEATURE on an existing model? |
| `feature-drop` | An existing tool added a feature (ChatGPT got Memory; Claude got Code; Cursor got an agent panel) | usually announced as "now in X you can…" |
| `benchmark-news` | A model just topped a benchmark / a new benchmark just landed (MMLU, AIME, ARC-AGI, SWE-bench) | always has a number; usually has a chart |
| `research-paper` | An ML paper, technique, or finding just dropped (often arXiv) | distinguish from launch: paper describes a method, not a shipped tool |
| `acquisition` | Company buys / merges with / takes-stake-in another (Anthropic round, OpenAI deal, regulator-blocked merger) | dollar amounts; named principals |
| `drama/discourse` | An argument / debate / controversy on AI X (the doomer-accelerationist split, a creator beef, a model misbehaving) | usually quote-tweets stacking; multi-side opinions |
| `culture-meme` | An AI meme, joke pattern, viral prompt, in-community shibboleth (the "AGI is here" graph, the "vibes" debate) | low stakes; high in-group recognition |
| `tutorial-howto` | "How to do X with Y" — recipe content. The source might be your own discovery or a creator's workflow | always has a clear how-to step list |
| `hot-take-opinion` | An argument with a stance ("AI didn't kill design — it killed bad design") | distinct from drama: drama has multiple sides; take has YOUR side |
| `death/layoff/wind-down` | A company is shutting down, doing layoffs, founder departure, AI-affected job announcement | grave register; named individuals/companies |
| `safety-incident` | An AI system did something dangerous / problematic (jailbreak, misuse incident, data leak) | cautious register; usually a regulator or safety researcher in the source |
| `regulation-policy` | EU AI Act news, executive order, FTC ruling, court case, industry standards body | formal register; named policy or precedent |

**Disambiguation prompts** (use these if torn between two classes):
- Is the news *about a tool shipping*, or *about a tool being used to do something*? → first = launch/feature; second = take/tutorial/culture-meme depending.
- Is there a number that's the payoff? → benchmark-news or specific-number archetype within another class.
- Is there a named victim? → death/layoff/safety-incident even if other class fits topically.
- Is the story about a debate/argument? → drama/discourse, NOT hot-take (your reel adds a take to the drama).

---

## §2. Writing `emotional_thesis` (one sentence ≤12 words)

The hardest field. **What feeling does the viewer leave with?** Not what the topic is about. The feeling.

Litmus: would a viewer rewatch the reel solely to feel that feeling again?

Examples that land:

| Topic | emotional_thesis |
|---|---|
| Sora 2 dropped with cameos | "amazement that this is now possible" |
| Anthropic acquisition rumor | "uneasy curiosity about what changes" |
| Adobe shipped an AI design tool | "uneasy laughter at how fast jobs are folding" |
| Justine's "AI influencers fooling dudes" reel | "quiet recognition that the feed is changing" |
| Replit 10-year anniversary free deal | "nostalgia + urgency to grab it before Friday" |
| Min Choi's Nano Banana photoreal demo | "Turing-test-violation pre-share-impulse" |
| Hot-take: GPT-5 didn't kill prompt engineering | "validation for the audience already arguing this side" |
| 9am news drop on regulation | "alert orientation — what just changed for me" |

Examples that don't land (too abstract / too topic-restating):

- "AI is changing things" ❌ (vague — what feeling?)
- "Excitement about Sora 2" ❌ (just restates "people are excited")
- "Curiosity about AI" ❌ (no specificity)
- "It's interesting" ❌ (zero information)

If the only emotional_thesis you can write is one of the above failure forms, **the topic is too thin**. Phase 0 hard gate triggers — escalate to user before drafting.

---

## §3. Writing `share_trigger` (the share-impulse type)

Why would a viewer share this? Pick one:

| Trigger | Meaning | Topic shape |
|---|---|---|
| `ick` | "look how dystopic this is" | tool-replaces-job; deepfake fooling people; dark humor topics |
| `unease` | "I don't know what to think but I want others to weigh in" | acquisitions, regulation, frontier-model jumps |
| `awe` | "look at this magic" | sincere-awe topics; restoration; cinematic AI demos |
| `utility` | "you'll need this later" | tutorials, recipes, tool announcements with concrete use |
| `inside-joke` | "only people in our scene get this" | culture-memes, shibboleths, community-specific jokes |
| `argument-bait` | "I want to argue about this" | drama/discourse, hot-takes, contrarian framings |

If you cannot pick exactly one share_trigger that fits, the topic is unfocused. Pick the dominant one and say what was secondary.

**Important:** share_trigger drives CTA selection. `utility` → save-CTA dominates. `awe` → save or DM-send. `argument-bait` → "comment your take". `ick` → DM-send-to-friend ("send this to the friend who…"). `inside-joke` → no CTA needed; the join-the-club is the share.

---

## §4. Reading `stakes` from the source

| Source signals | stakes |
|---|---|
| Money ≤$1M, no named individuals at risk, no policy implication | `low` |
| Money $1M-$1B, or some affected category but no named individuals | `medium` |
| Money $1B+, OR named company doing layoffs, OR ruling that affects an industry | `high` |
| Death, founder departure under bad terms, named-victim layoffs, safety incident with harm, regulatory penalty with criminal exposure | `grave` |

Stakes drives motion-verb tier (R7) and effects palette (R4) restrictions. `grave` triggers the entire celebratory-bank ban.

---

## §5. Reading `hype_charge` from the source AND the channel's posture

`hype_charge` is **the channel's posture**, not the topic's. Even on a hyped topic, channel can take a sceptical posture. Pick on a -2 to +2 scale:

| hype_charge | channel posture | when to pick |
|---|---|---|
| -2 sceptical | "we're not buying it" | over-hyped launch + channel has heard 5 of these / drama where viewer holds the contrarian frame |
| -1 dry | "let's calmly look at this" | drama/discourse / regulation / safety-incident — channel doesn't moralize |
| 0 neutral | "here's what happened" | benchmark-news / acquisition — straight reporting register |
| +1 warm | "this is interesting/cool" | feature-drop / tutorial / culture-meme — channel finds it genuinely useful or fun |
| +2 awe | "this is genuinely impressive" | frontier-model launch with real visual delta / restoration / single-uncut-clip drops |

`hype_charge` drives R3 (TONE selector). The mapping:
- +2 awe → likely sincere-awe palette
- +1 warm → likely warm-humor palette
- 0 neutral → urgent-breaking (if news) or quiet-observation (if cultural)
- -1 dry → ironic-deadpan
- -2 sceptical → ironic-deadpan or dark-humor

---

## §6. Writing `frame_zero_promise` (6-word sentence)

What does the cover (frame 0) visually deliver?

This is mandatory — frame-0 hook caption is required by retention-template.md and is critique auto-fail #1 if absent. Choosing this *now* in Phase 0 forces the entire reel to deliver it.

Format: 6 words max. Each word should pull weight.

Examples:

| Topic | frame_zero_promise |
|---|---|
| Sora 2 launch | "100% AI. None of these are real." |
| Anthropic acquisition rumor | "Anthropic just got a $10B offer." |
| Adobe AI design tool | "Adobe replaced graphic designers in 12 seconds." |
| Replit 10-year free | "Replit is free for 24 hours." |
| Restoration demo | "1936 photo. AI just colored it." |
| Hot-take on prompt engineering | "Prompt engineering didn't die. It got sharper." |

Bad examples (vague or topic-restating, not promise-delivering):

- "Sora 2 dropped" ❌ (no promise)
- "AI tool launch" ❌ (no specifics)
- "Today on the channel" ❌ (anti-opener; not a promise)
- "Look at this" ❌ (zero content)

The promise becomes the script's first line, the cover image's caption text, and the test for whether the rest of the reel earns its hook.

---

## §7. Reading source material — extraction workflow

When the user drops a tweet URL or article:

1. **Pull the source text + media.** For tweets: `cdn.syndication.twimg.com/tweet-result?id={ID}`. For articles: trafilatura or page screenshot.
2. **Read carefully.** Source body, replies if accessible, any chart/screenshot.
3. **Identify the protagonist.** Who/what is the topic about?
4. **Identify the action.** What happened / is happening / about to happen?
5. **Identify the consequence.** Who does this affect, and how?
6. **Run §1-§6 in order** — fill all 6 fields.
7. **Pause and ask: would I want to watch this reel?** If the answer is "only if it's well-edited" — the topic is too thin, escalate. If "yes, even if it's mediocre" — topic is strong, proceed.

---

## §8. Common classification mistakes

These are mistakes the original skill has no rule for. Each leads to wrong rubric outputs downstream.

| Mistake | Symptom | Fix |
|---|---|---|
| Classifying a hot-take as a launch | Skill picks Product Showcase archetype, hook reads "this changes everything" instead of taking a stance | Reread source: is this announcing a tool, or arguing a position? |
| Classifying drama as hot-take | Skill picks contrarian archetype, comes off as taking sides on something the channel should observe | Drama has multiple legit sides; if you're not naming all sides, you're picking sides — it's a take |
| Missing the grave-stakes signal | Skill picks celebratory palette, reads cruel/insensitive | Always check: is anyone *named* as harmed? If yes, escalate stakes to grave even if other class fits |
| emotional_thesis is too abstract | "amazement at AI" — no specificity, rubrics produce generic outputs | Push: amazement at WHAT? "amazement that this exact thing is now possible" |
| share_trigger picked because it sounds cool, not because it's true | Reel built around 'inside-joke' but viewer outside the niche won't get it | Test: would my mom share this? If yes, it's not inside-joke. Pick by who the share-target is. |
| frame_zero_promise restates the topic | "Today's news about Sora 2" — vague, no promise | Promise IS specific outcome the viewer will witness. Use a verb + concrete delta. |
| hype_charge defaulted to +1 | Every reel feels mid-hype, channel never takes a posture | Force a charge between -2 and +2 each time. If you can't decide, the topic is unfocused. |

---

## §9. Output: populated intake fields

After running this classifier, the Phase 0 intake YAML should have all 12 fields filled. Example:

```yaml
topic_class: model-launch
emotional_thesis: "amazement that this is now possible"
audience_persona_lean: mixed-default
reel_intent: launch
pacing_target: "40-55s sweet-spot"
stakes: medium
hype_charge: +2
taboo_zones: ["course-bro CTA", "Hormozi yellow", "vine boom"]
novelty_budget:
  archetypes_used_last_5: [#1, #1, #4, #7, #1]
  effects_used_last_3: [parallax, glitch, parallax]
  tones_used_last_5: [sincere-awe, ironic-deadpan, sincere-awe, warm-humor, sincere-awe]
tonal_target_primary: sincere-awe
tonal_target_secondary: dark-humor at close (the "you have 90 days" undercut)
share_trigger: awe
frame_zero_promise: "100% AI. None of these are real."
```

Now R1-R7 in `decision-rubrics.md` can produce concrete outputs grounded in actual editorial judgment, not defaults.

---

## §10. When to escalate vs. proceed

The Phase 0 hard gate (in SKILL.md): if `emotional_thesis` AND `share_trigger` cannot both be written without hand-waving, escalate. Do not draft.

Other escalation cases (write to user, do not auto-default):
- `topic_class = launch` but `emotional_thesis = melancholy` → these don't combine; ask for refinement.
- `stakes = grave` but user requested `tonal_target = warm-humor` → guardrail clash; confirm intent.
- `audience_persona_lean = AI-curious-IN` but topic is US-anchored → confirm whether to ship in English-only or pivot to mixed-default.
- `frame_zero_promise` re-uses the previous reel's promise pattern verbatim → mechanical default; user confirms whether they want repetition for series-tagging or fresh framing.

In all escalation cases: ask the user, do NOT pick silently.
