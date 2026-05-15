# Pipeline bugs — common-bug table + V47 anti-patterns + footguns

Loaded when troubleshooting a render that produced unexpected output. The collected scar tissue from prior reels.

---

## Common bugs and fixes

| Symptom | Root cause | Fix |
|---|---|---|
| Beat shows wrong asset (e.g. hero stuck through B2) | script.txt has fewer lines than visual-plan beats | Split script.txt 1-line-per-beat, wipe captions.json, re-render |
| Black gap at avatar seam | Chroma-key transition band exposed | `AVATAR_SEAM_Y = 1020` (legacy paradigm); OR move to V67+ black-canvas + full-frame chroma cutout (see render-cookbook.md §V67) |
| Asset off-frame / focal point cropped | `objectFit: cover` blind | Set explicit `assetObjectPosition` per asset |
| Tweet shows old @yudDIDit instead of @brand | Hardcoded `JEREMY_LAUNCH_TWEET` | Set `v40.tweetVariant: 'replit'` (or your variant); add `<BRAND>_LAUNCH_TWEET` export |
| `interpolate inputRange must be strictly monotonically increasing` | `durationInFrames - 12` going negative for short Sequence | Clamp keyframe positions: `Math.max(fadeIn + 1, durationInFrames - 12)` |
| Veo 2 returns "duration out of bound" | Asked for 4 s | Min is 5 s; ask 5-8, trim post-download if needed |
| Veo 3 preview returns 404 | Model gated on free tier | Use `veo-2.0-generate-001` |
| Render exits at frame N with `Error: npx exit 1` | Component crashed mid-frame | Find error in log: search for "SymbolicateableError"; fix the component |
| Render dies mid-frame with Chromium 28s fetch timeout | OffthreadVideo source >25 MB or first-fetch cold | Restart render — bundle cache + page cache hit on retry usually clears it. Or shrink B-roll mp4 with `-crf 22 -preset slow` |
| 30s/$X price text looks cheap | Floating text without context | Use the kraft-paper tag + rubber-stamp `PriceTagFlip` |
| "10" hidden behind avatar | Numeral mounted at y > AVATAR_SEAM_Y | Mount in top pane (y < 1000); use the cake layout |
| YouTube CTA has black void below | Window content stops too high | Use the V46j YouTubeCommentCTA with 3 fake comments below |
| Visual + voice out of sync | captions.json scene buckets misaligned | Wipe `output/captions.json`; ensure script.txt is 1-line-per-beat |
| Walking word selection jumps single tokens | TweetCardV2 v1 single-active-token mode | Use V46j cumulative two-line marker (`box-decoration-break: clone`) |
| Thin cyan/blue line on right edge of frame on card-mode beats (only) | 1px inset white highlight on the card's `boxShadow` reads as cyan against the surrounding black canvas | Drop the `0 0 0 1px rgba(255,255,255,0.04) inset` line from the card's boxShadow; keep only the drop shadow |
| Thin cyan/blue line on right edge of frame on EVERY beat | h264 chroma-subsampling produces a 1-2 px non-green fringe (cyan tint) on the leftmost/rightmost columns of the chroma source video — green-only chroma matrix can't key it out, `feMorphology erode r=2` only partially eats it | Add `transform: scale(1.012)` (and `transformOrigin: center`) to the chroma `<OffthreadVideo>` inside an `overflow: hidden` parent. Pushes the source's edge columns outside the visible 1080-px frame entirely. See render-cookbook.md §V67 for full recipe |
| White-pencil scribble overlay strokes draw on top of busy asset content | SVG paths span full 1920 height, no clipping mask | Wrap the scribble paths in `<g clipPath="url(#dark-zone-only)">` with a `<rect y={1300}>` clipPath. Constrains strokes to the avatar's pure-black zone where they read cleanly |
| Avatar source has a black band at the bottom after CSS `translateY(-150px)` shift | Empty pixels exposed below the shifted video; CSS transform leaves a band the parent can't fill | Bake the IG-safe shift into the source mp4 via ffmpeg `crop+vstack` with bottom-edge `tile=1x1` extension (1 frame of avg-color or a synthesized bookshelf strip). Drop the CSS transform |
| Modal-popup drawbox mask lands in wrong horizontal position | Hardcoded `MODAL_X` based on guess instead of measured pixel coordinates | Open the source screenshot, eyedrop the modal's actual bounds (Petdex modal sits at x=420-1360, y=40-680, NOT the centered `MODAL_X=1240` originally assumed). Use Read tool on the PNG and measure visually before authoring drawbox |
| Petdex screenshot doesn't honor `prefers-color-scheme: dark` | Site is hardcoded light, no dark CSS variant | Don't bother re-screenshotting in dark mode — use ffmpeg `negate` or CSS-filter inversion as a post-pass, but expect a race vs the screenshot. Easier: accept light theme + add a black gradient overlay |

