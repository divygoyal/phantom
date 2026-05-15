# Effects & SFX — catalogs, matrices, anti-patterns

R4 (effects palette) and R5 (SFX) in `decision-rubrics.md` route here. This is the reference catalog; the *selection logic* lives in the rubrics.

**Determinism rule** (always): never `Math.random()`; always `random('seed-' + index)`. **CSS animations FORBIDDEN** — drive everything from `useCurrentFrame() + interpolate()` or `spring()`.

---

## §J. Motion-graphics palette — 50+ effects

Each effect has a one-line Remotion-friendly implementation hint.

### J.1 Camera / perspective tricks
- **Dolly Zoom (vertigo)**: subject `scale(1)` constant, BG `scale(1+frame*0.005)` while parent `perspective` shrinks. Use `interpolate` keyframes; `transform-origin: 50% 60%` for face-centered.
- **Orbit cam (CSS-only)**: parent `perspective: 1200px` + `transform-style: preserve-3d`, animate `rotateY(0→360)` on inner; children at varying `translateZ`. No three.js needed.
- **2.5D parallax (After-Effects camera move)**: split into 3-5 layers, each `translateZ(-200/-100/0)`, animate parent `translateX`. Speed inverse to depth.
- **Push-in (cinematic)**: spring with `damping:200, stiffness:100`, `transform-origin: 50% 60%`.
- **Cinematic crane**: parent `perspective`, animate `translateY` + `rotateX`.
- **Fake bokeh**: layered absolutely-positioned circles with `radial-gradient(white, transparent)`, varying opacity/blur, sine-wave Y motion, `mix-blend-mode: lighten`.
- **Ken Burns + parallax-pop**: stack 3 absolute divs as PNG layers, animate each `translate3d` independently.

### J.2 Type-driven motion
- **Word-by-word reveal**: `<span>` per word, `interpolate(frame - i*3, [0,8], [40,0])` for translateY + opacity. 3-frame stagger reads punchy.
- **Letter scramble cypher → resolve**: per-char resolveTime = `i * 2`. While `frame < resolveTime` show `randomChar()` seeded by `random(`${frame}-${i}`)`. Pool: `!<>-_\\/[]{}=+*^?#`.
- **Glitch RGB shift**: 3 stacked text copies in red/green/blue with `mix-blend-mode: screen`. Animate `clip-path: inset()` with `steps()` + per-channel `translateX(±2px)`.
- **Mask-from-stroke (handwriting reveal)**: SVG `<path>` with `stroke-dasharray = pathLength`, animate `stroke-dashoffset` from `pathLength` to 0.
- **Type-on-path**: SVG `<textPath href="#curve">`, animate `startOffset` from `100%` to `0%`.
- **Splittext line-mask reveal**: each line in `overflow:hidden` div, child translates from `100%` to `0%`. **Most "expensive looking" type move per dollar.**
- **MoGraph random offset**: per-letter `random(seed-${i})*amount` applied to position/rotation/scale before reveal.
- **Delay effector elastic settle**: spring `mass:1, damping:12, stiffness:220`, stagger `i*1.5` frames.
- **Typewriter with cursor**: `text.substring(0, Math.floor(frame/2))` + blinking `|` every 15 frames `frame % 30 < 15`.
- **Paper-cut layered reveal**: 3-4 overlapping color text layers, each translated 2-4px with `box-shadow: 0 4px 0 darker` for thickness.

### J.3 Image-based effects
- **Duotone flash**: SVG `feColorMatrix` desat + `feComponentTransfer` mapping R/G/B to gradient. Pulse during beat-drop.
- **Halftone Ben-Day dots**: `radial-gradient(black 1px, transparent 2px)` repeated 4px sized, masked over image.
- **Comic-book pop-art**: 3-step posterize via `feComponentTransfer tableValues="0 0.5 1"` + thick black outline via stacked `drop-shadow`.
- **Magazine cutout collage**: random `rotate(-7deg)` per image, `box-shadow: 4px 4px 0 rgba(0,0,0,0.3)`, jagged edge via `feTurbulence + feDisplacementMap`.
- **Ransom-note style**: each char wrapped, random font from `[Impact, Comic Sans, Times, Helvetica Black, Marker]`, random rotate/bg-color. Use `random()` for determinism.
- **Vintage VHS**: chromatic aberration text-shadow + horizontal scanlines `repeating-linear-gradient` + noise overlay (feTurbulence) + periodic 1-frame Y-shift glitch every 24 frames.
- **Polaroid drop**: spring `translateY(-200→0)` + `rotate(-15→8)` + landing `scale(1.1→1)` bounce. 2-frame `rotateZ` shake on land.
- **Photocopy streak**: `feTurbulence` + `feDisplacementMap` with `scale` animated 30→0 (settles from chaos to clarity).

