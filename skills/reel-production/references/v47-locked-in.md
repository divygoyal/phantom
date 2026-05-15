# V47 — locked-in artifacts (19-beat showcase / comparison reel)

The @arrakis_ai-style 19-beat skeleton. Use when topic is "everyone is doing X" / "look at these 10 examples". Loaded by structures.md §2.

---

## When to use V47 vs V46

| Topic shape | Pattern | Typical layouts |
|---|---|---|
| Brand birthday / launch / free-deal | V46 (Replit-style) | hero-video, calendar, mac-browser, fullframe-broll mosaic, broll-with-countdown, broll-with-price-flip, BirthdayCake10, tweet-dark, YouTube CTA |
| "Everyone is doing X / look at these examples" / viral prompt trick | V47 (arrakis-style) | hero-video, scroll-3d-card-wall, ChatGPT-typing-mockup, side-by-side-horizontal × 10 tiles, x-trending-heart-storm, tweet-dark, YouTube CTA |
| News / announcement explainer | 9-beat news-explainer (structures.md §3) | mostly fullframe-broll + tweet-dark + news-snippet |

If the script has 8-15 short example beats ("Sam went first. Then Elon. The OpenAI logo got it…"), use **V47 showcase pattern**. If the script has a single deal/event with 12 distinct phases, use **V46 launch pattern**.

---

## V47 layouts (in `src/remotion/layouts/`)

All routed via V40Router → SceneRouter. Schema enum entries in `src/utils/schemas.ts`.

### Comparison / transformation layouts

- **`SideBySideHorizontal`** — TWO cards on the SAME ROW (left + right, 500×680 each), VS badge in center seam, slam-collide entrance from opposite sides + screen-shake on collision, hand-drawn pen-stroke arrows pointing at each card, sparkles orbiting AFTER, AFTER continuous wobble while BEFORE static, color-tint contrast (BEFORE saturate(0.85), AFTER saturate(1.1)). **`objectFit: contain` not `cover`** so images stay uncropped — white card padding handles aspect mismatch. **THIS IS THE LANDED COMPARISON LAYOUT** — use this whenever you need BEFORE/AFTER tile.

Deprecated comparison layouts (do not use):
- ~~`MarkerSwipeReveal`~~ — marker stroke felt gimmicky on top of AFTER
- ~~`MorphPaintReveal`~~ — same on-top-stroke problem
- ~~`PaperCrushReveal` / `PaperCrumpleHand`~~ — sequential reveal reads as slideshow
- ~~`MagnifyDiagonalSplit`~~ — diagonal half-cropping cuts faces
- ~~`BeforeAfterFlipStack`~~ — vertical stacked layout, user wanted horizontal

### Showcase / scroll layouts

- **`Scroll3DCardWall`** — premium 3D-perspective image-only gallery wall. 30 image cards in 2-column grid, each random ±8° rotation + ±175px Z-depth, container `rotateX(8deg)` + `perspective: 1800`. **Pure infinite scroll at constant velocity (480 px/s)** — NO spotlights, NO DOF blur, NO zoom interruptions. Minimal corner UI: blurred-glass counter pill top-right, "◉ Live · The Feed" label top-left. Image-only — drop @handle/reply-text bloat.

Deprecated:
- ~~`ScrollingFeedFlash`~~ — X-feed UI clutter (handle + reply text per tile) too utilitarian

- **`RapidFireGallery`** — fast image cycling at ~5 frames per image, "1/N" counter pip — for "every hour a new one" beat

### Stat / counter layouts

- **`XTrendingHeartStorm`** (V47L — current best) — X.com trending hijack mockup ("TRENDING IN AI · #1" Twitter-blue pill, "GOING VIRAL" flame badge) + heart tornado (220 hearts spawning from corners, spiraling inward toward counter, fading at center) + **ODOMETER digit-roll counter** (each digit is its own scrolling column 0-9, value=spring*targetDigit, translateY = -value * fontSize, like Vegas slot machine reels) + tweet card preview pinned at bottom with realistic engagement counters. Black BG with subtle pink halo + blurred fake X feed for context.

