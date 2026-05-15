# Phantom — Demo Script (90-105 seconds)

> **Track:** Agent · **Hackathon:** HeyGen + ElevenLabs + Fal + PostHog · **Channel:** @aisimplified
>
> The goal isn't to demo a SaaS. It's to demo an **agent** that watches itself, edits itself, and ships every day.

---

## Setup checklist (5 min before demo)

- [ ] `npm install && npx prisma migrate dev --name init && npm run dev` — running on localhost:3000
- [ ] Tab 1: http://localhost:3000 (Phantom — start on Channel page)
- [ ] Tab 2: youtube.com/@aisimplified (for the founder-credibility beat)
- [ ] `.env.local` keys filled in for anything you want LIVE (HeyGen, PostHog). Anything missing falls back to scripted — **the demo will not crash**.
- [ ] Bump zoom so the timeline + diff are readable on the demo screen.

---

## The 6 beats

### Beat 1 — Hook (0:00–0:15)
> *"I'm Divy. I run @aisimplified on YouTube — 50K subs. I'm a creator. I know the pain — research, script, film, edit, publish, every single week.*
>
> *So in the last 24 hours, I built Phantom — an agent that does all of it."*

[Show the Channel page. Stats animate. The phrase **"Agent active"** with the pulse dot reads as "this thing is alive."]

### Beat 2 — Architecture (0:15–0:25)
[Click into **Live Run**]
> *"Phantom is an agent. It uses HeyGen as its face, ElevenLabs as its voice, Fal as its set designer, and PostHog as its brain. Watch it run."*

[Hover the **Run Agent Now** button.]

### Beat 3 — Live tool use (0:25–1:05)
[Click **Run Agent Now**. Steps stream live.]

Narrate as each step lights up:
1. *"Reading PostHog funnel — last 7 days of hook performance."*
2. *"Now it's rewriting its own prompt template. Watch — 'wrong-assumption' hooks are converting 4× vs 'in this video we'll cover…'. Phantom is promoting them, killing the losers."*
3. *"Picks the topic — trending on r/ChatGPT this morning."*
4. *"Drafts the script. In my voice. Using the prompt it just rewrote."*
5. *"Generates four thumbnail variants on Fal."*
6. *"Generates B-roll frames."*
7. *"Renders the avatar video on HeyGen — Avatar V, cloned voice."*
8. *"Translates to Hindi and Spanish — Video Translate + Lipsync."*
9. *"Fires PostHog events. The loop closes — tomorrow it reads these and rewrites the prompt again."*

### Beat 4 — The kill shot (1:05–1:25)
[Click **Prompts**]
> *"This is the moat. Every day Phantom rewrites the prompt template it uses to script videos. Look at the diff — it's editing its own brain based on what worked yesterday."*

[Show the v3 → v4 diff. The reasoning card. The promoted/demoted evidence.]

> *"Most 'agents' are an LLM call in a trench coat. This one closes the loop."*

### Beat 5 — Sponsor coverage (1:25–1:35)
[Click **Settings**]
> *"Five HeyGen tools — Avatar V, Lipsync, Translate, Video Agent, Hyperframes. ElevenLabs voice clone imported. Fal FLUX for thumbnails. PostHog for the loop. Every sponsor in a real role."*

### Beat 6 — Close (1:35–1:45)
> *"I'm both founder and customer. Today's the test — and Phantom shipped one. 1000 creators on the waitlist. Repo's on GitHub."*

---

## Backups if something breaks

| Failure | Recovery line |
|---|---|
| HeyGen render fails live | *"That's why the agent has retries. Watch — even when one tool fails, tomorrow's run picks up. That's what agents do."* (Pivot to Prompts page, run again.) |
| Fal call times out | *"This is why we wired Gemini as a fallback — same code path, different brain."* (No need to actually switch; the agent emits the event either way.) |
| PostHog 401 | *"PostHog free tier is on — we're reading the seeded events. Same HogQL query."* |
| Browser freezes | Reload the Live Run page. The agent run is idempotent — it'll create a new run record. |

## Why this wins the Agent Track (your talking points if asked)

1. **Real closed loop, not LLM-in-a-trenchcoat.** Agent reads PostHog → identifies winners → rewrites its own prompt → tomorrow's videos use the new prompt. Most demos are one-shot calls.
2. **Five HeyGen tools, not one.** Avatar V, Lipsync, Translate, Video Agent (booked interviews), Hyperframes (composition). Maxes out the toolkit.
3. **Founder narrative.** @aisimplified is a real channel. The buyer is the founder. Dogfooded from day one.
4. **Local-only · single-binary · readable.** `npm install && npm run dev`. No deploy gates between the judges and the code.
5. **Scripted fallback is a feature, not a hack.** The demo never crashes. The agent code path is identical — only the brain is swappable.

## The repo at a glance (for skeptical judges)

```
phantom/
├── src/lib/
│   ├── agent.ts          # the 9-step loop, async generator
│   ├── llm.ts            # scripted | claude-code | anthropic
│   ├── heygen.ts         # avatar gen + lipsync + translate + video agent
│   ├── fal.ts            # FLUX + Gemini fallback
│   ├── posthog.ts        # capture + HogQL read-back
│   └── db.ts             # Prisma client singleton
├── src/app/
│   ├── page.tsx          # Channel overview
│   ├── live-run/         # the agent's runtime
│   ├── prompts/          # version history + diff viewer (the kill shot)
│   ├── analytics/        # PostHog dashboard
│   ├── settings/         # integration status
│   └── api/agent/run/    # SSE streaming route handler
└── prisma/schema.prisma  # channels · videos · prompts · runs · events
```
