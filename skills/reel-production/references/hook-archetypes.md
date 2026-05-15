# Hook archetypes — 12 archetypes + 132 visual hooks

Loaded by R1 in `decision-rubrics.md` after the rubric resolves to a chosen archetype + visual template. Pick by archetype number; visual templates are catalogued by AA-section.

---

## Selector tree (top-of-doc reference)

R1 already resolved which archetype + AA-section. This doc gives the worked content. The selector logic itself lives in `decision-rubrics.md` R1.

Anti-openers (NEVER word 1-3): Hi, Hey, So, Today, Welcome, Let me, I want to talk about. All read as YouTube long-form intros and trip critique auto-fail #2.

---

## §A. The 12 archetypes (by performance ranking)

OpusClip analyzed 34,635 clips Jan-Mar 2026. Top hook = Product/Outcome Showcase, avg 6,037 views/clip = 2× lowest-ranked.

| # | Archetype | Word count | When to use | Example template |
|---|---|---|---|---|
| 1 | **Product/Outcome Showcase** (top performer, 2× views) | 5-15 | Visual payoff in 2s | "This new AI just turned my voice into a song in 4 seconds." |
| 2 | **Authority + Curiosity Gap + Promise** | 12-20 | You can claim time-in-domain | "I've tested 100 AI tools. Three just made the rest obsolete." |
| 3 | **Contrarian** (Here's why X is actually Y) | 6-12 | Audience holds the belief | "Everyone says GPT-5 killed prompt engineering. Wrong, here's proof." |
| 4 | **Specific Number** | 8-18 | You have a real measurement | "I shipped 7 reels with this template. 6 broke 100K." |
| 5 | **Imperative ("Stop scrolling if…")** | 3-8 | Genuine stop-moment | "Stop scrolling if you make videos with AI." |
| 6 | **Negative Bias / Mistake** | 8-14 | Educational, loss-aversion | "3 things you're doing wrong with Veo 3 — #2 is killing reach." |
| 7 | **Breaking-News / "Just Dropped"** | 4-10 | Time-sensitive AI news | "OpenAI just dropped this 30 minutes ago and nobody's talking about it." |
| 8 | **"I tried X for Y days"** | 8-15 | Personal experiment arc | "I let Claude run my workflow for 7 days. This is what broke." |
| 9 | **Curiosity Gap (Open Loop)** | 6-14 | Multi-beat reveal (Zeigarnik) | "Apparently, this AI can read your face and write the email for you." |
| 10 | **"Everyone is doing X"** | 5-10 | FOMO + social proof | "Everyone on TikTok is using Sora 2 wrong. Here's the prompt that fixes it." |
| 11 | **Pattern Interrupt** | flexible | Shock/glitch/unexpected | sudden BG color flash, dropped-object cut, micro-mystery close-up |
| 12 | **In-Medias-Res** | flexible | Drop mid-action without setup | "...so then I deleted the email" → cut to context |

**For @aisimplified:** archetypes #1, #4, #7, #9 hit hardest because they pair with the audience's frontier-tool literacy. Archetypes #5 (Imperative) and #10 (Everyone-is-doing-X) require careful pairing — audience reads them as low-effort if not paired with a genuinely contrarian frame.

---

## §AA. Visual hook archetype catalog (132 hooks)

Pick a category that matches your topic, pick a hook, build it. Each row = name · what's on screen at frame 0 · the 0-1.5s motion · who uses it · primary asset source.

### AA.1 Brand-color flash hooks (the @vaibhavsisinty interrupt — 4 frames @ 30fps = ≤200ms)

| # | Name | Visual | Motion | Who | Source |
|---|---|---|---|---|---|
| 1 | OrangeSaturationSlap | Solid `#FF6A00` | 4f hold → 2f white → cut to hero | @vaibhavsisinty, @growthschool | CSS only |
| 2 | RedAlertStrobe | Solid `#E10600` | red↔black at 2f intervals × 4 | breaking-news creators | CSS only |
| 3 | RGBCycleGlitch | Red 3f → Blue 3f → Green 3f → cut | `Math.floor(frame/3) % 3` | @sammasmusic | CSS only |
| 4 | DualColorVerticalSplit | Left orange / right blue, closing inward | width interp 50%→0% | @aliabdaal vs-content | CSS |
| 5 | StrobeToBlackPulse | Yellow `#FFFF00` strobing 1f on/off × 6 | hard zoom-in to hero | EDM/hype | CSS |
| 6 | SaturationDrain | Hyper-saturated photo desaturating to B&W | `saturate(2.5→0)` over 18f | @minchoi reveals | Gemini still |
| 7 | CyanWashFrame | `#00E5FF` flash | 3f flash → diagonal swipe | SaaS B2B | CSS |
| 8 | GradientBurstRadial | Yellow→orange radial expanding | `radial-gradient(... [10→200]%)` | finance/wealth | CSS |
| 9 | BrandHexFlashLogo | Channel hex + tiny logo punch-in | spring scale 0→1 + wipe-off | brand-equity | logo PNG |
| 10 | LightningFlashWhite | Pure `#FFFFFF` 2f-1f-2f sequence | scene cut | revelation hooks | CSS |

### AA.2 AI-image hero hooks (Gemini still + Veo/Kling i2v)

| # | Name | Visual | Motion | Who | Source |
|---|---|---|---|---|---|
| 11 | CrackedIPhoneOnConcrete | Shattered iPhone on grey concrete | Veo 10% dolly-in + flicker | problem-state | Gemini |
| 12 | SmashedLaptopCoffee | Folded MacBook + coffee spill | Veo: liquid spreads, steam rises | corporate-pain | Gemini |
| 13 | BigNumberFloatingChrome | "$10,000,000" chrome 3D in nebula | Veo: rotate 5° on Y, lens flare | revenue/income | Gemini |
| 14 | ObjectMorphLemonTennis | Lemon → tennis ball | Veo first+last frame morph | product comparison | Gemini ×2 |
| 15 | LogoAsBronzeStatue | Logo as patinated bronze in museum | Veo orbit 8°, dust motes | authority/legacy | Gemini |
| 16 | FictionalProductMockup | "ChatGPT Phone" hero shot | Veo 5% push-in | speculation/rumor | Gemini |
| 17 | TimeMagazineCover | Glossy TIME cover with hero photo | Veo: finger flips cover at 1.2s | authority/credibility | Gemini |
| 18 | NewspaperFrontPage | Folded NYT with "OPENAI ACQUIRED $3T" | Veo: coffee steam, paper curl | breaking-news | Gemini |
| 19 | WantedPosterOldWest | Distressed parchment "$1M REWARD" | Veo: light beam drifts, dust motes | controversy/contrarian | Gemini |
| 20 | VintagePhotoColorizing | B&W → color sweep left-to-right | Veo first+last colorization | historical/legacy | Gemini ×2 |

### AA.3 Screen-recording hooks (the @nutlope sub-2s screencast loop)

| # | Name | Visual | Motion | Who | Source |
|---|---|---|---|---|---|
| 21 | ChatGPTTypingLive | ChatGPT empty input, blinking cursor | text types over 30f → response streams | AI niche, @karpathy | Remotion type-on |
| 22 | ClaudeSidebarStreaming | Claude prompt half-typed | Enter → token-by-token reveal `frame%2===0` | dev creators | Remotion |
| 23 | VSCodeTerminalCommand | Blank terminal + cursor | `claude` typed in, splash at f=35 | @sabrina_ramonov | Remotion |
| 24 | iPhoneNotificationDropIn | Clean iOS lockscreen | Stripe banner slides down at f=8 | wealth/anxiety | Remotion |
| 25 | EmailReceiving | Empty Gmail inbox | "Anthropic acquisition" row slides in | aspirational | Remotion |
| 26 | StockChartSpiking | TradingView dark theme flat | green candles + line spike | finance/AI-hype | SVG anim |
| 27 | SlackThreadCascade | Slack mid-thread | 3 messages drop, 🔥 reactions | SaaS/team | Remotion |
| 28 | CalendarInviteArriving | Google Calendar week view | "URGENT: Sundar call" pops at 9am | corporate hooks | Remotion |
| 29 | WhatsAppMessageArrival | Chat list visible | "Mom: Are you serious?!" jumps to top | personal/emotional | Remotion |
| 30 | DiscordServerNotification | Discord sidebar | Server lights red, channel pulses | dev/AI niches | Remotion |

### AA.4 Tweet / screenshot / UI hooks

| # | Name | Visual | Motion | Who | Source |
|---|---|---|---|---|---|
| 31 | XTweetReplyChain | Viral tweet screenshot | scroll-pan down to punchy reply | @minchoi | Gemini Pro for shot |
| 32 | LinkedInPostHotComment | LinkedIn post + reactions | scroll to skeptical top comment | B2B controversy | Gemini |
| 33 | RedditTopComment | Reddit thread title | awards animate on top reply | AI/conspiracy | Gemini |
| 34 | YouTubeCommentSection | YouTube video title | scroll to 47K-like comment | meta/creator | Remotion |
| 35 | AppleNewsHeadline | Apple News widget | red BREAKING banner, headline | breaking-news | Gemini |
| 36 | NewsTickerScroll | CNN-style red ticker | text scrolls right-to-left at -8px/f | breaking-news | Remotion |
| 37 | TradingViewMACross | Chart with 2 MAs | line spikes at the cross | finance/AI-hype | SVG anim |
| 38 | GitHubCommitLog | Dark commits page | new commit drops "+247 -89" | founder/dev | Gemini |
| 39 | HackerNewsTopStory | HN orange header | story climbs rank 47→1, points up | dev niche | Remotion |
| 40 | NotionPageLiveEdit | Notion page + cursor | AI ghost-completes sentence | productivity | Gemini still + Remotion type-on |

### AA.5 Person / face hooks (AI-generated, no real face)

| # | Name | Visual | Motion | Who | Source |
|---|---|---|---|---|---|
| 41 | ShockedFaceCloseUp | AI portrait, eyes wide, hand on cheek | Veo: blink @ f=18, eyes widen @ f=30 | "wait what" hooks | Gemini |
| 42 | EyeCloseUpZoomIn | Macro eye, pupil reflecting screen | Veo: pupil dilates 1.5s | introspection | Gemini |
| 43 | HandPointingFromRight | Hand entering from right, finger pointing | Veo: finger taps once at f=20 | "look at this" anchor | Gemini |
| 44 | POVFirstPersonHand | POV from above, hand holding phone | Veo: phone screen updates @ f=24 | parasocial | Gemini |
| 45 | SilhouetteAgainstWindow | Black full-body silhouette vs blown white | Veo: subject raises arm | mystery/anonymity | Gemini |
| 46 | OverShoulderMonitorsHacker | Shot from behind, 3 monitors of code | Veo: scrolls of code | hacker/AI-lab | Gemini |

### AA.6 Number / metric hooks

| # | Name | Visual | Motion | Source |
|---|---|---|---|---|
| 47 | CounterRollingUp | "$0" centered jumbo | slot-machine roll to "$1M" over 30f | Remotion DigitColumn (have it) |
| 48 | StackOfCashGrowing | Single $100 on table | Veo: bills stack 1-by-1 over 1.5s | Veo |
| 49 | RaceBarChartGrowing | Empty axes | 5 bars race up at different speeds | SVG anim |
| 50 | HeartbeatECGMonitor | Black bg, single horizontal green line | line draws right showing ECG spike | SVG strokeDashoffset |
| 51 | MapWorldFillIn | Outline-only world map | countries fill brand color sequentially | SVG per-country |
| 52 | PopulationCounterLive | "8,249,832,xxx" with last 3 digits rolling | drives via spring damping=200 | Remotion |
| 53 | MoneyFallingFromSky | Empty blue sky | Veo: $100 bills tumble down fluttering | Veo |

### AA.7 Object-in-motion hooks

| # | Name | Visual | Motion | Source |
|---|---|---|---|---|
| 54 | DominoChainFalling | Line of black dominoes | Veo: chain reaction over 1.5s | Veo |
| 55 | CardFlippingOver | Face-down playing card | CSS rotateY(180→0) with backface | CSS 3D |
| 56 | EggCrackingOpen | Brown egg on white | Veo: shell splits, golden yolk + light beam | Veo |
| 57 | CurtainParting | Red velvet closed | two halves translateX inward | CSS |
| 58 | DoorOpeningToLight | Closed wooden door | Veo: door creaks open, blinding light | Veo |
| 59 | BoxUnboxingFirstPerson | Cardboard box + knife | Veo: tape slices, glow inside | Veo |
| 60 | EnvelopeWaxSealOpen | Cream envelope, wax seal | Veo: seal cracks, paper unfolds | Veo |
| 61 | BottleUncorkingSlowMo | Champagne bottle, hand on cork | Veo: cork explodes, foam | Veo |
| 62 | CoinSpinningSettling | Gold coin on edge | Veo: spins, blurs, lands heads | Veo |

### AA.8 Magic / transformation hooks (Veo first+last frame)

| # | Name | Start frame | End frame | Source |
|---|---|---|---|---|
| 63 | DrawingToPhoto (arrakis) | Pencil sketch | Photoreal scene same composition | Veo first+last |
| 64 | WireframeToPolishedUI | Lo-fi grey wireframe | Full-color shipped product | Veo first+last |
| 65 | IngredientsToFinishedDish | Raw ingredients spread | Plated dish same camera | Veo first+last |
| 66 | EmptyRoomToRenovated | Bare apartment | Fully furnished living room | Veo first+last |
| 67 | BWToColor | B&W photograph | Same photo full color | Veo first+last |
| 68 | ObjectMultiplyingCloning | Single iPhone on table | 16 in tessellated grid | Veo |
| 69 | BananaAgingTimeLapse | Green banana | Black rotten banana | Veo |
| 70 | StatueCrackingReveal | White marble bust | Glowing AI brain inside | Veo |

### AA.9 Text / typography-as-hero hooks

| # | Name | Visual | Motion | Source |
|---|---|---|---|---|
| 71 | JumboSingleWordFill | "WRONG." 320px black sans on white | scale-up + 1f jitter every 8f | Remotion |
| 72 | TextExplodingPieces | "EVERYTHING" intact | per-letter radial fly-out | per-letter spans |
| 73 | TextTypeOnCursor | Blank screen + cursor | char-by-char `slice(0, visibleChars)` | Remotion |
| 74 | TextBeingErased | Full text "I quit my job today" | erases right-to-left | Remotion slice |
| 75 | TextEmergingFromFog | Full-frame fog | dissipates, text emerges sharp | CSS blur |
| 76 | InkSpreadTextReveal | White frame | ink blob grows, text emerges from it | Veo or SVG |
| 77 | ComicBookPowStarBurst | Yellow starburst "POW!" red | scale 0.6→1.1→1.0 spring overshoot | SVG |
| 78 | RansomNoteAssembling | Empty paper | letters fly in random fonts | per-letter |

### AA.10 Movement-trick hooks

| # | Name | Visual | Motion | Source |
|---|---|---|---|---|
| 79 | CameraZoomThroughPortal | Glowing portal in forest | rapid push-in, fish-eye warp, swallowed | Veo |
| 80 | CameraZoomOutRugPull | Tight close-up on eye | rapid zoom out reveals billboard in Times Sq | Veo |
| 81 | WhipPanFromOffscreen | Empty room | whip-pan blur from right reveals subject | Veo (~56% success rate) |
| 82 | SlowMoIntoHero | Subject mid-jump | 240fps arc into landing | Veo |
| 83 | HyperlapseCitySkyline | NYC skyline at dusk | hyperlapse day→night over 1.5s | Veo |
| 84 | DroneRisingReveal | Ground-level on shoes | drone-rise reveals tsunami at horizon | Veo |

### AA.11 Shock / disgust / disbelief hooks

| # | Name | Visual | Motion | Source |
|---|---|---|---|---|
| 85 | ShatteredMirrorReflection | Mirror with subject | cracks spread, shards begin to fall | Veo |
| 86 | BurningPaperContract | Legal contract on table | corner ignites, flames spread | Veo |
| 87 | LiquidSpillingAcrossFrame | Tipping coffee cup | spills toward camera in slow-mo | Veo |
| 88 | GlassShatteringSlowMo | Champagne glass mid-air | impacts marble, 240fps shatter | Veo |
| 89 | DustExplosionRing | Subject standing in still room | ground impact creates dust ring | Veo |
| 90 | SmokeBillowingFromBelow | Clean horizon | thick black smoke columns rise | Veo |

### AA.12 Pattern-interrupt hooks

| # | Name | Visual | Motion | Source |
|---|---|---|---|---|
| 91 | SuddenAudioDropOut | Hero asset still | all audio dies f=12-30, then resumes | audio only |
| 92 | ColorDesaturatingBW | Saturated photo | sat 1→0 over 18f (interrupt variant) | CSS filter |
| 93 | FrameFreezingRedCircle | Subject mid-motion | freeze + red SVG circle drawn around target | SVG |
| 94 | GlitchCorruptionRGBSplit | Clean image | RGB-split + scan-line tearing 6f | Remotion 3-layer |
| 95 | VHSTrackingErrorBand | Footage + VHS overlay | tracking band rolls vertically | CSS |
| 96 | StaticTVSnow | Noise pattern fullbleed | clears revealing hero | SVG noise loop |
| 97 | PhoneNotificationInterrupt | Any prior visual | iOS banner slides over top at f=6 | Remotion |

### AA.13 Identity-claim hooks

| # | Name | Visual | Motion | Source |
|---|---|---|---|---|
| 98 | POVAtMessyDesk | First-person hands on keyboard | static, monitor content updates | Gemini POV |
| 99 | YouVsThemSplitScreen | Vertical split YOU/THEM | hard-cut split with text overlays | CSS halves |
| 100 | PointingAtViewer | AI person, finger pointing at lens | dead-on stare + tap forward at f=20 | Gemini |
| 101 | MirrorLookDirectAddress | Bathroom mirror reflection | direct eye contact via mirror | Gemini |

### AA.14 AI-content-specific hooks (the 2026 niche)

| # | Name | Visual | Motion | Source |
|---|---|---|---|---|
| 102 | AvatarWith100AIBadge | HeyGen avatar mid-sentence | top-right "100% AI" pulses | HeyGen + Remotion |
| 103 | RealVsAISideBySide | Split screen, near-identical photos | "AI" badge slams onto right at f=22 | Gemini ×2 |
| 104 | PromptWindowCodeTyping | Blank Cursor/Claude prompt | prompt types in over 30f | Remotion |
| 105 | LoadingBarAIGenerating | 0% progress bar | fills to 87% then stalls dramatically | Remotion |
| 106 | TokenStreamSpinner | Spinner + "thinking..." | spinner rotates, tokens stream below | Remotion |
| 107 | WireframeToFinalRender | Neon grid blueprint | materializes step-by-step to photoreal | Veo first+last |
| 108 | GPTAppOpening | Phone home screen | tap on app icon, app opens (scale from icon) | Remotion |

### AA.15 Loop-bait hooks (frame 0 = frame N)

| # | Name | Trick |
|---|---|---|
| 109 | ObjectHandedOffCamera | Hand passes to right; receives from left at end |
| 110 | CameraBlinkFadeBlack | Fade up from black at start; fade to black at end |
| 111 | SameWordAtFrame0AndN | "WHY?" at start, "WHY?" at end, identical composition |
| 112 | SameHandPositionLoop | Hand pointing left at start AND end, identical lighting |
| 113 | WalkInEqualsWalkOut | Subject enters from left at start, exits through left at end |
| 114 | DoorClosingMirrorsDoorOpening | Combine #58 with reverse at end |
| 115 | DollyInPlusDollyOutMirror | Veo push 10%; Remotion reverses last 10% |

### AA.16 News-photo-from-fiction hooks (topic-anchored AI wire-photos)

The AI image is INVISIBLE — the TOPIC is the hook, the AI is just the printer. Pick a story from the last 72h, generate the photo that "would have been published" if the speculation were true, animate with sub-1.5s minimal motion. Brain reads as real news photo for ~600ms before fiction registers. That micro-confusion = guaranteed 3s-hold. Distinct from `MagazineCoverReveal` (curated) and `WantedPoster` (stylized) — this is the *AP-wire / paparazzi / press-pool* aesthetic with a real-looking watermark.

| # | Name | Visual | Motion | Source |
|---|---|---|---|---|
| 116 | WirePhotoCandid | AP-style candid: public figure caught mid-action in fictional moment | Veo: 5% dolly-in + 1 micro-blink, no camera move. 4s clamp | Gemini "press-photo, AP wire" anchor |
| 117 | RedactedDocumentLeak | Photographed printed PDF with black bars, hero phrase visible | Veo: paper edge curls 2px, single dust mote drifts. NO camera move | Gemini doc-photo template |
| 118 | LiveBroadcastChyron | Cable-news still frame: lower-third red chyron "BREAKING — {FAKE_HEADLINE}" | Veo: chyron text scrolls -8px/f for 1.2s, anchor blinks once at f=18 | Gemini "CNN/BBC frame grab, ungraded broadcast color" |
| 119 | CourtroomSketchAI | Hand-drawn courtroom-sketch aesthetic of public figure on stand | Veo first+last: gavel mid-fall → resting on bench. 3s clamp | Gemini "courtroom sketch artist, pastel pencil, cream sketchpad" |
| 120 | PressBriefingPodium | Wide shot of press-briefing podium with figure mid-sentence | Veo: subject leans forward 3°, single camera-flash burst at f=20 | Gemini "white house briefing room, presidential seal, 35mm" |

**The signature trick (do not skip)**: Always pin a real-source watermark in corner — "AP / 2026" or "Reuters / Pool" — even though it's fake. Removes the "this is AI" tell. Brain reads watermarks before content.

**Topic-sourcing workflow (run 9am daily)**:
1. Open Apple News + Reuters Top + Memeorandum + HackerNews front page
2. Pick top story with a public-figure protagonist OR specific company
3. Speculate the fictional outcome ("what if it goes the way Twitter thinks")
4. Generate the photo that AP would have shot of that outcome
5. Hook = AI photo + 1.2s minimal motion; Beat 2 = your actual analysis

**SFX**: ZERO whoosh. One muted single camera-shutter click at motion start. Optional faint TV-room-tone bed at -28 LUFS. The silence sells the "real photo" frame.

### AA.17 Edutainment / general-info AI-image hooks (the @olaconleyy / Curious-Refuge / History-Bombs pattern)

**Distinct from AA.16.** AA.16 hooks live or die on **credibility** (must read as real news photo). AA.17 hooks live or die on **revelation** — image must make abstract claim *legible in 1.2s*. Different goal, different prompt vocabulary, different motion. Don't reuse AA.16 templates here — AP-wire grain + chyron will confuse audiences who came for explainer content.

**Pattern signature for general-info channels**:
- Topic: history "what-if", scale comparisons, anatomy cross-sections, geographic counterfactuals, food origins, finance illustrations, lost-civilization viz, psychology demonstrations
- Hero still: photoreal, single-subject, mid/wide, daylight or filmic key, minimal text overlay (max 2-line caption upper-third)
- Motion budget: **0.8-1.5s of micro-parallax + ONE diegetic element** (steam, dust, cloth flutter, water ripple, blink). NOT full pans. Still must remain readable.
- VO timing: first 2s of script spoken over image BEFORE any chyron text appears — "What you're looking at is…" / "This is what would happen if…" / "Most people don't know that…"
- Caption: one-line declarative claim, sans-serif 80-110px on 1080×1920, top-third, white-on-shadow, NO emojis
- Audio: lo-fi piano or subtle synth bed at -22 LUFS, ducked under VO. NO trending audio — VO is foreground.

| # | Name | Visual | Motion | Source |
|---|---|---|---|---|
| 121 | CounterfactualTimeStitch | Photoreal famous landmark with one anachronistic element | 1.0s slow push-in on the anachronism + ambient crowd murmur fades up | Gemini "photoreal, golden-hour, 35mm, [historical place] but [modern element]" |
| 122 | SamePlaceDifferentEra | Present-day photoreal street → swipe-wipe to SAME coords 100/1000/10000 years ago | 0.4s mask-slide left-to-right transitioning two stills | Gemini twin-gen with locked composition |
| 123 | AnatomyCrossSectionReveal | Photoreal exterior of object/animal/place → front face peels open exposing cutaway interior | 0.8s dissolve from skin to cross-section + soft paper-tear SFX | Gemini two-pass: exterior + matched cutaway |
| 124 | ScaleShockSideBySide | Blue whale next to school bus; Sahara overlaid on contiguous US — at TRUE scale, photoreal ground plane | 1.2s ortho-rotate around the pair + subject sways slightly | Gemini "two subjects, accurate relative scale, neutral grey-card BG" |
| 125 | ProcessSnapshotMidMaking | Hyperreal mid-process shot at most photogenic moment (molten glass being blown; pearl forming inside split oyster) | 0.6s heat-shimmer + sparks loop on active element | Gemini "macro 100mm, in-process [thing], practical lighting" |
| 126 | InsideTheObjectMacro | Extreme macro into something viewer thinks they know | 0.5s focus-rack from outer rim to inner detail | Gemini "5x macro, focus-stacked, ring-light" |
| 127 | LostCivilizationReconstruction | Ruined site rendered as it looked in its prime, with people in period clothes | 0.9s subtle parallax + smoke from chimneys / tradesmen passing through | Gemini "photoreal historical reconstruction, [site] in [era]" |
| 128 | LayerStripWhatYouDontSee | Normal scene with one layer removed exposing hidden infrastructure (city street with asphalt peeled) | 0.7s wipe of obscuring layer downward + subtle camera nudge | Gemini paired-render "normal" + "X-ray of normal" |
| 129 | StatisticAsObject | Abstract number rendered as tangible photoreal pile or stack | 0.8s slow truck-out revealing scale + ambient city sound | Gemini "photoreal, accurate volume calculation visible" |
| 130 | SpecimenOnBlackMuseum | Museum-style isolation shot — single specimen on pure black with rim light | 0.5s slow rotation on Y-axis + glint sweeps across | Gemini "single subject, pure black, museum cabinet light" |
| 131 | TimeLapseFrozenMidBeat | Single still of one frame from a time-lapse sequence (rotting fruit at exact 50% decay) | 0.4s — almost still, just particle drift | Gemini "exact 50% state, photoreal, time-frozen" |
| 132 | MapAsPhotograph | Top-down satellite-style shot rendered with photoreal terrain instead of cartographic styling | 0.8s slow descend (Veo: drone) | Gemini "satellite top-down, photoreal terrain" |

**Implementation rule**: enforce **motion-budget cap 0.5-1.5s with ONE diegetic micro-element** in your Veo 2 prompt template. Otherwise it'll over-animate and tank the explainer's first-frame readability. VO must precede chyron by ~600ms — viewer hears the claim before they read it. That's the signature pattern that makes general-info AI-image hooks land where AI-news hooks would feel uncanny.

**SFX for AA.17**: Lo-fi piano bed at -22 LUFS continuous + ONE matched diegetic SFX per still (paper-tear for anatomy cuts, water-ripple for ocean reveals, dust-puff for archaeology, glass-glint for specimen). NO whoosh-on-cut. NO trending audio. Voice + bed + one diegetic = the recipe.

### AA.18 Celebrity Cameo Cold-Open (the Varun pattern, decoded)

The hook archetype I missed in the original catalog and decoded by frame-by-frame study of Varun Mayya's news-roundup reels (Robin Li / Baidu opener, Elon for Grok, Sundar×4 for Google). The mechanic isn't "shock" or "pattern interrupt" — it's **stacked recognition + impossibility-but-on-topic**, all resolving in <1.5 seconds.

**The three stacked recognitions:**
1. **Face/object recognition (~100ms)** — globally familiar subject (Sam Altman, Elon, Modi, Sundar, the Apple logo, a Tamagotchi). Brain commits before any caption is read.
2. **Topic anchoring (~300ms)** — the recognized subject signals the topic (Sam → AI/OpenAI; Elon → xAI/Grok). No need to explain what the reel is about; the cameo tells you.
3. **Cognitive-dissonance dwell (~600ms)** — the subject is doing something *impossible-but-on-topic*. Sam holding a cartoon pet. Elon dancing with a Grok logo. Robin Li mid-stylized-press-still about to present ERNIE.

The script's first VO line lands while step 3 is happening. Resolution within 1.5s, viewer committed.

**Visual treatment** (validated in Petdex shipment):
- Real photo of the subject as a starting point — best fetched from their public Twitter profile pic via `unavatar.io/twitter/{handle}`
- First 0.5s: cinematic processing (heavy contrast 1.4×, desaturation 0.6×, brightness 0.85×) — easing back to natural by frame 30
- Brand watermark upper-right corner: `@OpenAIDevs · May 1` / `Reuters / Pool` / `Bai du · ERNIE` style
- Yellow-highlight punch word in caption (Varun signature: white sentence-case + ONE yellow-highlighted phrase)
- Avatar small + neutral in bottom 40% throughout the cameo (the cameo carries; avatar doesn't compete)

**Tonal palette compatibility**:
- Pairs with `urgent-breaking` (the canonical Varun news-roundup register)
- Pairs with `ironic-deadpan` (subject holds frame, deadpan VO over)
- Conflicts with `sincere-awe` (cameo absurdity undermines awe)
- Conflicts with `quiet-observation` (energy too high)

**When to fire AA.18:**
- Topic has a clear company-protagonist (Sam for OpenAI; Sundar for Google; Dario for Anthropic; Elon for xAI)
- News topic where the company-protagonist is the visible face of the news
- Hot-takes that are *about* a CEO's specific stance

**When NOT to fire AA.18:**
- Topic has no company face (general AI culture, multi-tool roundup with no single anchor — use AA.19 instead)
- Death/grave-stakes topics (cameo absurdity reads cruel)
- Tutorial reels (viewer needs to trust the recipe, cameo distracts)

**Tool-policy reality (decoded across the Petdex session):**

| Tool | Real-celebrity likeness | Notes |
|---|---|---|
| Sora 2 (via fal.ai / Replicate) | ✓ best — cameo-permission system; Sam/Elon/Sundar opted in | $0.60-1.00 per 6s clip |
| Veo 3.1 with character refs (3 images) | ◐ ~50% success | $0.40/s |
| Veo 2 (`veo-2.0-generate-001`) | ✗ refuses | sanitizes to generic-tech-archetype |
| Gemini Nano Banana Pro with `refs[]` + descriptive identity | ◐ "Sam-adjacent" — close-but-not-pixel-perfect | $0.13/img, 30s; **the Petdex shipment used this** |
| Meta AI web (multi.meta.ai) image-gen | ◐ "Sam-adjacent" — same caveat as Gemini | free with cookies; works for image gen |
| Meta AI web image-to-video | ✓ for animating an existing still | free with cookies, ~3-4 min |
| Meta AI "Imagine Me" mode | ✓ pixel-perfect — but only for the *account holder's* onboarded selfie, not arbitrary celebrities | not applicable for third-party-celebrity hooks |

The validated Petdex pipeline: **Gemini Nano Banana Pro with reference image + no-name prompt → Meta AI image-to-video animate**. Cost ~$0.65 + ~6-8 min wall time end-to-end. See `references/prompts/meta-ai.md` for the two-stage workflow + `references/prompts/gemini-image.md` for the descriptive-identity prompt patterns.

### AA.19 Multi-Instance Sora-Cameo Flex (the multi-Sundar pattern)

A specific *amplification* of AA.18 where the cameo subject is *replicated impossibly*. The signature flex of the Sora-2-cameo era — Varun's 4-Sundars-in-coordination at t=5.5s of his news-roundup reel; FF.10 Sam-Altman-ballet (single instance but absurd action); the Petdex shipment's 50-clones-in-stadium-seats.

**Mechanic:**
- ONE recognizable subject duplicated N times (typically 4, 8, 50)
- Coordinated gesture / pose across all instances
- Impossible reality (one body can't be in multiple places) signals "this is AI-generated absurdity"
- Topical anchor (each instance holds something topic-relevant — pets, products, etc.)

**Composition variants tested in Petdex session:**

1. **N-clones-in-row** — Varun's canonical pattern. 4 Sundars/Sams shoulder-to-shoulder, each holding a different topical artifact. Photoreal, coordinated, slightly unsettling. Strongest baseline.
2. **N-clones-on-conveyor** — assembly-line satire. 4+ clones on an industrial conveyor belt, each placing topical objects into shipping boxes stamped with a real number from the reel ("PETS SHIPPED 1 OF 192" pays back B6's stat reveal). High visual specificity.
3. **Single-instance-overwhelmed-pile** — opposite of multi-instance: ONE clone with the topical objects piled all over them. The pile IS the multi. Strong face-preservation because there's only one face to render. Validated as the strongest face match in the Petdex variants.
4. **Stadium-scale flex** — 50+ clones in a stadium grandstand, all holding different unique topical artifacts up like a crowd-wave, with ONE foreground close-up clone bewildered. The scale itself is the absurdity. **The Petdex shipment used this.**
5. **Pokémon-trainer pose** — ONE clone mid-throw of a giant Pokeball, smaller copies of him + topical pets emerging in the light burst. Pun-recognition + action shot. Underused but cleanly absurd.
6. **AI-decay-to-real-news intro** (Varun-Robin-Li opener) — single subject, but with stylized cinematic processing in the first 500ms that resolves to clean press-photo. The *resolution from synthetic to real* is the dissonance.

**Production rule**: generate the still first via Gemini Nano Banana Pro (5 variants in 2.5 min, $0.65 total). Pick the funniest. Animate via Meta AI in Stage 2.

**Tonal note**: AA.19 amplifies AA.18 — same compatibility (urgent-breaking, ironic-deadpan); same conflicts (sincere-awe, quiet-observation, grave). The scale itself is the ironic-deadpan punchline — "this is what we've decided to do with AGI" lands harder over 50 stadium-clones than over a single subject.

---

## How R1 chains to here

R1 in `decision-rubrics.md` resolves to a tuple: `(archetype #N, AA-section #M, hook-component name)`. Reader of this file pulls:

1. The archetype's word-count + when-to-use note from §A.
2. The AA-section's worked example matching the chosen template.
3. (Then load `references/hook-components.md` for the chosen component's API.)

If the rubric output doesn't match a row in this file, the rubric is wrong — escalate to user.
