# Phantom

> The autonomous creator that runs your YouTube channel.

Phantom is an AI agent that picks topics, drafts scripts in your voice, generates AI avatar videos with HeyGen, creates thumbnail variants with Fal, "publishes," and reads engagement back from PostHog — then **rewrites its own prompt template** to optimize the next batch. The agent improves week over week from real funnel data.

Built for the **HeyGen Hackathon** (May 14-15, 2026) - **Agent Track**.

---

## The loop

```
+-------------------------------------------------------------+
| 1. READ analytics (PostHog HogQL)                           |
| 2. UPDATE prompt template (winning hooks up-weighted)       |
| 3. PICK next topic (trending / audience signals)            |
| 4. DRAFT script (Claude w/ new prompt template)             |
| 5. GENERATE B-roll + thumbnails (Fal FLUX)                  |
| 6. RENDER avatar video (HeyGen Avatar V + cloned voice)     |
| 7. TRANSLATE to top languages (HeyGen Video Translate)      |
| 8. PUBLISH (or queue) + fire analytics events               |
| 9. Tomorrow: loop with sharper prompts                      |
+-------------------------------------------------------------+
```

## Stack

| Layer | Tool |
|---|---|
| Frontend / API | Next.js 15 + TypeScript + Tailwind |
| DB | Prisma + SQLite |
| Agent reasoning | Vercel AI SDK + Anthropic Claude |
| Avatar + lipsync + translate + live calls | **HeyGen** (Avatar V, Lipsync, Video Translate, Video Agent, Hyperframes) |
| Voice cloning | **ElevenLabs** (imported into HeyGen as a private voice) |
| Image gen (thumbnails, B-roll) | **Fal** (FLUX schnell) |
| Analytics + read-back | **PostHog** (events + HogQL) |

## Setup

```bash
cp .env.example .env.local
# Fill in: ANTHROPIC_API_KEY, HEYGEN_API_KEY, FAL_KEY, POSTHOG_API_KEY

npm install
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000.

## Sponsor usage

| Sponsor | Where it's used |
|---|---|
| HeyGen | Every video Phantom generates (Avatar V) - multilingual variants (Video Translate) - live host interviews (Video Agent) - scene composition (Hyperframes) - audio sync (Lipsync) |
| ElevenLabs | Cloned voice (`Raunak M`) imported into HeyGen as a private voice |
| Fal | Thumbnail A/B variants + per-segment B-roll (FLUX schnell) |
| PostHog | Event capture for every video - HogQL read-back fuels the prompt-rewrite loop |
