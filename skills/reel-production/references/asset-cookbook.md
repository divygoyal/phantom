# Asset cookbook — where to fetch X, AI gen pipeline, cost matrix

Loaded at Phase 0 (asset sourcing during intake) and Phase 4 (asset generation). Battle-tested patterns for fetching real-world content + AI gen pricing.

---

## §R. Asset pipeline — current best (May 2026)

| Use | Tool | Cost |
|---|---|---|
| **Hero shot** image-to-video | Veo 3.1 (best lip sync, cinematic, audio included) | $0.20/s |
| **Default batch** image-to-video | Kling 3.0 (80-90% of Veo at 30-40% cost) | ~$0.10/s |
| Best editing-heavy workflow | Runway Gen-4.5 | $0.40-1.00/5s |
| Stills (1K-2K) | Gemini 3 Pro Image Preview (Nano Banana Pro) | $0.134/img |
| Stills (4K) | Gemini 3 Pro Image Preview | $0.24/img (batch halves) |
| Fast prototyping local | SDXL Turbo (1-step, `guidance_scale=0`, 512×512) | free, 83ms/img on H100 |
| Background removal (simple) | rembg (free, local, U2Net) | free |
| Background removal (hair/glass) | ClipDrop API | $0.12-0.18/img |
| Upscaling batch | Real-ESRGAN 4× | free, ~5-10s on RTX 5080 |
| Upscaling hero face | Topaz Video AI | $299/yr |

**Veo 2 still works** (`veo-2.0-generate-001`, durationSeconds 5-8) when you need cheaper or 9:16 output. Veo refuses real-person animation (Trump/Sam/Elon) — fall back to `HeroScribblePane` CSS-motion still (see render-cookbook.md).

---

## §DD. Asset-fetching cookbook

### DD.1 X / Twitter (battle-tested)

| Need | Pattern |
|---|---|
| Tweet text + metadata | `https://cdn.syndication.twimg.com/tweet-result?id={ID}&token={TOKEN}` (token = `((Number(id)/1e15)*Math.PI).toString(6**2).replace(/(0+\|\.)/g,'')`) |
| Tweet videos multi-bitrate | `mediaDetails[i].video_info.variants[]` — pick highest-bitrate `video/mp4` |
| Tweet images full-res | `pbs.twimg.com/media/{ID}?format=jpg&name=orig` (NOT `name=small`) |
| Profile pic full-size | strip `_normal` from URL → 400×400 (or `_400x400.jpg`) |
| Reply chains / quote tweets / view counts | Playwright + .env JSON cookie array (auth_token + ct0); virtualization-aware scroll-and-capture into `window.__seenUrls` Set |
| Real engagement counts | GraphQL `TweetDetail` + `x-csrf-token: {ct0}` + bearer; `views.count` per tweet entry |
| X Spaces audio | `twspace-dl -i {URL} -c cookies.txt` or `yt-dlp --cookies cookies.txt {URL}` |
| Bulk tweet scrape | `twscrape` (vladkens) with rotating burner pool; or paid `twitterapi.io` ($0.15/1k) |

### DD.2 Instagram

| Need | Pattern |
|---|---|
| Reels download | `gallery-dl --cookies-from-browser firefox {REEL_URL}` (Firefox closed on Windows) OR `instaloader --login USER -- -B{shortcode}` |
| Reel cover (poster) | `ffmpeg -i reel.mp4 -vframes 1 -q:v 2 cover.jpg` |
| Reel transcripts | Whisper Turbo: `whisper reel.mp4 --model turbo --output_format srt` (5.4× faster than large-v3); or `faster-whisper` (CTranslate2) at INT8 |
| Profile bio + counts | `instaloader.Profile.from_username(L.context, "user").{biography, followers, mediacount, profile_pic_url}` |
| Comments | `instaloader --comments USER -- -{shortcode}` |
| Hashtag exploration | `instaloader "#aiart"` (~70 posts before rate-limit) or Apify (~$0.20/1k) |

