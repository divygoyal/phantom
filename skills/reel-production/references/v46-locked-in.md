# V46 — locked-in artifacts (12-beat brand-birthday / launch / free-deal)

The Replit-style 12-beat skeleton. Use when topic is brand-birthday / age / anniversary number = payoff. Loaded by structures.md §1.

---

## The 12-beat skeleton

| # | Layout | Voice line example | Asset |
|---|---|---|---|
| B1 | `hero-video-pane` | hook line (3-5 words) | Veo hook clip 2.5s |
| B2 | `fullframe-broll` | the promise | Gemini still → Veo2 animated mp4 |
| B3 | `calendar-card` | "Check your calendar, if it's [DATE]…" | procedural |
| B4 | `mac-browser-frame` | "go to [BRAND] and …" | tweet video trim 3.5s |
| B5 | `fullframe-broll` | use case 1 | Gemini still → Veo2 |
| B6 | `fullframe-broll` | use case 2 | Gemini still → Veo2 |
| B7 | `fullframe-broll` | use case 3 | Gemini still → Veo2 |
| B8 | `broll-with-countdown` | "burning credits / 24 hours straight" | Veo2 burning element clip — NO floating overlay |
| B9 | `broll-with-price-flip` | "$X normally, today FREE" | Veo2 hero clip + price tag SVG + rubber stamp |
| B10 | `big-number-confetti` (cake) | "[brand] just turned [N]" | procedural birthday cake |
| B11 | `tweet-dark` | takeaway | Replit-style tweet-data |
| B12 | `youtube-comment-cta` | "Drop [KEYWORD] in the comments…" | YouTube clone w/ @aisimplified |

Total ~38-46s depending on avatar audio length.

---

## Layout-specific guidance

### B1 hero-video-pane
Veo hook clip 2.5 s. Ambient brand-orange radial gradient. `heroVideoSrc` + `heroAmbient: '#F26207'`.

### B2 / B5 / B6 / B7 / B9 fullframe-broll
Top-pane clipped Veo2 animation. ALWAYS specify `assetObjectPosition`.

### B3 calendar-card
Procedural iPhone calendar with pulsing day. Props: `calendarMonth`, `calendarHighlightDay`, `calendarStartWeekday`, `calendarDaysInMonth`. **Use TODAY'S date** (current date check via env).

### B4 mac-browser-frame
Mac browser chrome around demo asset. Props: `assetSrc` (video preferred), `browserUrl: '<brand>.com'`, `assetObjectPosition`.

### B8 broll-with-countdown
**REMOVED the floating digit overlay** — the burning counter clip alone is the visual; supplement with clock-tick + fire-whoosh + final-impact SFX. (See `V40Router.tsx` `case 'broll-with-countdown'`.)

### B9 broll-with-price-flip — `PriceTagFlip` redesign (V46j)
- Phase 1: hand-drawn kraft-paper price tag (string, hole, dotted border) with serif text
- Mid: red Sharpie slash draws across via `pathLength` + `strokeDashoffset`
- Phase 2: rubber-stamp FREE in classic stamp red, double-ring frame, `feTurbulence` gritty texture, -7° rotation, world-shake on impact
- NO white pill, NO thick border — looks "cheap" if you do that

### B10 big-number-confetti — `BirthdayCake10` (V46j)
- Hero 3-tier cake: orange top tier with brand "10" SVG text, cream middle with brand pinstripe, cream-with-sprinkles bottom on wooden plate
- Frosting drips on each tier (procedural arched paths)
- Gold-foil banner ABOVE: "10 YEARS OF [BRAND]" in italic serif (V-cut tail edges)
- 10 candles around top tier, single celebratory `candleLight` spring at frame 14 (NOT 10 separate dings — those sound funny)
- Confetti BURST: 60 paper strips emit from cake apex, 6 colors, physics gravity
- 2 balloons springing in from corners (orange + gold)
- Sparkler particles drifting upward
- Warm radial gradient brand BG

### B11 tweet-dark — TweetCardV2 with two-line marker
- `wordTimings` + `emphasisWords` already wired
- Cumulative two-line blue selection: `box-decoration-break: clone` + `boxDecorationBreak`
- Just-spoken word gets brighter tip `rgba(29,155,240,0.78)`, trailing tokens dim `rgba(29,155,240,0.34)`
- Text grows naturally across both lines as avatar speaks