### J.4 Reveal mechanics
- **Clip-path circle iris**: `circle(0% at 50% 50%) → circle(150%)` over 30 frames.
- **Polygon shutter wipe**: `clip-path: polygon(0 0, 0 0, 0 100%, 0 100%)` to full polygon (same point-count between keyframes).
- **Grid-tile cascade**: 8×14 grid, each tile `rotateY(180→0)` at `delay = (x+y)*1.5`. `transform-style: preserve-3d`.
- **Liquid blob morph**: animate `border-radius: 64% 36% 27% 73% / 55% 58% 42% 45%` keyframes; OR GSAP `MorphSVGPlugin` between same-point-count `<path>` tags.
- **Crumple/uncrumple**: stack of 4 sub-divs each `rotateX(180→0)` with `transform-origin` alternating top/bottom.
- **Page-turn**: `transform-style: preserve-3d`, `rotateY(0→-180)` on child with `transform-origin: left center`.
- **Polaroid-shake-develop**: start `filter: contrast(0) brightness(1.5) saturate(0)` → end `(1, 1, 1)` with overlaid shake `translate3d(rand,rand,0)` for 24 frames.

### J.5 Particle systems (deterministic, seeded)
- **Confetti**: `vx = random*4-2, vy = random*2`, gravity 0.15/frame, rotate per-frame. Color from palette.
- **Money rain**: same as confetti but rectangular bills with `rotateY(frame*8deg)` for flap.
- **Snow**: `vy = 0.5 + random*0.3`, sine-wave `x += sin(frame*0.02 + i)*0.5`, `filter: blur(0.5px)`.
- **Embers/fire-spark**: upward velocity, `opacity = 1 - life`, color shift `hsl(20→60, 100%, 50%)`, `mix-blend-mode: screen`.
- **Bokeh orbs**: large translucent `radial-gradient` circles, slow drift, `mix-blend-mode: lighten`.
- **Electric arc/lightning**: recursive midpoint displacement, render as SVG polyline with white stroke + glowing duplicate `filter: blur(4px)`.
- **Smoke puff**: spawn N circles at origin, expand radius, decrease opacity, drift up. `feGaussianBlur stdDeviation=8` aggregates.

### J.6 Camera shake / impact
- **Subtle ambient shake**: `translateX(sin(frame*0.3)*1.5) translateY(cos(frame*0.4)*1.5)`, magnitude 1-2px.
- **Beat-drop punch**: at impact, spring `scale(1→1.15→1)` over 6 frames `damping:8, stiffness:200`, plus `random(seed)*8` shake. Add chromatic aberration flash.
- **Hit-stop / freeze-frame**: `<Freeze>` 4 frames + 1-frame white-flash overlay.
- **Whip-shake combo**: 3 frames motion-blur + violent shake, then settle.
- **Frame-skipping for impact**: interpolate `Math.floor(frame/3)*3` for 8-fps jitter.

### J.7 Loop / cycle
- **Spinner record**: `rotate(${(frame/duration)*360})`, linear, 1.8s for 33⅓ rpm.
- **Slot machine roll** (odometer): vertical strip of digits, `translateY(-N*lineHeight)` driven by spring, each digit independent. **Already in `XTrendingHeartStorm`.**
- **Ticker tape / marquee**: `translateX(0→-100%)` infinite, content duplicated twice, linear timing.
- **Breathing logo**: scale `1→1.05→1` over 3s, ease-in-out sine.
- **Heartbeat**: two-tap `scale(1→1.15→1→1.1→1)` over 1.2s.
- **Pendulum**: `rotate(-15deg → 15deg)` sine-easing, `transform-origin: top center`.
- **Floating bob**: `translateY(sin(frame/30)*8)`.

### J.8 Scene transitions
- **Whip-pan (Sam Kolder signature)**: 4-frame motion-blur sweep, outgoing `translateX(0→-150%)` while incoming `translateX(150%→0)`, both `filter: blur(20px→0)`. Synced "whoosh" SFX.
- **RGB-split slide**: split outgoing into R/G/B channels, slide each at slightly different speed.
- **Diagonal wipe**: corner-driven `clip-path: polygon` sweep.
- **Paper-rip**: outgoing split into two with jagged irregular `clip-path` lines, fly apart with rotation.
- **Ink-blob**: incoming clipped by SVG ink-splatter path, scale 0%→200% from center.
- **Light-leak**: orange/red `radial-gradient` overlay, `mix-blend-mode: screen`, sweep across.
- **Glitch-stutter**: 4 frames randomized `clip-path` slices alternating outgoing/incoming + RGB shift.
- **Zoom-blur cut**: outgoing `scale(1→4)` + `blur(0→20px)` for 6 frames, hard cut, incoming `scale(1.5→1)` + blur reverse.
- **Photographic flash-bleach**: 1 frame all-white + 2 frames white at 60%. **Max 1 per reel.**

