# Hook components — 45-component drop-in library

All components live in `src/remotion/layouts/`. Schema base:
```ts
const BaseHookProps = z.object({
  durationInFrames: z.number().default(90),
  startFrame: z.number().default(0),
  audioSrc: z.string().optional(),
});
```

Shared springs/eases live in `src/remotion/utils/springs.ts` (preserved unchanged):
```ts
export const SPRING = {
  punch:  { damping: 12, stiffness: 200, mass: 0.6 },  // overshoot, snappy
  drop:   { damping: 18, stiffness: 140, mass: 1.2 },  // weighty
  glide:  { damping: 200 },                             // no bounce
  rubber: { damping: 8,  stiffness: 180, mass: 0.7 },  // wobbly
  whip:   { damping: 14, stiffness: 320, mass: 0.4 },  // fast, light
};
export const EASE = {
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  outBack: Easing.bezier(0.34, 1.56, 0.64, 1),
  inOut:   Easing.bezier(0.65, 0, 0.35, 1),
  punchIn: Easing.bezier(0.7, 0, 0.84, 0),
};
```

---

## The 45-component library

| # | Component | Key motion | Reel types |
|---|---|---|---|
| 1 | BrandColorFlashHero | 3 flashes (orange/black/white) → hero settles spring scale 1.05→1 | launch, news, hot-take |
| 2 | GlitchCorruptionOpener | DigitalGlitchRGB chaos 30f then settle | news, hot-take |
| 3 | ShockFaceCloseUp | Slow zoom-in 1.0→1.15 over 90f + vignette darken | hot-take, news |
| 4 | CrackedScreenHero | Crack overlay opacity hard-cut + tilt-shift rotateY 0→3° + 10f shake | news, hot-take |
| 5 | NewsTickerScroll | Bottom red strip translateX = -8 * f, hero stat fades in | news |
| 6 | MagazineCoverReveal | Drop from top via SPRING.drop, rotation settle | launch, hot-take |
| 7 | WantedPoster | Spring drop from y=-1500 + rot=-15° → 0 + sway | hot-take, news |
| 8 | TweetReplyChain | Hero tweet fades up + 3 reply springs (12f stagger) | news, hot-take |
| 9 | LinkedInPostMockup | Post fades in + counter ticks via spring(damping:100) | news, launch |
| 10 | RedditTopComment | Thread at 0.5 op + top comment springs forward + upvote arrow flashes | hot-take, news |
| 11 | HackerNewsTopStory | Title underline-fills + points spring up + comment count flashes 3× | news, launch |
| 12 | TradingViewChart | SVG path stroke-dashoffset draws + percentage badge spring | news, launch |
| 13 | HeartbeatECGMonitor | ECG path stroke-draws + stat number pulses on bpm | hot-take, news |
| 14 | MapWorldFillIn | Each country fills at frame `i*(90/N)` over 8f | launch, news |
| 15 | PopulationCounter | Spring damping:200 drives count 0→target | news, hot-take |
| 16 | MoneyRainHero | 30 bills with `delay = i*2`, fall y=-200→2200 over 90f | launch, news |
| 17 | DominoFallChain | Each domino[i] starts at `i*8`, rotateX 0→-90° over 12f | launch, tutorial |
| 18 | CardFlipReveal | rotateY 0→180° at f=30-50 with `transform-style: preserve-3d` | launch, hot-take |
| 19 | EggCrackOpen | Crack svg paths draw + top half rotateZ + hero springs out | launch |
| 20 | DoorReveal | rotateY 0→90° + brightness flooding via radial gradient | launch, tutorial |
| 21 | BoxUnboxing | Lid translateY(-400) + rotZ(-20) + content springs up | launch |
| 22 | EnvelopeOpen | Flap scaleY 1→-1 from top + letter slides up with text | launch, news |
| 23 | SketchToPhoto | Sketch paths stroke-dashoffset 1→0 + photo crossfade in | launch, hot-take, tutorial |
| 24 | WireframeToFinal | Wireframe grayscale → final saturated, scale spring 0.95→1 | launch, tutorial |
| 25 | BlackToColorReveal | clipPath sweep left→right revealing colored layer | launch, hot-take |
| 26 | ObjectMultiplying | Single → 10 → 100 → 1000 grid, springs at each phase | launch, news |
| 27 | JumboWordExplosion | Spring scale 0→1, hold, then radial fly-out + opacity 0 | hot-take, news |
| 28 | TextFromInkSpread | SVG circle scales 0→900 with feTurbulence morph + text fade | hot-take, launch |
| 29 | ComicBookPow | Starburst SVG scale spring + rot -30→0 + wiggle | hot-take |
| 30 | RansomNoteAssemble | Per-letter random origin (±2000px) + spring drop to target | hot-take, news |
| 31 | ZoomThroughPortal | Portal scale 0→1→8 + hero scale 0.3→1 inside | launch, tutorial |
| 32 | ZoomOutRugPull | Hold close-up scale=8 30f, then 8→1 with EASE.outExpo over 60f | hot-take, news |
| 33 | WhipPanFromOffscreen | Spring whip from x=1500→0 + filter blur(40→0) | news, launch, hot-take |
| 34 | HyperlapseSkyline | Background video at 2× + logo glass-card springs in | launch, news |
| 35 | ShatteredGlass | 12 shards translateZ→500 + opacity→0 + hero brightens | launch, hot-take |
| 36 | VHSTrackingError | Band Y-roll + scanline overlay + RGB bleed, fades over 50f | hot-take, news |
| 37 | PhoneNotificationInterrupt | Banner translateY -300→0 with bounce at f=30 | news, hot-take |
| 38 | AvatarTalkingWithAIWatermark | Avatar + badge rot -90→0 + glint sweep every 60f | all reel types |
| 39 | SideBySideRealVsAI | Real fades 0-15f, AI 15-30f, VS badge 30-45f spring rotation | hot-take, launch |
| 40 | PromptWindowTyping | Char-by-char `slice(0, f * 0.5)` + blinking cursor | tutorial, launch, hot-take |
| 41 | LoadingBarOfAI | Bar fills 0→100% over 60f, white flash, "DONE!" badge springs | tutorial, launch |
| 42 | GPTSpinner | 3 dots scale-pulse phased + tokens stream `floor(f/2)*4` chars | tutorial, hot-take |
| 43 | RenderingWireframe3D | rotateY 0→270° + wireframe op 1→0 + textured op 0→1 | launch, tutorial |
| 44 | BollywoodIntervalTwist | Premise A → white-flash f=58-60 → "INTERVAL" slams → premise B | hot-take, news |
| 45 | LoopBaitObjectHandoff | translateX 0→1500 then -1500→0 at end, continuous rotation | all reel types |

