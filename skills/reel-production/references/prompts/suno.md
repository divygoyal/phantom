# Suno V5.5 / Udio — AI music

Used when a music bed is required (sincere-awe, urgent-breaking, warm-humor with track). NOT used in dark-humor / ironic-deadpan / quiet-observation reels (those use room-tone bed only).

---

## Pricing

Suno V5.5 ($10/mo Pro = 500 gens, commercial rights) — $0.02-$0.06/track effective.

---

## Canonical metatag system

```
STYLE: [Genre], [Tempo BPM], [Key instruments], [Production], [Mood]

LYRICS:
[Intro: ambient pads, reverb-heavy]
[Build: rising energy, layered synths]
[Drop: maximum instrumentation, four-on-the-floor]
[Outro: fade out]
```

For instrumental reel beds, mark `[Instrumental]` and `no vocals` in style block.

---

## Patterns by use case

### Ambient pad (sincere-awe / quiet contemplative)
```
Ambient electronic, 65 BPM, evolving synth pads, granular textures, reverb-drenched, Brian Eno inspired, no vocals, no risers
```

### Riser/build (any palette where rising energy is needed)
```
[Build]
[Pre-Chorus: building energy, adding layers]
[Crescendo]

Progressive intensity, rising white noise sweep, kick build
```

### Energetic build (urgent-breaking / launch)
```
EDM, 128 BPM, big-room, build-drop structure, festival energy
[Build]
[Drop]
```

### Lo-fi (warm-humor casual / tutorial bed at low volume)
```
Lo-fi hip-hop, 75 BPM, jazzy Rhodes, vinyl crackle, tape hiss, mellow drums, no vocals, study music
```

### Cinematic (sincere-awe / urgent-breaking premium)
```
Cinematic orchestral, sweeping strings, French horns, timpani, Hans Zimmer inspired, epic and triumphant
```

---

## Mixing with VO (sidechain ducking)

When a Suno track sits under VO, follow LUFS targets in effects-and-sfx.md §N:
- Music bed under voice: -30 to -35 dB LUFS
- High-pass everything else below 80-100Hz so sub owns that band cleanly

ffmpeg duck pattern (offline):
```bash
ffmpeg -i voice.wav -i music.wav -filter_complex \
  "[1:a]volume=0.3[bg];[0:a][bg]amix=inputs=2:duration=first" out.wav
```

Or in Remotion via voice-segment-aware volume callbacks (render-cookbook.md §T).