### J.9 "Mistake-FX" (deliberate lo-fi for virality)
- **Freeze-on-reaction with red circle**: `<Freeze>` 18-30 frames + animated SVG `<circle stroke="red" stroke-width="6">` drawn via `stroke-dasharray` reveal around face/object + hand-drawn arrow.
- **MS-Paint scribble**: SVG path drawn like a kid: `M 100 100 Q 120 80 140 100` random control points. `stroke-dasharray` reveal, 2px red, no antialias.
- **Kindergarten doodle arrow**: wavy arrow `stroke-linejoin: round`, slight `stroke-dasharray: 5 3` for sketchy gaps, `Caveat` annotation.
- **Hand-drawn highlighter**: yellow `clip-path: polygon` with rough top edge, `mix-blend-mode: multiply`, 30% opacity, animated left-to-right.
- **Wrong-font-on-purpose**: mix Impact + Comic Sans + Times in one sentence, randomized rotation per word.
- **Fake-typo correction**: type wrong word, freeze 6 frames, "scratch out" red diagonal SVG, append correct word with arrow → up.
- **Pop-up subscribe button**: animated YouTube-red button slides from right, wiggles 2 frames, slides out + click SFX.

---

## §K. Motion-to-SFX master lookup matrix

**Core principle**: Audio leads picture by 10-20ms. A whoosh starts BEFORE the visual cut so sound "pulls" the eye into the new frame. Three-layer cuts (whoosh + impact + sub) are the modern viral standard.

| Beat type | Lead-in | Attack | Body | Tail | Voice ducking |
|---|---|---|---|---|---|
| Hard scene cut | Whoosh -20ms | Impact 0ms | Sub 40-60Hz +30ms | Reverb 400ms | -2dB for 200ms |
| Text pop-in | none | Pop 0ms | tiny ding +20ms | none | none |
| Big-number stamp | Sub swell -300ms | Stamp 0ms | Sub thump +20ms | Paper crunch | -3dB for 300ms |
| Hero reveal | Riser -2000ms | Impact 0ms | Sub + reversed cymbal | Pad swell 1500ms | -6dB during impact |
| Money drop | none | Cha-ching 0ms | Coin shimmer | Sub thump | -3dB for 500ms |
| Comedic punchline | Pre-silence -300ms | Sad trombone or boom | Crickets bed | Decay | full duck |
| Voice stress tick | none | Tick 0ms (-22dB) | none | none | -1dB transient |
| Zoom-out exit | none | Reverse-riser | downer pad | none | -2dB |
| Glitch transition | none | Bitcrush 0ms | digital error | tape stop | -4dB |
| Element shrinks | none | Reverse-riser/suckback | none | none | -1dB |
| Slow-mo hero | Long pad swell | Sub | Reversed bell | Choir pad | -8dB |
| Type/keyboard char | none | Per-char click 40-80ms | none | none | none |
| Camera flash | none | Shutter | Tail reverb | none | -2dB |
| Spin/rotation | none | Stuttered whoosh | none | none | -1dB |
| Awe/mystical | none | Bass swell | Reversed bell | Choir pad + infrasound 20Hz | -6dB |
| Ambient bed (always-on) | continuous loop @ -30dB, low-pass <4kHz | n/a | n/a | n/a | n/a |

---

## §L. SFX duration clamps (`maxDurationSec`) — mandatory for every cue

| SFX type | maxDurationSec |
|---|---|
| Whoosh (short) | 0.5 |
| Whoosh (cinematic) | 2.5 |
| Impact / thud | 0.5 |
| Sub-bass drop | 0.8 |
| Pop (text-in) | 0.2 |
| Ding / chime | 0.8 |
| Riser (short) | 3.0 |
| Riser (cinematic) | 6.0 |
| Reverse-riser / suckback | 1.5 |
| Notification | 1.5 |
| Keyboard typing — per char | 0.08 |
| Cash register / ka-ching | 1.0 |
| Stamp hit | 0.6 |
| Glitch stutter | 0.6 |
| Camera shutter | 0.3 |
| Click / tick (on-stress) | 0.08 |
| Slap-back echo (on word) | 0.2 |
| Sad trombone | 2.0 |
| Vine boom | 2.0 |
| Coin shimmer | 1.5 |
| Vinyl/room tone bed | match scene |

Every cue in `output/breaking/<slug>/sfx-cues-<variant>-final.json` MUST have `maxDurationSec`. Without it, audio plays the full file (sometimes 3-5 seconds) and bleeds into the next cue. Reel.tsx respects `maxDurationSec` via `<Audio endAt={maxFrames}>`.

---

## §M. Riser anatomy (when it lands vs feels broken)