---

## HookComponentSelector

```ts
type ReelType = 'news' | 'launch' | 'tutorial' | 'hot-take' | 'before-after' | 'birthday' | 'list';

export const HookComponentSelector: Record<ReelType, [string, string, string]> = {
  'news':         ['NewsTickerScroll',     'GlitchCorruptionOpener',  'PhoneNotificationInterrupt'],
  'launch':       ['MagazineCoverReveal',  'ZoomThroughPortal',       'BoxUnboxing'],
  'list':         ['ObjectMultiplying',    'NewsTickerScroll',        'CardFlipReveal'],
  'before-after': ['SideBySideRealVsAI',   'SketchToPhoto',           'BlackToColorReveal'],
  'birthday':     ['RansomNoteAssemble',   'MoneyRainHero',           'ComicBookPow'],
  'tutorial':     ['PromptWindowTyping',   'LoadingBarOfAI',          'WireframeToFinal'],
  'hot-take':     ['ShockFaceCloseUp',     'JumboWordExplosion',      'BollywoodIntervalTwist'],
};
```

---

## Decision rules (used by R1 → COMPONENT step in decision-rubrics.md)

1. Hero is **stat/number** → PopulationCounter, TradingViewChart, HeartbeatECGMonitor.
2. Hero is **person/face** → ShockFaceCloseUp, MagazineCoverReveal, WantedPoster.
3. Hero is **UI screenshot** → CrackedScreenHero, WireframeToFinal, RedditTopComment.
4. Hero is **single word/phrase** → JumboWordExplosion, RansomNoteAssemble, TextFromInkSpread, ComicBookPow.
5. Hero is **physical object/product** → BoxUnboxing, EggCrackOpen, EnvelopeOpen, DoorReveal.
6. Need **perfect loop** → wrap any of the above with LoopBaitObjectHandoff.
7. Topic is **calm but needs urgency** → BollywoodIntervalTwist or PhoneNotificationInterrupt.
8. Topic is **AI/generative** → SketchToPhoto, RenderingWireframe3D, GPTSpinner, PromptWindowTyping.

