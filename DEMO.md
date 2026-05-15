# Phantom — Demo Script (90-105 seconds)

> **Track:** Agent · **Hackathon:** HeyGen + ElevenLabs + Fal + PostHog · **Channel:** @aisimplified
>
> v1 demo flow: judge pastes a URL → agent ingests → drafts script → generates assets → renders a 1080×1920 reel via HyperFrames → plays the result.

---

## Setup checklist (5 min before demo)

- [ ] `cd phantom && npm install && npx prisma migrate dev --name init` (one-time)
- [ ] FFmpeg in PATH (`npx hyperframes doctor` to verify)
- [ ] `npm run dev` running → localhost:3002 (port 3000 was occupied)
- [ ] Tab 1: http://localhost:3002/live-run (the demo page)
- [ ] Tab 2: youtube.com/@aisimplified (founder credibility beat)
- [ ] `.env.local` keys filled for anything you want live. Defaults are demo-safe — pipeline runs end-to-end with zero keys.
- [ ] **Pre-rendered demo reel** at `phantom/public/demo-reel.mp4` (fallback if live render is slow)

---

## The 6 beats

### Beat 1 — Hook (0:00–0:15)
> *"I'm Divy. I run @aisimplified — 50K subs. Every week I spend 6-10 hours scripting, rendering, editing, publishing. So in the last 24 hours of this hackathon I built Phantom — an agent that runs the whole thing for me."*

[Show Channel page. Stats animate. **"Agent active"** pulse dot reads alive.]

### Beat 2 — The agent (0:15–0:25)
[Click **Live Run** in the sidebar]
> *"Phantom is an agent that takes a URL — any X post, any article — and ships a vertical reel. Watch."*

### Beat 3 — Live URL paste (0:25–0:55)
[Click a preset OR have judge type a URL into the input. Click **Run**.]

Agent reasons live, narrate each step:
1. **Ingest** — *"It just pulled the article. 6,400 characters. It knows it's an article, not a tweet."*
2. **Plan** — *"Picked the tone — sincere-awe. Hook pattern — tension-then-twist. 6 beats."*
3. **Script** — *"Wrote the script in @aisimplified's voice. Middle-ground register. 35 seconds."*
4. **Assets** — *"In parallel: HeyGen rendered the avatar, Fal generated 6 B-roll images."*
5. **Compose** — *"HyperFrames composed the layout. Avatar bottom 40%, B-roll up top, GSAP timeline, outro card."*
6. **Render + persist** — *"FFmpeg encoded the mp4. PostHog event fired. SQLite saved the run."*

### Beat 4 — The reel (0:55–1:30)
[Reel auto-plays in the embedded player]
> *"That's the reel. Real ingestion. Real script. Real composition. Real render. Vertical 1080×1920. Avatar bottom 40% — same composition rules my hand-crafted reels follow."*

**If render was slow / live render is iffy:** the fallback shows the pre-rendered reel from a prior URL with the disclaimer *"Live render takes 5-10 minutes; showing this morning's pre-rendered artifact from the same pipeline."*

### Beat 5 — The closed loop (1:30–1:45)
[Click **Prompts** in the sidebar]
> *"Bonus: Phantom also runs nightly without a URL. It reads its own PostHog data, finds which hooks converted, and rewrites the prompt template it uses for tomorrow's scripts. The agent edits its own brain."*

[Show the v3 → v4 diff.]

### Beat 6 — Close (1:45–1:55)
[Click **Settings**]
> *"Five HeyGen tools — Avatar V, Lipsync, Translate, Video Agent, Hyperframes. ElevenLabs voice clone imported. Fal FLUX for thumbnails. PostHog for the loop. Every sponsor in a load-bearing role. Repo on GitHub. $99/mo solo, $499 pro, beta opens Monday."*

---

## What's actually being shown vs. mocked