---

## V47-specific anti-patterns (don't repeat these mistakes)

1. **DON'T do diagonal split with photos** — half-cropping cuts faces, looks pathetic. Use `SideBySideHorizontal` instead.
2. **DON'T overlay marker stroke on top of AFTER image** — even if it fades, the user perceives the AFTER as "obstructed". Either stroke is a CLIP-PATH MASK (revealing AFTER through it) OR no stroke at all.
3. **DON'T use SAME mechanic on all 10 tiles** — slideshow energy. Either use ONE strong landed mechanic everywhere (`SideBySideHorizontal`) OR cycle through 5+ visually distinct mechanics. Don't do 5 mechanics with the SAME structure (BEFORE → transition → AFTER) — variety has to feel structural.
4. **DON'T render without bundle cache invalidation** when adding new layouts — `rm -rf node_modules/.cache && touch src/cli/render-only.ts` before render. Otherwise the new layout doesn't get bundled and the renderer falls back silently.
5. **DON'T verify with frame samples at fixed timestamps** — Whisper bucketing shifts scene boundaries. Always check `output/captions.json` first to find actual scene start/end seconds, then sample at scene_start + duration/2.
6. **DON'T use sed for plan layout swaps** — the linter sometimes reverts. Use the Edit tool with `replace_all: true` for explicit string substitution. Verify by re-reading the JSON afterward.
7. **DON'T forget `maxDurationSec` on every SFX cue** — without it, audio plays the full file (sometimes 3-5 seconds) and bleeds into the next cue. See effects-and-sfx.md §L for the duration clamp table. Reel.tsx now respects `maxDurationSec` via `<Audio endAt={maxFrames}>`.
8. **DON'T use these SFX in showcase reels**: cash register at non-money moments (sounds celebratory in wrong place), Mario coin (childish), party horn (off-context), Heavy-thud at non-impact moments. Match the SFX to the on-screen action exactly.
9. **DON'T leave the X-feed comment text and @handle clutter on each tile** — image-only premium layout reads cleaner than fake-tweet UI mockup
10. **DON'T put italic-serif numerals on black void with magenta glow** — overused 2023 cliche. Use odometer digit-roll OR live ticker mockup.

---

## Linter / cache / sed gotchas

### Linter reverts plan files
When editing `scripts/build-arrakis-plan.mts` (or similar plan files) with `sed -i`, the project linter sometimes reverts the file to a snapshot before the next save. Symptom: render uses the OLD layout despite your sed appearing to succeed. Fix:
- Use the Edit tool with `replace_all: true` instead
- Always re-grep the file after edit to confirm the new value is present
- Re-read the visual-plan JSON after `npx tsx build-...mts` to confirm the layout name made it through

### Bundle cache footgun
Remotion sometimes hits cache (`bundle cache hit (xyz)`) even when source files changed. The new layout doesn't end up in the bundle, render falls through to old layout, viewer sees old visuals. Workaround:
```bash
rm -rf node_modules/.cache && touch src/cli/render-only.ts
```
This forces a fresh bundle on next render. Add to checklist before EVERY render that introduces a new layout file.

### Pixel-scan verification
When the verification frame shows "only one card visible" or "blank pane", don't trust visual judgement on resized previews. Use Python PIL pixel sampling at expected card positions (see render-cookbook.md). Saves a render cycle.

---

## What NOT to do (editorial discipline)

These are the editorial cousins of the technical bugs above. Each has caused a re-render or a re-script.

- Don't spend Gemini calls for stage 1 artifacts — Claude in chat handles it (no LLM SDK calls)
- Don't add captions overlay (user adds them manually post-edit)
- Don't add the torn-paper seam (user disliked the jagged edge)
- Don't add B-roll PIP corner cards (clutter, drops viewer attention)
- Don't add any layout to `HIDE_AVATAR_LAYOUTS` — avatar is always visible
- Don't use 3D-cartoon style stills — photo-realistic only
- Don't use `@yourchannel` — always `@aisimplified`
- Don't generate stills without brand-logo refs (Gemini hallucinates "zeplit" / "edidframe")
- Don't render without verifying SFX file paths (a missing path silently drops the cue)

---

## Memory dependencies (what the skill reads from)

- `user_channel.md` — channel handle (currently @aisimplified)
- `workflow_no_paid_llm.md` — no LLM SDK calls in Stage 1

If those memories are missing, ask the user to confirm the channel handle before generating any CTA.