---

## Tonal palette overrides

When `tonal_target` is set (R3), some components are **forbidden**:

| Tonal target | Forbidden components |
|---|---|
| dark-humor | ComicBookPow (#29), MoneyRainHero (#16), RansomNoteAssemble (#30 unless hot-take), GlitchCorruptionOpener (#2 if not urgent) |
| ironic-deadpan | ALL of the high-energy components — only use AvatarTalkingWithAIWatermark (#38), ShockFaceCloseUp (#3 if subtle), or static frame with caption |
| sincere-awe | ComicBookPow (#29), RansomNoteAssemble (#30), VHSTrackingError (#36), MoneyRainHero (#16). Use SketchToPhoto, WireframeToFinal, BlackToColorReveal, MagazineCoverReveal instead |
| urgent-breaking | EggCrackOpen (#19), DoorReveal (#20), BoxUnboxing (#21) — too playful for breaking news |
| warm-humor | (none forbidden — most components fit) |
| quiet-observation | ALL energetic components forbidden — use only AvatarTalkingWithAIWatermark (#38) or static frame |

---

## Anti-patterns from V47 (do not repeat)

- ~~`MarkerSwipeReveal`~~ deprecated — marker stroke felt gimmicky on top of AFTER
- ~~`MorphPaintReveal`~~ deprecated — same on-top-stroke problem
- ~~`PaperCrushReveal` / `PaperCrumpleHand`~~ deprecated — sequential reveal reads as slideshow
- ~~`MagnifyDiagonalSplit`~~ deprecated — diagonal half-cropping cuts faces
- ~~`BeforeAfterFlipStack`~~ deprecated — vertical stacked layout, user wanted horizontal
- ~~`ScrollingFeedFlash`~~ deprecated — X-feed UI clutter (handle + reply text per tile) too utilitarian
- ~~`HeartStormCounter` / `BigStatExplosion`~~ — earlier iterations, replaced by `XTrendingHeartStorm`

---

## Special-purpose layouts (V46/V47 spine, used in body beats not hooks)

These are body-beat layouts the structure templates depend on. Listed here for completeness; full layout API in v46-locked-in.md / v47-locked-in.md:

- `hero-video-pane` — top-pane video (Veo morph clip or supplied mp4) with ambient gradient (V46 B1)
- `HeroScribblePane` — animated still PNG with breathing/wobble (use when Veo refuses real-person animation, e.g. Trump/Sam Altman/Elon) — bypasses face-detection refusals via CSS-only motion
- `ChatGPTTypingMockup` — full ChatGPT.com UI with sidebar + photo-upload bubble + prompt typing + "Generating image…" + AI response (V47 B4-B5)
- `YouTubeCommentCTA` — Safari window mockup of YouTube comment input typing keyword (V46 B12 / V47 B19) — always use 3 fake top comments below the input box; always use `@aisimplified` channel handle
- `BigNumberConfetti` (a.k.a. BirthdayCake10 component) — 3-tier orange/cream cake on wooden plate, candles light, gold streamers, balloon corners (V46 B10) — for "[brand] just turned [N]" beat
- `PriceTagFlip` — kraft-paper tag with red Sharpie slash + rubber-stamp FREE (V46 B9)
- `SideBySideHorizontal` — TWO cards on the SAME ROW with VS badge in center seam (V47 B6-B15) — the LANDED comparison layout
- `Scroll3DCardWall` — premium 3D-perspective image-only gallery wall (V47 B2-B3)
- `XTrendingHeartStorm` — X.com trending hijack mockup with odometer digit-roll counter + heart tornado (V47 B17 — current best for stat reveals)
- `RapidFireGallery` — fast image cycling at ~5 frames per image, "1/N" counter pip (V47 B16)
- `PaperGrainOverlay` — global SVG turbulence noise at 8% opacity multiply-blend, mounted ABOVE all scenes, BELOW avatar — unifies the kindergarten-MS-Paint aesthetic across every beat with subtle paper texture
