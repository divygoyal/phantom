# Render cookbook — Remotion APIs, speed wins, chroma-key, verify

Loaded at Phase 5 (render + verify) and Phase 4 (when CSS-motion fallback needed for face-refusal).

---

## §P. Remotion 4 advanced API recipes (high-leverage, underused)

- **`calculateMetadata` + `parseMedia`**: lets HeyGen audio define `durationInFrames` automatically. Pass on `<Composition>`. Run once per render in a separate tab.
  ```tsx
  calculateMetadata={async ({props}) => {
    const {slowDurationInSeconds} = await parseMedia({
      src: props.avatarAudioUrl,
      fields: { slowDurationInSeconds: true },
      acknowledgeRemotionLicense: true,
    });
    return { durationInFrames: Math.floor(slowDurationInSeconds * 30) };
  }}
  ```
- **`<Composition schema={zod} defaultProps={...}>` with `z.infer`**: free Studio sidebar form + Lambda input validation + TS types.
- **`visualControl('label', defaultValue)`**: live-tunable constants in Studio sidebar with click-to-save back to source. First arg MUST be a static literal (static analysis writes back).
- **`measureSpring({fps:30, config:{damping:200}})`**: returns settle frame count. Schedule dependent animations exactly at spring-end.
- **`interpolateColors(frame, [0, 30], ['oklch(0.7 0.2 200)', 'oklch(0.5 0.3 30)'])`**: oklch/oklab/lab/lch supported (v4.0.439+). Better perceptual gradients than RGB.
- **`<Loop durationInFrames= times=>` + `Loop.useLoop()`** child hook: `iteration` and per-cycle frame for repeating SFX badges, ticker text without timeline math.
- **`<Series.Sequence offset={-15}>`**: negative offset = free crossfade window.
- **`premountFor={120}` on Sequence**: mounts component invisibly + frozen-frame for N frames before visible. **Critical for `<OffthreadVideo>` and HeyGen MP4 b-roll** — kills loading flicker.
- **`delayRender('font:Inter-bold')` with LABELS**: when 30s timeout fires, error names the laggard. Default 30s; raise via `delayRenderTimeoutInMilliseconds`.
- **`<Audio toneFrequency={880}>`**: programmatic sine for placeholder beeps without a file.

---

## §Q. Render speed wins (the 8min → ≤4min punch list)

1. **Switch from `<OffthreadVideo>` to new `<Video>` from `@remotion/media`** (v4.0.300+) — biggest single win.
2. **JPEG image format + 90 quality** via `Config.setVideoImageFormat('jpeg')` — 20-30% faster than PNG (you bake to mp4 anyway).
3. **`npx remotion benchmark` once**, set `--concurrency` to its recommendation. Sweet spot is usually `os.cpus().length - 1`.
4. **Memoize layout components**: `React.memo` + extract spring/interpolate, NO inline arrows passed to memoized children.
5. **Bake static blurs/shadows to PNG** via one-time `renderStill()` — `filter: blur/drop-shadow` and `feTurbulence` are GPU-bound brutal per-frame.
6. **`Config.setChromiumOpenGlRenderer('angle')`** if real GPU; `'swangle'` if no GPU. Three.js REQUIRES `angle`. Restart workers periodically (angle has memory leaks on long renders).
7. **`prefetch()`** from `@remotion/preload` for assets appearing >5s in. Don't over-prefetch (OOM risk).
8. **`--scale 0.5` for draft renders, `--scale 1` final** — halve resolution → ~4× faster.
9. **`--log=verbose 2>&1 | grep "frame "`** — pinpoints the offender frame (usually one Lottie or huge image).

---

## §T. Sidechain ducking (the math)

Remotion has no native sidechain. Implement via voice-segment-aware volume callbacks:
```tsx
const isVoiceActive = words.some(w => frame >= w.startFrame - 3 && frame <= w.endFrame + 3);
const musicVol = isVoiceActive ? 0.15 : 0.45;
<Audio src={music} volume={(f) => interpolate(f, [0, 5], [musicVol*0, musicVol])} />
```