### DD.3 TikTok

| Need | Pattern |
|---|---|
| Video without watermark | `yt-dlp {URL}` (TikTok's source MP4 has no watermark) |
| Metadata (likes, plays) | `yt-dlp --write-info-json --skip-download {URL}` |
| Trending sounds | `tokchart.com` scrape OR Apify `clockworks/tiktok-sound-scraper` ($0.30/1k) OR `TikTokApi` (davidteather) with `ms_token` from logged-in session |
| Hashtag enumeration | `yt-dlp "https://www.tiktok.com/tag/{tag}" --flat-playlist --write-info-json --skip-download` |
| Profile + bio | parse `<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__">` from HTML |

### DD.4 YouTube

| Need | Pattern |
|---|---|
| Full-quality | `yt-dlp -f "bv*[height<=1080]+ba/b" --merge-output-format mp4 {URL}` |
| Time-range clip | `yt-dlp --download-sections "*00:01:30-00:01:45" {URL}` (byte-range pull) |
| Audio-only | `yt-dlp -f bestaudio -x --audio-format mp3 {URL}` |
| Thumbnails | `https://i.ytimg.com/vi/{ID}/maxresdefault.jpg` (fallbacks: sd / hq / mq / default) |
| Comments | YouTube Data API `commentThreads.list` (1 unit/call, 10k/day default quota) |
| Transcripts | `youtube-transcript-api` (free, no key, no quota) — fallback `yt-dlp --write-auto-sub --sub-format vtt --skip-download` |

### DD.5 Reddit / News / Articles

| Need | Pattern |
|---|---|
| Reddit post + top comments | PRAW (`pip install praw`, register script app); 100 QPM with OAuth; `submission.comments.replace_more(limit=0)` |
| v.redd.it videos (DASH) | `yt-dlp {REDDIT_URL}` |
| Article text extraction | `trafilatura -u {URL}` (most accurate per ScrapingHub benchmark) — or `newspaper4k` (community fork) |
| Article hero image | `metadata_parser.MetadataParser(url=url).get_metadata_link('image')` |
| Article screenshot | Playwright `page.screenshot(full_page=True)` or `page.locator('article').screenshot()` |
| Google News RSS | `https://news.google.com/rss/search?q={QUERY}&hl=en-US&gl=US&ceid=US:en` (free, parse with feedparser) |
| HackerNews | `https://hn.algolia.com/api/v1/search?tags=front_page&query=AI` (no auth, no rate limit) |

### DD.6 GitHub / Stock / Brand

| Need | Pattern |
|---|---|
| GitHub README | `gh api repos/OWNER/REPO/readme --jq .download_url` |
| GitHub commit screenshots | Playwright with `user_session` cookie + screenshot `.timeline-comment` |
| StackOverflow Q&A | Stack Exchange API `/2.3/questions/{ID}?site=stackoverflow&filter=withbody` (10k/day with key) |
| Brand logos | Brandfetch `https://cdn.brandfetch.io/{domain}` (500k req/mo free) OR Logo.dev (`img.logo.dev/{domain}?token=`) |
| Wikipedia (when not blocked) | REST `/api/rest_v1/page/summary/{title}` — **MUST send User-Agent: ReelBot/1.0 (litelae@gmail.com)** or 403 |
| Stock photos | Pexels API (free 200/hr, 20k/mo, photos+videos), Unsplash (5000/hr after review), Pixabay (free, self-host allowed) |
| SFX free | Sonniss GDC `https://gdc.sonniss.com` (annual 7.47GB / 347 WAVs in 2026, no AI/ML training use), Freesound API (token tier) |

### DD.7 AI gen pipelines (full pricing matrix)

| Need | Tool | Cost |
|---|---|---|
| Photoreal stills with text rendering | **Gemini 3 Pro Image Preview (Nano Banana Pro)** — best for text/UI/logos | ~$0.024/img 1K, $0.060 2K, $0.134 4K |
| Image-to-video hero | **Veo 3.1** (native audio, 4/6/8s) | $0.40/sec 1080p |
| Image-to-video cheap iteration | **Veo 3.1 Light** | $0.05/clip |
| Image-to-video B-roll batch | **Kling 3.0** (Standard $0.168/sec, Pro $0.224/sec) | 30-40% of Veo cost |
| Editing-heavy (frame-level edit) | **Runway Gen-4.5 + Aleph** | $15-35/mo |
| Local fast iteration | SDXL Turbo (1-step, `guidance_scale=0.0`, 512×512) | free, RTX 3060+ |
| Background removal | rembg `birefnet-general` model | free, local |
| Upscaling | Real-ESRGAN NCNN-Vulkan `realesrgan-x4plus` | free |
| Face swap | Roop-Unleashed (InsightFace `inswapper_128.onnx` + GFPGAN) | free |
| Watermark removal | LaMa Cleaner / IOPaint (Fourier-conv inpainting) | free |
| AI music | Suno V5.5 ($10/mo Pro = 500 gens, commercial rights) | $0.02-$0.06/track |
| Voice clone | ElevenLabs Creator $22/mo (Instant Voice Clone unlock) | per-character |
| HeyGen avatar | Business plan $149/mo for custom avatar | $29 one-time Instant Avatar |

### DD.7 Celebrity reference photos for AI-cameo hooks (validated)

**For AA.18 / AA.19 hook archetypes** that need a real-celebrity reference image to feed into Gemini Imagen / Meta AI / Sora 2:

| Need | Pattern | Notes |
|---|---|---|
| Twitter profile pic of a public figure (CEO, founder, creator) | `curl -A "Mozilla/5.0..." "https://unavatar.io/twitter/{handle}" -o ref.jpg` | **The reliable path** — returns the current X profile pic. Validated for `sama` (Sam Altman), works for any public X handle. ~30KB JPG, 400×400. |
| Wikipedia commons (CC-licensed press photo) | `curl -A "ReelBot/1.0 (email)" "https://upload.wikimedia.org/wikipedia/commons/{path}.jpg" -o ref.jpg` | Often returns 1.9KB HTML error page or 114-byte empty response — **unreliable in practice**. Use unavatar.io instead. |
| Press footage frame (cleanest face) | `yt-dlp "https://youtube.com/watch?v={id}" + ffmpeg -ss <t> -frames:v 1 ref.png` | For when the public figure has a known clean shot in a YouTube interview (Lex Fridman, Bloomberg, Dev Day keynote) |

**Naming convention**: `assets/research/<slug>/celeb-<handle>-real.jpg`. The `-real` suffix matters — distinguishes from any prior AI-generated "celeb-archetype" assets that might be mislabeled (e.g. `assets/research/arrakis/befores/sam_altman.png` is **NOT** Sam Altman, it's an AI-generated tech-archetype from a prior reel).

**Reference-image quality predictors:**
- Face must occupy ≥50% of frame (close to head-and-shoulders crop)
- Neutral or slight smile expression preserves best (extreme expressions don't generalize)
- Even lighting (no harsh shadows on the face)
- 400×400 minimum; 1024×1024 ideal
- Recognizability: viewer must identify the subject in <100ms; pick a profile pic version of the celeb that looks most like their public-image baseline

**Petdex shipment validation**: Sam Altman's current X profile pic (cockpit selfie with goggles on his forehead) was used as ref. Gemini Nano Banana Pro preserved enough features to read as "Sam-adjacent" across all 5 generated variants. The goggles even carried into v7 (the assembly-line variant), where all 4 clones have rainbow goggles on their foreheads — a happy accident that strengthens the recognition stack.

### DD.8 Instagram reel download (cookies via .env)

For analyzing competitor / inspirational reels (e.g. studying Varun Mayya's hook patterns frame-by-frame):

```ts
// Pattern: parse JSON [...] cookie blocks from .env, filter to .instagram.com,
// load into Playwright context, navigate, find <video> src, download.
// See scripts/download-ig-reel.mts for the full implementation.

REEL_URL=https://www.instagram.com/reel/{shortcode}/ npx tsx scripts/download-ig-reel.mts
```

**Cookie format in `.env`**: paste the full JSON cookie array (as exported from a browser extension like Cookie Editor) into `.env`. The script auto-detects all JSON `[...]` arrays in the file, filters by domain.

**Common gotchas:**
- Instagram blob: URLs require `fetch(url)` inside the page context (not raw `ctx.request.get()`); the Playwright script handles both
- `sameSite: "no_restriction"` from cookie editor must be normalized to `'None'` for Playwright
- 4-min wait timeout is plenty for IG video downloads (CDN is fast)

**Frame analysis pipeline** (after download):
```bash
# Contact sheet — entire reel at 1fps in one image (scan visually for celebrity faces, transitions)
ffmpeg -y -i reel.mp4 -vf "fps=1,scale=180:-1,tile=11x12" -frames:v 1 contact-sheet.png

# Dense sample at suspected hook moments (every 0.25s through first 10s)
for t in 0.25 0.5 0.75 ... 9.75; do
  ffmpeg -y -ss $t -i reel.mp4 -frames:v 1 t${t}s.png
done
```

This is how the Varun pattern was decoded — contact sheet first, then dense sampling around suspected celebrity moments. The Multi-Sundar at t=5.5s was found this way.

### DD.9 Critical gotchas

- **`_normal.jpg` strip** for Twitter profile pics → free upgrade to 400×400
- **Wikipedia 403** = missing UA. Set `User-Agent: ReelBot/1.0 (litelae@gmail.com)` globally
- **Whisper Turbo** is the right default (5.4× faster, negligible accuracy loss)
- **Sonniss GDC license forbids AI/ML training** — only use as SFX, never train on
- **TikTok original MP4 has no watermark** — yt-dlp pulls clean
- **fal.ai is 30-50% cheaper than Replicate** with more models (default new gen work to fal)
- **Veo 3.1 Light at $0.05/clip** is cheapest credible model — first-pass before committing to Veo 3.1 full
- **Cloudflare blocks**: try `curl_cffi impersonate="chrome120"` first → Camoufox/Patchright (browser-binary patches) → paid SERP/scrape API. Plain Playwright + stealth loses ~60% of the time on protected sites in 2026
- **gallery-dl `--cookies-from-browser firefox`** requires Firefox closed on Windows due to file locking

---

## V47 asset-sourcing additions (showcase reels)

### Pulling real X.com replies
The `.env` file contains a JSON cookie array with `.x.com` cookies. Parse all `[ … ]` blocks in `.env`, filter `.x.com` domain entries, load into Playwright context. Then incrementally scroll-and-capture (X virtualizes — articles unmount on scroll, so collect URLs into `window.__seenUrls` Set as you scroll, don't try to query all at once at the end). Download images via the same authenticated `ctx.request.get()`, NOT raw `https.get` (X blocks unauth direct fetches with 404). Reference: `scripts/pull-x-replies-arrakis.mts`.

### When Wikipedia / brand CDNs block curl
Symptom: 400/403/429 status, HTML error pages saved as .jpg. Workaround: skip Wikimedia entirely and use **Gemini Nano Banana Pro to generate photo-realistic equivalents**. Same image-source pipeline as scribble AFTERs, so visual coherence is automatic. Reference: `scripts/gen-arrakis-befores.mts` for 9-batch photo-realistic gen prompts.

### Veo 2 face-detection refusals
Veo 2 refuses to animate stills with recognizable real-person faces (Trump, Sam Altman, Elon). Symptom: "No video returned" with no specific error. Workaround: build a CSS-based `HeroScribblePane` layout that takes the static PNG and adds procedural breathing/wobble (scale wiggle + pendulum rotation + jitter). See render-cookbook.md.
