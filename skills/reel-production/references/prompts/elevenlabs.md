# ElevenLabs v3 — voice tags + settings

Loaded by R3 (TONE selector) when drafting voiceover script with embedded delivery tags. Tag inventory verified May 2026.

---

## Tag inventory

| Category | Tags |
|---|---|
| Emotion | `[happy] [excited] [sad] [angry] [nervous] [curious] [serious] [matter-of-fact] [mischievously] [amused] [bored] [confused]` |
| Delivery | `[whispers] [whispering] [shouts] [shouting] [softly] [speaking softly] [rushed] [slow] [drawn out]` |
| Non-verbal | `[laughs] [laughing] [chuckles] [smirks] [sighs] [gasps] [crying] [clears throat] [gulps] [breathes] [exhales] [snorts]` |
| Pacing | `[pause] [long pause] [short pause]` |
| SFX | `[clapping] [explosion] [gunshot] [door creaks] [bird chirping] [phone rings]` |
| Accent | `[British accent] [strong Russian accent] [French accent] [Southern US accent]` |

---

## Layering rule (verified)

- **Max 2 tags per line.** `[nervously][whispers]` works. `[nervously][whispers][rushed]` confuses the model.
- Tags persist until new tag overrides.
- Case-insensitive.

Critique auto-fail #4 enforces tag conflicts: `[serious][amused]`, `[deadpan][shouts]`, `[whispers][enthusiastic]`, `[urgent][casual]` all break.

---

## Settings for "natural" YouTube Shorts VO

- **Stability**: 40-50 (lower = more emotional swing; 50 is sweet spot for hooks)
- **Similarity**: 75-80 (higher introduces artifacts)
- **Style**: 0 for natural, 30-50 to amplify tags on punchy lines
- **Speaker boost**: ON

---

## Tag → tone palette mapping (R3)

When R3 selects a tonal palette, use the corresponding tag pair. (See tonal-palettes.md for the full recipe table.)

| Palette | EL voice tags |
|---|---|
| dark-humor | `[dry][smirks]` + `[long pause]` before punch |
| warm-humor | `[playful][amused]` |
| ironic-deadpan | `[deadpan][matter-of-fact]` + 0.8s pause before punch |
| sincere-awe | `[impressed][whispers]` |
| urgent-breaking | `[urgent][serious]` |
| quiet-observation | `[casual][matter-of-fact]` |

When R3 picks a palette, the tag pair is determined. Don't deviate without logging in `editorial-brief.md`.

---

## `[long pause]` for comedic timing

Insert before punchline. ~0.8-1.2s vs `[pause]` ~0.4s.

---

## Hook line examples (per tone)

**Sincere-awe + whispers**:
```
[whispers] You're not gonna believe this. [pause] [excited] OpenAI just dropped a model... [matter-of-fact] that completely changes everything.
```

**Dark-humor + dry**:
```
[laughs] So, you thought Veo 3 was good? [long pause] [serious] Wait until you see what's coming next.
```

**Ironic-deadpan**:
```
[deadpan] OpenAI just dropped this. [long pause] [matter-of-fact] It does what every other AI tool already did. [pause] Better.
```

**Urgent-breaking**:
```
[urgent] Anthropic just got a $10 billion offer. [serious] The deal closes Friday. [matter-of-fact] Here's what changes for you.
```

---

## Beat-type quick reference (when R3 hasn't fully resolved)

| Beat | Best tags (if no palette set) |
|---|---|
| Hook (0-3s) | `[curious]`, `[excited]`, `[whispers]`, `[urgent]` |
| Authority claim | `[matter-of-fact]`, `[serious]` |
| Build / setup | `[curious]`, `[playful]`, `[casual]` |
| Reveal / payoff | `[impressed]`, `[amused]`, `[grinning]` |
| Punchline | `[deadpan]`, `[dry]`, `[chuckles]`, `[smirks]` + `[long pause]` before |
| CTA | `[enthusiastic]`, `[warm]` — NEVER `[shouts]` |

Comedic timing rule: pregnant pause 0.5-1.2s before punchline. Rule of three: establish → reinforce → subvert. Callback as closer = re-watch + craft signal.