ffmpeg sidechain post-pass when needed:
```bash
ffmpeg -i voice.wav -i sfx.wav -filter_complex \
  "[0:a]asplit=2[v][sc];\
   [1:a][sc]sidechaincompress=threshold=0.05:ratio=8:attack=5:release=250:makeup=0[ducked];\
   [v][ducked]amix=inputs=2:duration=longest" out.wav
```
Threshold 0.02-0.05 (linear), ratio 6-10:1, attack 5-30ms, release 200-500ms.

---

## §V. HeyGen avatar — chroma-key recipes

CSS-only chroma key for greenscreen MP4 (no canvas, no shader):
```tsx
<svg width="0" height="0">
  <defs><filter id="ck">
    <feColorMatrix type="matrix" values="
      1 0 0 0 0
      0 1 0 0 0
      0 0 1 0 0
      -0.5 1 -0.5 0 0" />
    <feComponentTransfer><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer>
  </filter></defs>
</svg>
<OffthreadVideo src={heyGenUrl} style={{filter: 'url(#ck)'}} />
```

**Edge cleanup**: insert `<feGaussianBlur in="alpha-output" stdDeviation="1.2"/>` between colormatrix and componentTransfer. >2px ghosts the silhouette.

**Audio extraction**: `ffmpeg -i avatar.mp4 -vn -acodec copy avatar.m4a` (no re-encode). Mount `.aac` separately with `<Audio>` and `<OffthreadVideo muted>` for video.

---

## §V67+. Black-canvas chroma-cutout pattern (alternative to AVATAR_SEAM_Y)

The legacy paradigm caps the asset zone at `AVATAR_SEAM_Y=1020` and runs the avatar as a CSS-shifted PIP below. The V67+ direction inverts it: the avatar is full-frame chroma'd against pure black, and assets sit ON TOP of that canvas in a configurable upper zone, blending into the avatar's dark zone via a long fade gradient. Reads cinematic + lets the silhouette be the visual frame.

When to choose this paradigm over `AVATAR_SEAM_Y`:
- The reel needs an "I'm-on-camera" energy — the avatar IS the framing, not a corner PIP.
- Sources include both portrait/tall (Petdex page screenshots, multi-Sam stadium hooks) AND landscape (16:9 product clips, third-party tweets) — the two-mode `TopPaneClip` handles both cleanly.
- You want a white-pencil scribble overlay (silhouette stroke + speed lines + mic dip) reading against the avatar's dark zone.

### Source video requirements