Deprecated:
- ~~`HeartStormCounter`~~ / ~~`BigStatExplosion`~~ — earlier iterations, replaced by `XTrendingHeartStorm`

### Hero / CTA layouts (V46 + V47 compatible)

- `HeroVideoPane` — top-pane video (Veo morph clip or supplied mp4) with ambient gradient
- `HeroScribblePane` — animated still PNG with breathing/wobble (use when Veo refuses real-person animation, e.g. Trump/Sam Altman/Elon) — bypasses face-detection refusals via CSS-only motion (see render-cookbook.md)
- `ChatGPTTypingMockup` — full ChatGPT.com UI with sidebar + photo-upload bubble + prompt typing + "Generating image…" + AI response. Use for any "open ChatGPT and paste this prompt" beat.
- `YouTubeCommentCTA` — Safari window mockup of YouTube comment input typing keyword. **Always use 3 fake top comments below** the input box so the window doesn't have a black void; **always use `@aisimplified` channel handle**.
- `BigNumberConfetti` (a.k.a. BirthdayCake10 component) — for V46 only; not used in V47.
- `PriceTagFlip` — V46 only.

### Texture / global

- `PaperGrainOverlay` — global SVG turbulence noise at 8% opacity multiply-blend, mounted ABOVE all scenes, BELOW avatar — unifies the kindergarten-MS-Paint aesthetic across every beat with subtle paper texture

---

## V47 19-beat skeleton

| # | Layout | Voice line shape |
|---|---|---|
| B1 | `hero-video-pane` | hook ("everyone is doing X / look at this") |
| B2 | `scroll-3d-card-wall` | scope ("hundreds of people are using this") |
| B3 | `scroll-3d-card-wall` | escalation (different topCopy) |
| B4 | `chatgpt-typing-mockup` | "open ChatGPT and upload this" |
| B5 | `chatgpt-typing-mockup` | "paste this prompt" (shows the response) |
| B6-B15 | `side-by-side-horizontal` × 10 | one tile per before/after pair |
| B16 | `rapid-fire-gallery` | rapid cycle of all 10 results |
| B17 | `x-trending-heart-storm` | "going viral / #1 trending" stat reveal |
| B18 | `tweet-dark` | the original viral tweet (source credit) |
| B19 | `youtube-comment-cta` | keyword + @aisimplified |

---

## V47 SFX cue palette (locked-in by motion event)

Add these on top of the V46 palette. Each cue requires `maxDurationSec` (effects-and-sfx.md §L) and a 4-word rationale (R5 in decision-rubrics.md).

| Event | SFX | Gain | maxDurationSec |
|---|---|---|---|
| Slam-collide cards entrance | `7 - SFX Pack EP 1/Soft Whoosh 01.wav` | -10 | 0.40 |
| Card collision impact | `Heavy object Hit and body thud sound effect.mp3` | -10 | 0.30 |
| VS badge / pill click | `Mouse Click Sound Effect.mp3` | -10 | 0.18 |
| Hand-drawn pen-stroke | `swipes.mp3` | -8 | 0.30 |
| Sparkle / ding | `Ding.mp3` | -16 | 0.20 |
| Rapid-fire shutter cycle | `Mouse Click Sound Effect.mp3` × N | -10 | 0.18 |
| Heart pop / heart-storm tick | `Pop Bubble Sound Effect.mp3` | -12 | 0.40 |
| Trending pill enter | `Apple Notification.wav` | -10 | 0.85 |
| Browser slide / chrome window | `clean-fast-swooshaiff-14784.mp3` | -8 | 0.55 |
| Scroll feed bg whoosh (continuous) | `clean-fast-swooshaiff-14784.mp3` | -10 | 1.5 |
| Magic ascend (cake reveal) | `Ascending sound effect.mp3` | -10 | 1.5 |
| Final stat payoff cha-ching | `Cash Register (Kaching) - Sound Effect (HD).mp3` | -7 | 1.0 |
| Birthday celebration | `party horn.mp3` | -8 | 1.0 |