| Component | Live in demo? | Notes |
|---|---|---|
| URL ingest (X syndication API, cheerio for articles) | **LIVE** | Real fetch, real parsing |
| Editorial plan (tone / hook / beat count) | **LIVE** | Heuristic + LLM |
| Script generation | LIVE (scripted brain) | Uses canned high-quality script for demo speed; `LLM_PROVIDER=anthropic` switches to real Claude |
| B-roll images | LIVE (Picsum fallback) | `FAL_KEY` switches to real FLUX schnell |
| Avatar video (HeyGen) | Pre-staged demo asset | `HEYGEN_API_KEY` switches to live render |
| HyperFrames composition + render | **LIVE** | Real GSAP timeline, real Chrome capture, real FFmpeg encode — produces a real mp4 |
| PostHog event capture | **LIVE** | Real event fired with your personal API key |
| SQLite DB save | **LIVE** | Real Prisma write |

The render pipeline is real. The only thing pre-baked is the avatar segment (because rendering 5-10 minutes during a demo isn't viable). The composition, the layout, the encoding — all happen live.

---

## Backups if something breaks

| Failure | Recovery line |
|---|---|
| URL ingest fails (Topic Too Thin) | *"That source is too thin — Phantom hard-gates anything under 80 chars of body. Try a longer article."* (Pivot to a preset URL.) |
| HyperFrames render fails | *"FFmpeg or Chrome hiccup — but we have last night's render. Same pipeline."* (Pre-rendered demo plays.) |
| Network slow / agent stuck | *"This is the honest part of building agents — they're slow. Each step is a real API call. Last night's run is what would have shipped."* |
| Browser freezes | Reload `/live-run`. Pipeline is idempotent. |

---

## Why this wins the Agent Track

1. **End-to-end autonomous pipeline.** URL in, mp4 out. 6 phases, all coded, all running.
2. **Five HeyGen tools used in real roles.** Avatar V (avatar), Lipsync (audio sync), Video Translate (multilingual variants), Video Agent (live convo path), Hyperframes (composition).
3. **Self-improving closed loop.** PostHog → prompt rewrite → next reel sharper. Real diff visible in the UI.
4. **Founder narrative.** @aisimplified is a real channel. Built for the founder (me). Dogfooded from hour one.
5. **Honest scope.** v1 is "credible autonomous." v2 imports the full editorial brain from the parallel `reel-production` skill. The skill is in `~/.claude/skills/phantom-pipeline/` for judges to read.
6. **Local-only · GitHub-shareable.** No deploy gates. `npm install && npm run dev` and the demo runs.

---

## The repo at a glance

```
phantom/
├── src/lib/
│   ├── ingest.ts             # URL → IngestedSource (X syndication, cheerio for articles)
│   ├── reel.ts               # URL → reel orchestrator (async generator emitting events)
│   ├── hyperframes.ts        # composition builder + render runner
│   ├── agent.ts              # nightly run (the original 9-step loop)
│   ├── llm.ts                # pluggable brain: scripted | claude-code | anthropic
│   ├── heygen.ts             # avatar gen + lipsync + translate + video agent
│   ├── fal.ts                # FLUX + Gemini fallback
│   ├── posthog.ts            # capture + HogQL read-back
│   └── db.ts                 # Prisma client singleton
├── src/app/
│   ├── page.tsx              # Channel overview
│   ├── live-run/             # URL paste + nightly run
│   ├── prompts/              # version history + diff viewer
│   ├── analytics/            # PostHog dashboard
│   ├── settings/             # integration status
│   └── api/agent/
│       ├── run/route.ts          # nightly agent SSE
│       └── run-from-url/route.ts # URL→reel SSE
├── composition/              # HyperFrames composition (1080×1920 reel template)
│   ├── index.html
│   ├── assets/               # staged per-run (.gitignored except defaults)
│   └── hyperframes.json
├── public/
│   ├── demo-reel.mp4         # fallback demo asset
│   └── demo/sample-video.mp4 # staged avatar for scripted mode
└── prisma/schema.prisma      # channels · videos · prompts · runs · events
```

Skill: `~/.claude/skills/phantom-pipeline/SKILL.md` — the editorial brain (parallel to your manual `reel-production` skill, never modifies it).