- **Duration**: 1.5-3s for viral reels (4s+ only for trailer-style hero reveals).
- **Frequency contour**: lows (60-150Hz weight) → mids (filtered noise) → highs (3-10kHz white noise + reversed cymbal).
- **APEX punctuation MANDATORY**: visual cut, title card reveal, OR beat drop at exact peak frame.
- **-3 to -6 dB volume cut at peak right before the impact** creates contrast.
- Without an apex hit, a riser feels broken.

---

## §N. LUFS targets

- Master: **-9 to -12 LUFS** for TikTok/Reels (louder than YouTube's -14), true peak -1 dBTP.
- Voiceover short-term: -12 to -14 LUFS.
- Music bed under voice: -30 to -35 dB LUFS.
- SFX simultaneous with voice: 8-12 dB BELOW voice peak.
- Sub-bass impact: -10 to -15 dB below voice peak (so -13 to -18 dB true peak).
- High-pass everything else below 80-100Hz so sub owns that band cleanly.

---

## §O. SFX avoid-list 2026

- Vine boom AS DEFAULT punctuation (still works ironically only)
- Metal pipe falling — peaked 2022-23
- Generic "Whoosh + Vine Boom" combo on every cut — lazy 2021 TikTok signature
- Loud record-scratch on freeze frame — Vox parody now
- Inspirational orchestral hit on every quote — "course-bro" energy
- Generic Apple Mac startup chime
- Cash register at non-money moments
- Mario coin (childish)
- 5-10 separate candle dings (use single celebratory ascend)
- "What the dog doin'" / Sigma chad horns when sincere
- Sad trombone on AI/tech topics — Vox-clone now
- Air-horn at non-celebratory moments — reads as desperate hype

R5 in `decision-rubrics.md` references this list and treats violations as critique auto-fails.

---

## §U. Spring sweet spots (locked-in for 1080×1920 reels)

- **Crisp UI tap**: `{mass:0.5, damping:14, stiffness:180}` settles ~7 frames.
- **Snappy text reveal**: `{mass:1, damping:20, stiffness:200}` — no overshoot, ~12 frames.
- **Bouncy emoji/badge**: `{mass:1, damping:6, stiffness:130}` — 2 visible bounces.
- **Hero zoom-in**: `{mass:1.5, damping:30, stiffness:80}` — slow, dramatic, ~30 frames.
- Use `measureSpring()` to schedule next animation exactly when prior settles.

**Stagger cascade**: 4-6 frames between siblings = viral feel; 8-10 = "premium"; 12+ = lazy.

**Easing curves**:
- **Whip (overshoot then settle)**: `Easing.bezier(0.34, 1.56, 0.64, 1)` — pop-in.
- **Snap (anticipation + accel)**: `Easing.bezier(0.87, 0, 0.13, 1)` — text smash-cut.
- **Smooth (Material)**: `Easing.bezier(0.4, 0, 0.2, 1)` — backgrounds/fades.
- Reserve `elastic`/`bounce` for emphasis only — overuse signals "PowerPoint."

---

## §Z. Anti-patterns 2026 (the avoid-list — referenced from critique-rubrics.md)

- Slow music intro / logo intro / "Hey guys" greeting in first 0.5s
- Generic "comment below" / "tag 3 friends" / "like for part 2" CTAs
- Yellow-pill Hormozi captions on premium/editorial-tone reels
- Single mechanic on 10 tiles (slideshow energy)
- Diagonal-split with photos (crops faces)
- Marker stroke as overlay on top of AFTER image
- `objectFit: cover` blind without per-asset `assetObjectPosition`
- Sub-300ms entry animation (looks rushed)
- 12+ frame stagger between siblings (looks lazy)
- Bouncy spring on every text reveal (PowerPoint vibes)
- `feTurbulence` on per-frame path (bake to PNG instead)
- `filter: drop-shadow` on per-frame elements (GPU brutal)
- `Math.random()` anywhere (non-deterministic across workers)
- CSS animations / transitions (don't render correctly)
- Sed-edits on plan files (linter reverts; use Edit tool with replace_all)
- Skipping the 3-round verification (always discovers a bug at frame inspection)
- Rendering without bundle cache invalidation (ships old layout)
- Verifying at fixed timestamps (Whisper bucketing shifts boundaries)

---

## How R4/R5 chain into here

R4 (effects palette) outputs 3 effects (4 if pacing≥45s) drawn from §J subsections, filtered by tonal_target in tonal-palettes.md and topic_class taboos in `decision-rubrics.md`.

R5 (SFX) outputs cues drawn from beat plan, mapped via §K matrix, clamped via §L durations, gain-calibrated via §N LUFS targets, filtered by §O avoid-list AND tonal_target in tonal-palettes.md.

Each cue MUST have a 4-word rationale field. Critique fails any cue without one.

Spring/easing constants in §U are imported from `src/remotion/utils/springs.ts` (preserved unchanged in the working directory).