ALWAYS verify cue count is plausible (one cue per motion event = 50-90 cues for a 55s reel). Less = silent gaps, more = audio chaos.

**Note:** cha-ching at "final stat payoff" only works if the topic is genuinely a launch/celebration. For showcase reels of cultural noticing or hot-takes, R5 SFX selector forbids cha-ching even on stat reveals.

---

## V47-specific anti-patterns

See `references/pipeline-bugs.md` for the full V47 anti-pattern list. Key items:

1. DON'T do diagonal split with photos — use `SideBySideHorizontal`
2. DON'T overlay marker stroke on top of AFTER image
3. DON'T use SAME mechanic on all 10 tiles — slideshow energy
4. DON'T render without bundle cache invalidation
5. DON'T verify with frame samples at fixed timestamps
6. DON'T use sed for plan layout swaps — use Edit tool
7. DON'T forget `maxDurationSec` on every SFX cue
8. DON'T use cash register at non-money moments / Mario coin / party horn / Heavy-thud at non-impact moments
9. DON'T leave X-feed comment text and @handle clutter on each tile
10. DON'T put italic-serif numerals on black void with magenta glow

---

## V47 quick-start for showcase reels

When the user gives you a viral tweet URL with the pattern "everyone is doing X" / "here are 10 examples":

1. Fetch tweet syndication JSON (asset-cookbook.md DD.1)
2. Pull tweet's photos (BEFORE/AFTER demonstrations) — usually 2-4 images
3. Use Playwright + .env X cookies to scroll-and-capture 30 real reply images for the `Scroll3DCardWall` strip (asset-cookbook.md V47 X-cookie scrape pattern)
4. Gemini-generate 7-10 photo-realistic BEFORE images of celebrities/icons (Sam Altman, Elon, OpenAI logo, Mona Lisa, Pulp Fiction, Pink Floyd, Mickey, Bored Ape, Apple logo)
5. Gemini-generate matching scribble AFTER images using @arrakis_ai's actual prompt (or the show's equivalent prompt)
6. Write 19-line script.txt: hook → setup → ChatGPT instruction → prompt-card → 10 example tiles → marquee → stat counter → tweet → CTA
7. Author `build-<brand>-plan.mts` with:
   - B1 hero (morph clip / animated still)
   - B2-B3 scroll-3d-card-wall (uses the 30 real reply images, both beats use SAME layout w/ different topCopy for variety)
   - B4-B5 chatgpt-typing-mockup (B4 = window+upload stage, B5 = typing+response stage)
   - B6-B15 side-by-side-horizontal × 10 (each tile uses ONE BEFORE/AFTER pair)
   - B16 rapid-fire-gallery (fast cycle of all 10 scribbles)
   - B17 x-trending-heart-storm (odometer + tornado + trending hijack)
   - B18 tweet-dark (the original viral tweet)
   - B19 youtube-comment-cta (with @aisimplified)
8. Author SFX cue file with maxDurationSec everywhere (60-90 cues total, motion-event-aligned, with rationales)
9. **Run 3-round verification** (file → router → plan) — see render-cookbook.md
10. **Cache invalidate** (`rm -rf node_modules/.cache && touch src/cli/render-only.ts`)
11. Render
12. Sample verification frames at scene_start+duration/2 (NOT fixed timestamps), pixel-scan if visually ambiguous

---

## V47 process learnings (from prior renders)

### 3-round verification before render
For any new layout:
- **Round 1**: file exists + `npx tsc --noEmit` clean
- **Round 2**: V40Router import + case wired, SceneRouter case routes to V40Router, schema enum has the kind, plan JSON has the layout name
- **Round 3**: math sanity (no overlaps, fits inside 1080×1020 pane, asset paths exist)

ONLY after all 3 pass, kick off a render.

### Bundle cache footgun
See render-cookbook.md and pipeline-bugs.md.

### Pixel-scan verification
See render-cookbook.md.

### Linter reverts plan files
See pipeline-bugs.md.