### B12 youtube-comment-cta — pixel-match YouTube
- Full YouTube top bar: hamburger + red logo + "YouTube" + IN tag + search w/ mic + bell + account-A
- Video title + view count + ago row
- "137 Comments · Sort by"
- @aisimplified comment input — types keyword char-by-char (12 cps), Comment button glows
- **3 fake top comments BELOW** the input (devbuildslab/buildwithriya/neelvision style) — NEVER leave a black void
- Hand cursor glides to Comment button + clicks with ripple at end

---

## V46 SFX cue palette (locked-in by motion event)

Hand-author `output/breaking/<slug>/sfx-cues-<variant>-final.json` with `_v43_manual: true`. Render-with-heygen.ts respects this flag and skips auto-placement. Each cue must have a 4-word rationale (R5 in decision-rubrics.md).

| Event | SFX | Gain |
|---|---|---|
| Reel-start riser | `7 - SFX Pack EP 1/silex riser.mp3` | -7 |
| Card / element entry | `7 - SFX Pack EP 1/Soft Whoosh 01.wav` | -10 |
| Vault explosion | `7 - SFX Pack EP 1/black ops 2 semtex.wav` | -6 |
| Calendar paper-flip | `Paper Flip Sound Effect.mp3` | -10 |
| Day pop / hard cut | `mixkit-hard-pop-click-2364.wav` | -8 |
| Browser slide-in | `mixkit-cinematic-transition-wind-swoosh-1468.wav` | -8 |
| Mouse click | `Mouse Click Sound Effect.mp3` | -14 |
| Idea spark | `Ding.mp3` | -16 |
| Counter clock-tick | `Clock ticking fast.mp3` | -12 |
| Fire whoosh | `WHOOSH FIRE TRANSITION.mp3` | -8 |
| Final impact | `05 Impact.wav` | -5 |
| Tag swing | `Paper Slide 03.wav` | -10 |
| Marker slash | `swipes.mp3` | -9 |
| Stamp slam | `Heavy object Hit and body thud sound effect.mp3` | -6 |
| **"FREE" cha-ching** | `Cash Register (Kaching) - Sound Effect (HD).mp3` | -7 |
| **Cake reveal** | `party horn.mp3` | -8 |
| Tweet notification | `Apple Notification.wav` | -10 |
| Browser CTA swoosh | `clean-fast-swooshaiff-14784.mp3` | -8 |
| Keyboard typing | `keyboard-typing-5997.mp3` | -10 |
| Button glow ding | `Ding Sound Effect.mp3` | -10 |

**V46 anti-patterns:**
- 5-10 separate candle dings on cake — sounds "funny" and cheap. Use single celebratory `candleLight` spring.
- Mario coin sound at celebration — sounds childish for serious money/brand reveals
- Random auto-binner output (`sfxPlace.ts`) — too chaotic, ~33 cues vs hand-authored ~30 mapped

**Cha-ching is allowed** in V46 because the topic is genuinely a free-deal celebration (literal money moment). For any other topic-class, R5 SFX selector forbids cha-ching.

---

## TweetCardV2 props pattern

Add a `<BRAND>_LAUNCH_TWEET: TweetData` constant in `src/remotion/TweetCardV2.tsx`:

```ts
export const REPLIT_LAUNCH_TWEET: TweetData = {
  authorName: 'Replit',
  authorHandle: 'Replit',
  authorVerified: true,
  profileImageSrc: 'assets/research/replit/replit-profile.jpg',
  body: '<actual tweet body, line-broken>',
  mediaPosterSrc: 'assets/research/replit/replit-tweet-poster.jpg',
  likeCount: 220,
  replyCount: 16,
  postedAt: '12:06 PM · May 1, 2026',
};
```

Download the profile pic via `https://pbs.twimg.com/profile_images/<id>/<hash>.jpg` (NOT the `_normal.jpg` variant — that 404s). Wire `tweetVariant: 'replit'` in v40 props on B11.

---

## Verify (Phase 8 specific to V46)

Always extract verification frames at every redesigned beat (read render-cookbook.md for the scene-aware sampling pattern). Specific V46 confirmations:
- B1 hook visible at scene 0 mid-frame
- B2 vault visible (NOT hero stuck — that means timing slipped, fix script.txt)
- B5 / B6 / B7 mosaic tiles with brand visible at top
- B8 burning counter at mid-frame with NO floating overlay
- B9 stamp visible (not mid-flip — flip happens at midPoint=0.55)
- B10 cake hero, balloons + confetti visible
- B11 tweet two-line blue marker
- B12 YouTube clone with fake comments + cursor
- Avatar visible bottom 40% at every timestamp
- No black gap at seam
