# Sora 2 (OpenAI) — text-to-video templates

Alternative to Veo 3.1 / Kling 3.0 for cinematic single-clip drops. Best when topic is "the visual delta IS the argument" (FF.13 Higgsfield register).

---

## Pricing

- $0.10/sec 720p (4/8/12s)
- $0.30-0.50/sec Pro at 1024p (10/15/25s)
- Native synced audio in both
- Vertical 9:16 supported

---

## Prompt structure ("Shot List", 80-150 words)

```
[Camera framing] + [Subject + setting] + [Beat 1: action] + [Beat 2: shift] + [Beat 3: payoff] + [Look/color note] + [Audio: dialogue / SFX / music or "no music"]
```

---

## Audio cue ALWAYS

`No background music. Realistic natural sound.` — otherwise Sora invents a cinematic score that fights your reel's planned music bed.

---

## Workflow tip (cost)

Generate drafts at 480p (10× cheaper) to nail the prompt, then re-run final at 1024p. Cuts iteration cost 60-80%.

---

## Canonical example (8-second cinematic launch hook)

```
9:16 vertical, 8 seconds. Wide shot of empty desert at golden hour, single white sneaker resting on cracked salt flat. Beat 1: gentle wind raises faint dust around shoe. Beat 2: shoe lifts off the ground in slow-motion arc, motion blur trailing. Beat 3: lands on cinematic dune crest, dust ring expands outward, anamorphic lens flare across frame. Cinematic teal-orange grade, Kodak Vision3 500T grain, halation bloom. No background music. Realistic natural sound: wind, single low impact thud on landing, fabric whoosh.
```

---

## When to use Sora vs Veo vs Kling

| Reel format | Recommended |
|---|---|
| 8-second hyper-cinematic single-clip "wow" (FF.13 Higgsfield-style) | Sora 2 Pro |
| News-drop with avatar + 4 demo clips | Veo 3.1 (synced audio) or Veo 2 (cheaper batch) |
| Cultural-noticing or quiet-observation reel | Kling 3.0 (subject preservation matters more than synced audio) |
| 5-second B-roll batch | Kling 3.0 (cheapest credible) |
