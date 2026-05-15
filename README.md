# Phantom — Autonomous Reel Producer

> Paste an X post or article URL → autonomous AI agent ingests it, writes a script, generates assets, renders the reel, and gives you a downloadable mp4.

Built for the **HeyGen Hackathon** (May 14-15, 2026) — **Agent Track**.
Local-only. Clone, run, paste a URL.

---

## What it does

Open `http://localhost:3002/live-run`, paste any X post (with or without video) or news article URL, and click Run.

Behind the scenes, Phantom delegates the entire reel pipeline to Claude Code's `reel-production` skill running as a subprocess. The skill does everything:

1. **Editorial intake** — 12-field checklist: topic class, emotional thesis, audience lean, pacing, stakes, hype charge, tonal palette, share trigger, frame-zero promise.
2. **Source-demo catalog** — if the URL has video, dense-scans frame-by-frame and catalogs natural in/out timestamps per demonstrable feature.
3. **7-rubric pass** — structure, tone, hook archetype, component, image style, motion verb, effects + SFX.
4. **Script draft** — middle-ground Varun register (12-18 words/beat, forbidden openers/closers, channel-handle-aware), visual plan, SFX cues.
5. **Critique pass** — 20 auto-fail signals (course-bro CTAs, tonal clashes, mech-default repeats, retention misses); revises up to 3 passes before render gate.
6. **Asset generation** — Gemini Nano Banana stills, Veo image-to-video animations, **autonomous HeyGen avatar render via API** (avatar + cloned voice + green BG, no manual handoff), and source-clip cuts at natural durations.
7. **Final composition + render** — Whisper word-level pinning, SFX placement on real word boundaries, full video render, mobile-safe sibling encode, frame verification.

The agent does **zero hardcoded editorial** — every tone / hook / structure / SFX decision is made per URL via the skill's reference catalogs.

---

## Quick start

```bash
# 1. Clone
git clone https://github.com/divygoyal/phantom
cd phantom

# 2. Install
npm install
npx prisma migrate dev --name init

# 3. Set up env
cp .env.example .env.local
# Edit .env.local — at minimum:
#   HEYGEN_API_KEY=sk_V2_...
#   GEMINI_API_KEY=AIza...      (free, AI Studio key)
#   POSTHOG_API_KEY=phx_...     (free, personal key)
#   GROQ_API_KEY=gsk_...        (free, Whisper transcription)

# 4. Start dev server
npm run dev   # → http://localhost:3002
```

Open `http://localhost:3002/live-run`, paste an X URL or article URL, click **Run**.

---

## Requirements (clone-and-run reality)

| Requirement | Why |
|---|---|
| **Claude Code CLI** on PATH (`claude --print` must work) | Phantom shells out to invoke the skill |
| **`reel-production` skill** at `~/.claude/skills/reel-production/` | The editorial brain. Ship of Theseus — years of taste compressed into rubrics |
| **FFmpeg + ffprobe** on PATH | Source-video cuts, chroma-key, mobile encode. Windows: `winget install Gyan.FFmpeg` |
| **HeyGen API key** | Avatar renders. Configure `HEYGEN_AVATAR_LOOK_ID` + `HEYGEN_VOICE_ID` (voice can be a cloned ElevenLabs voice imported into HeyGen) |
| **Gemini API key** (free) | Nano Banana stills for B-roll beats not covered by source video |
| **PostHog personal key** (free) | Event capture + HogQL read-back loop |
| **Groq API key** (free) | Whisper word-level transcription for caption sync |
| **Node 22+, npm 11+** | Modern toolchain — Next.js 16 + Prisma 6 |

---

## Two run modes

| Mode | Latency | Quality | What runs |
|---|---|---|---|
| **`RUN_VIA_SKILL=true`** (recommended) | 15-30 min | Matches hand-crafted @aisimplified reels | Subprocess invokes the `reel-production` skill end-to-end |
| `RUN_VIA_SKILL=false` | 3-5 min | "Credible AI demo" | Inline TS pipeline: ingest → Gemini b-roll → HeyGen avatar → ffmpeg chroma → HTML composition |