- Pure green chroma background, edge to edge, 1080×1920 native.
- IG-safe shift baked in (mouth at y=1350-1470). Do NOT use CSS `translateY` to shift — bake via ffmpeg `crop+vstack` and edge-extend the bottom 150 px with a 1×1 tile of the bookshelf or avg-color (CSS shift leaves a band the parent can't fill).

### TopPaneClip — two-mode wrapper (V40Router.tsx)

```tsx
type AssetMode = 'fullbleed' | 'card';

const TopPaneClip: React.FC<{ children: React.ReactNode; mode?: AssetMode }> = ({ children, mode = 'card' }) => {
  if (mode === 'fullbleed') {
    // Portrait/tall sources fill the upper zone EDGE-TO-EDGE.
    // Asset zone extends down to y=1300 (overlaps with avatar's hair area);
    // a 600 px multi-stop fade-to-black gradient blends asset → avatar zone.
    const ASSET_BOTTOM = 1300;
    return (
      <AbsoluteFill style={{ background: '#000' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: ASSET_BOTTOM, overflow: 'hidden', background: '#000' }}>
          {children}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: 600, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.18) 30%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.78) 78%, rgba(0,0,0,0.95) 92%, #000 100%)',
          }} />
        </div>
      </AbsoluteFill>
    );
  }
  // 'card' mode (default) — landscape sources sit in a centered rounded-corner card.
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <div style={{
        position: 'absolute', top: 60, left: 40, right: 40, bottom: 1920 - AVATAR_SEAM_Y + 30,
        overflow: 'hidden', borderRadius: 28,
        boxShadow: '0 24px 60px rgba(0,0,0,0.55)',  // PURE drop shadow only — no inset highlight
        background: '#0E0E14',
      }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};
```

**Don't add an inset highlight to the card's `boxShadow`.** A 1px `0 0 0 1px rgba(255,255,255,0.04) inset` line renders as a thin cyan/blue stripe at the right edge against the surrounding black canvas. Keep boxShadow to the drop shadow only.

### Chroma source edge fringe — overscan fix

h264 chroma-subsampling produces a 1-2 px non-green fringe (typically cyan-tinted) on the leftmost/rightmost columns of any chroma source video. The green-only `feColorMatrix` can't key it out; `feMorphology erode r=2` only partially eats it. The visible result: a thin cyan/blue vertical line at the right edge of EVERY beat (most visible against black-canvas card-mode beats).

Fix: scale the chroma video 1.012× inside an `overflow: hidden` parent so the source's edge columns sit outside the visible 1080-px frame.

```tsx
<div style={{ position: 'absolute', inset: 0, opacity: visualOpacity, overflow: 'hidden' }}>
  <OffthreadVideo
    src={staticFile(avatar)}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: 'scale(1.012)',          // ~6 px overscan each side
      transformOrigin: 'center center',
      filter: 'url(#chromakey-green)',
    }}
  />
</div>
```

Don't go higher than ~1.015 — the avatar starts losing usable shoulder/mic space.

### Chroma key SVG filter (cranked for clean cutout)

```tsx
<filter id="chromakey-green" colorInterpolationFilters="sRGB">
  <feColorMatrix type="matrix" values="
    1 0 0 0 0
    0 1 0 0 0
    0 0 1 0 0
    2 -3 2 0 1" result="keyed" />
  <feComponentTransfer in="keyed" result="thresh">
    <feFuncA type="linear" slope="20" intercept="-9" />
  </feComponentTransfer>
  <feMorphology in="thresh" operator="erode" radius="2" result="eroded" />
  <feComposite in="SourceGraphic" in2="eroded" operator="in" />
</filter>
```

`alpha = 2R + 2B − 3G + 1` (negative for green-dominant pixels). Sharp threshold via `feFuncA` slope 20 / intercept −9. `feMorphology erode r=2` clips residual green fringe (raise to r=3 if the source has soft chroma edges).

### Pre-keyed alpha-channel WebM optimization

When the source is a pre-keyed VP9+alpha WebM (rendered once via ffmpeg or DaVinci), skip the SVG filter entirely. Detect by extension and pass `transparent` to `OffthreadVideo`:

```tsx
const isKeyed = /\.(webm|mov)$/i.test(avatar);
<OffthreadVideo
  src={staticFile(avatar)}
  transparent={isKeyed}
  style={{ filter: isKeyed ? 'none' : 'url(#chromakey-green)' }}
/>
```

This was the V38 / V39 speedup — kills the per-frame SVG-filter cost (the single biggest render hot path on 1.3k-frame compositions).

### White-pencil scribble overlay — clip to dark zone

The scribble (silhouette stroke + speed lines + bottom mic dip) MUST be clipped to the avatar's pure-black zone, otherwise strokes draw on top of busy asset content above and read messy. Use an SVG `<clipPath>`:

```tsx
const CLIP_Y = 1300;  // matches the asset-zone fade-end y
<svg width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <filter id="pencil-rough" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="5" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4.5" />
    </filter>
    <clipPath id="dark-zone-only">
      <rect x="0" y={CLIP_Y} width="1080" height={1920 - CLIP_Y} />
    </clipPath>
  </defs>
  <g clipPath="url(#dark-zone-only)" filter="url(#pencil-rough)" stroke="rgba(255,255,255,0.95)" strokeWidth={7} fill="none">
    {/* Side strokes flanking face/shoulders + bottom mic dip + speed lines */}
    {/* Avoid a top horizontal arc above the forehead — user feedback: reads as a "ceiling" line that fights the asset boundary */}
  </g>
</svg>
```

Stroke placement (avatar coordinates from a 1080×1920 elio-style chroma source):
- Side strokes start at y=1340 (just below the asset fade end), curve down through cheek/jaw/neck/shoulder/arm to y=1900.
- Bottom mic dip: loose loop from x=90 to x=970 at y≈1900.
- Speed lines: y=1480-1580, flanking the cheek (x=60-180 left, x=900-1040 right).
- Lightning-bolt accents at y=1440-1540 behind the speed lines for energy.

Don't draw a top horizontal arc connecting the temples above the forehead — it reads as a ceiling and fights the asset-zone boundary. Just the two side strokes + mic dip is enough silhouette read.

### Reel.tsx wiring

```tsx
const cream = brandConfig?.palette?.cream ?? '#000000';  // black canvas
// PaperGrainOverlay disabled (reads muddy on pure black)
// ScribbleOverlay sequence MUST be mounted ABOVE the AvatarLayer in z-order
<AbsoluteFill style={{ background: cream }}>
  ...scenes...
  <AvatarLayer avatar={avatar} hideFrameRanges={...} />
  <ScribbleOverlay />
</AbsoluteFill>
```

---

## HeroScribblePane — CSS-motion fallback for face-refusal

When Veo 2 refuses to animate stills with recognizable real-person faces (Trump / Sam Altman / Elon), fall back to a CSS-only `HeroScribblePane` that takes the static PNG and adds procedural breathing/wobble:
- Scale wiggle: `scale(1 + sin(frame*0.04)*0.015)` — slow breath.
- Pendulum rotation: `rotate(sin(frame*0.03)*0.4deg)` — slight sway.
- Jitter: `translateX(random(seed)*0.4 - 0.2)` per 4 frames — sub-pixel handheld feel.

Indistinguishable from Veo output for kindergarten-aesthetic content. No API refusal risk.

---

## Render command (canonical)

```bash
nohup npx tsx src/cli/render-with-heygen.ts \
  --variant <brand> \
  --slug <brand>-<tweet-id> \
  --avatar input/heygen-greenscreen.mp4 \
  --skip-heygen \
  > output/render-v<NN>.log 2>&1 &
```

**Bundle**: ~3 s if cached, ~35 s cold. Frame render: ~6-10 min for 1272 frames @ 30fps × 8 workers. Post-process: ~30 s.

**Cache invalidation when introducing a new layout** (mandatory):
```bash
rm -rf node_modules/.cache && touch src/cli/render-only.ts
```

---

## Verification (Phase 8 in the original SKILL.md, retained)

Always extract verification frames at every redesigned beat. **Sample frames at scene_start + duration/2** — never fixed timestamps (Whisper bucketing shifts boundaries).

```bash
# Read scene boundaries from output/captions.json first
mkdir -p output/v<NN>-verify

# Then sample at each scene's middle
for scene in $(jq -r '.scenes[] | "\(.start_frame),\(.end_frame),\(.index)"' output/captions.json); do
  IFS=',' read -ra parts <<< "$scene"
  mid_frame=$(( (parts[0] + parts[1]) / 2 ))
  mid_sec=$(echo "$mid_frame / 30" | bc -l)
  ffmpeg -y -ss "$mid_sec" -i output/final-video.mp4 -frames:v 1 "output/v<NN>-verify/scene${parts[2]}.png"
done
```

**Read each frame.** Confirm:
- B1 hook visible at scene 0 mid-frame (NOT hero stuck — that means timing slipped)
- assetObjectPosition correctly framed each beat
- Avatar visible bottom 40% at every timestamp
- No black gap at seam (`AVATAR_SEAM_Y=1020`)
- Frame 0 = frame N (loop strategy)

**Pixel-scan ambiguous frames** (PIL `getpixel` at expected card positions):
```python
from PIL import Image
img = Image.open('output/v<NN>-verify/scene6.png')
for name, x, y in positions:
    print(f'{name} {x},{y}: {img.getpixel((x, y))}')
```
This reveals whether a card is rendered (non-cream pixel) or absent (cream backdrop). Saves a render cycle.

---

## Post-render audio

ffmpeg `loudnorm` post-pass for TikTok/Reels distribution:
```bash
ffmpeg -i output/final-video.mp4 -af loudnorm=I=-12:TP=-1.5:LRA=11 -c:v copy output/final-loudnorm.mp4
```

This brings master to -12 LUFS, true peak -1.5 dBTP, LRA 11 — algorithm-friendly for vertical-feed distribution.

---

## §Z. Android playback compatibility — pix_fmt + H.264 profile (validated 2026-05)

Remotion 4 renders default to **`yuvj444p`** pixel format with **`High 4:4:4 Predictive`** H.264 profile. iOS QuickTime / Safari / Photos play this fine. **Android MediaPlayer (and most Android-native viewers — Photos, Gallery, WhatsApp, Telegram, IG ingest, YouTube Shorts upload preview) refuse it silently.** Files appear broken / will not open / show black screen.

This is the #1 "why doesn't my video open on Android?" issue and shipped as a bug in the higgsfield-2052062257 reel before fix.

### Probe to detect

```bash
ffprobe -v error -show_entries stream=codec_name,profile,level,pix_fmt -of default=noprint_wrappers=1 output/final-video.mp4
```

**Bad** (iOS-only):
```
profile=High 4:4:4 Predictive
pix_fmt=yuvj444p
```

**Borderline** (some Android players still reject):
```
profile=High
pix_fmt=yuvj420p   ← the "j" prefix = JPEG full-range (0-255). Avoid.
```

**Good** (universally playable):
```
profile=High
level=40
pix_fmt=yuv420p    ← strict, no "j"
color_range=tv
color_space=bt709
```

### Fix at render (preferred — no re-encode pass needed)

Pass `--pixel-format=yuv420p` to the Remotion render CLI, or set globally:

```ts
// remotion.config.ts
import { Config } from '@remotion/cli/config';
Config.setPixelFormat('yuv420p');
Config.setVideoCodec('h264');
```

In `src/cli/render-with-heygen.ts`, the Remotion render call should include `--pixel-format yuv420p` in its args. Add this once; every reel ships Android-compatible from the first pass.

### Fix post-render (when Remotion can't be reconfigured)

One ffmpeg pass — strict `yuv420p` + `bt709` + `+faststart` for mobile streaming start:

```bash
ffmpeg -y -i output/final-video.mp4 \
  -c:v libx264 -profile:v high -level 4.0 \
  -vf "format=yuv420p" \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -crf 20 -preset medium \
  -movflags +faststart \
  -c:a aac -b:a 192k \
  output/final-video-mobile.mp4
```

Notes:
- `-vf "format=yuv420p"` is stricter than `-pix_fmt yuv420p` — the filter forces standard limited-range YCbCr (16-235), whereas `-pix_fmt` alone often retains the `j` (full-range) flag from the source. Filter wins.
- `-color_range tv` + `-colorspace bt709` ensures consumer-grade color signalling. Some Android codecs reject videos without explicit colorspace tags.
- `-movflags +faststart` writes the moov atom to the start of the file (not the end). Critical for mobile streaming — without it, players must download the entire file before playback begins.
- CRF 20 + medium preset is roughly visually lossless re-encode (file size typically -10 to -15% vs source, no visible quality drop).

Output is universally playable: Android MediaPlayer, iOS, VLC, Chrome, Firefox, WhatsApp, Telegram, IG Reels ingest, YouTube Shorts upload preview.

### Why iOS is permissive

iOS's VideoToolbox decoder supports a wider range of H.264 profiles than Android's MediaCodec. iOS plays 4:4:4 chroma + full-range without complaint; Android requires consumer-grade 4:2:0 + TV-range. **Always re-encode (or render with the right flag) for the consumer-ready ship even if your dev iPhone plays the raw render fine.** "Works on my phone" ≠ "ships."

### Phase 5 verify checklist — add these

After the existing scene-mid-frame scan, also probe:

- [ ] `ffprobe pix_fmt` returns `yuv420p` strict (NOT `yuvj420p`, NOT `yuvj444p`, NOT `yuv444p`).
- [ ] `ffprobe profile` returns `High`, `Main`, or `Baseline` (NEVER `High 4:4:4 Predictive`).
- [ ] `+faststart` flag set — verify with `ffmpeg -v error -i output/final.mp4 -f null - 2>&1 | grep moov` OR `mediainfo output/final.mp4 | grep "IsStreamable"`.
- [ ] Spot-test on a real Android device or emulator (iPhone-only validation is insufficient).

---

## 3-round verification (mandatory for new layouts)

For any new layout file:
- **Round 1**: file exists + `npx tsc --noEmit` clean
- **Round 2**: V40Router import + case wired, SceneRouter case routes to V40Router, schema enum has the kind, plan JSON has the layout name
- **Round 3**: math sanity (no overlaps, fits inside 1080×1020 pane, asset paths exist)

ONLY after all 3 pass, kick off a render. Skipping any round consistently surfaces bugs at frame inspection — wastes a 10-minute render.