Inline mode is useful for fast smoke tests; skill mode is what you ship.

Toggle in `.env.local`.

---

## What the live-run UI shows

`/live-run` streams Server-Sent Events from the agent as work happens:

- **Ingest** — X syndication or article extraction
- **Editorial plan** — tone, hook archetype, beat count
- **Source-video catalog** — dense-scan results (when URL has video)
- **Script** — beats with word counts
- **Assets** — Gemini stills, source-clip cuts, HeyGen render status
- **Skill heartbeat** — 30-second pulses during long subprocess waits, so the UI doesn't look frozen
- **Reel rendered** — embedded video player + Download mp4 button

When the agent finishes, the player loads the final reel automatically. Click **Download mp4** to save.

---

## Architecture

```
phantom/                          # the Next.js app
├── src/lib/
│   ├── reel.ts                   # async-generator pipeline; branches on RUN_VIA_SKILL
│   ├── skill-runner.ts           # spawns claude --print with the skill prompt
│   ├── source-video.ts           # downloads X video → ffmpeg dense-scan + cut
│   ├── ingest.ts                 # X syndication / cheerio / Reddit / YouTube
│   ├── hyperframes.ts            # inline-mode composition (1080×1920)
│   ├── heygen.ts                 # avatar render + lipsync + translate
│   ├── llm.ts                    # scripted | claude-code | anthropic brain
│   ├── fal.ts                    # FLUX + Gemini Nano Banana fallback
│   ├── posthog.ts                # capture + HogQL read-back
│   ├── video.ts                  # chroma-key via ffmpeg
│   └── db.ts                     # Prisma singleton
├── src/app/
│   ├── live-run/                 # URL paste + SSE timeline + video player
│   ├── api/agent/run-from-url/   # POST endpoint streaming SSE
│   └── (rest: landing, analytics, prompts, settings)
└── public/reels/<slug>/final.mp4 # output per run (downloadable)
```

The skill expects this workspace state in the parent directory (`heygen trial/`):

```
heygen trial/
├── assets/research/<brand>/      # per-reel source clips + Gemini stills
├── assets/sfx/                   # SFX library
├── input/heygen-greenscreen.mp4  # avatar mp4 (skill writes this via HeyGen API)
├── output/breaking/<slug>/       # per-run brief, script, plan, SFX cues, critique log
├── output/final-video.mp4        # master output (auto-copied to phantom/public/reels/)
└── scripts/build-<brand>-plan.mts # per-run plan builder (skill writes this)
```

---

## How the skill is invoked

`src/lib/skill-runner.ts` builds a prompt that tells Claude in the subprocess:

1. Use the `reel-production` skill (auto-discovered at `~/.claude/skills/reel-production/`)
2. Run all phases autonomously — make every editorial decision (no human escalation)
3. For the HeyGen avatar: call the v2 API directly with `HEYGEN_API_KEY` from env, poll until completed, save to `input/heygen-greenscreen.mp4`
4. Final output to `output/final-video.mp4` + mobile-safe sibling

Phantom then copies the result to `phantom/public/reels/<slug>/final.mp4` so the FE can serve it.

---

## Limitations (clone-and-run reality)

- The skill is **machine-bound to your Claude Pro subscription** — `claude --print` uses your auth. Multi-user/server deploy needs SDK-based auth.
- A **15-30 minute SSE connection** isn't viable for production. For real product, queue + webhooks needed.
- Avatar choice: some HeyGen photo avatars silently ignore `background` overrides. If the avatar you picked falls back to natural BG, use HeyGen's template editor to create a chroma-locked template and pass scripts via API variables.

These are real but acceptable for the clone-and-run / hackathon use case.

---

## License + credits

Built by [@devdivygoyal](https://x.com/devdivygoyal) for the HeyGen Hackathon. The `reel-production` skill is the editorial brain — years of iteration compressed into rubrics + critique loops.
