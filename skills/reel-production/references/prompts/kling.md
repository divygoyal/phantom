# Kling 3.0 — image-to-video templates

The cheap-batch alternative to Veo 3.1. Use for B-roll volumes where Veo cost adds up.

---

## Pricing (Novita API)

- Standard: $0.168/sec without audio, $0.252/sec with audio
- Pro: $0.224/sec / $0.336/sec
- **30-40% of Veo 3.1 cost.** Free tier: 66 daily credits (watermarked).

---

## Length / format

- 5s / 10s standard; up to 15s on Pro
- Aspects: 9:16, 1:1, 16:9
- 720p / 1080p

---

## Canonical 5-part formula

`[Camera Movement] + [Scene Setup] + [Subject Action with physics verbs] + [Vibe/Lighting] + [Time/Audio]`

---

## When Kling MATCHES or BEATS Veo

- Image-to-video subject preservation (3D face/body reconstruction is genuinely better at identity stability)
- Long static shots
- Style transfer (Studio Ghibli, anime, oil painting)
- Cost-per-second for B-roll batches

## When Veo wins

- Lip-sync (Kling has minor morph on long dialogue)
- Hands holding objects (use "firmly grips," "anchored to" — never "loosely holds")
- Synced SFX

---

## Negative boilerplate

```
avoid smiling, cartoonish, plastic skin, floating hands, sliding feet, morphing text, extra fingers, identity drift, low quality, blurry
```

---

## Reference tags

Kling supports `@image1`, `@image2` inline. Lock characters with "consistent appearance with @image1 throughout."

---

## Templates

### 1. Inanimate B-roll
```
Static locked-off shot. {OBJECT} in source image. Slow shimmering surface, dust particles drifting, subtle light flicker. Cinematic moody lighting, shallow DOF. 5s, 9:16.
```

### 2. Character reaction
```
Slow push-in from medium to close-up. The character (preserve identity from source image) {SUBTLE_REACTION_VERB}. Soft directional key light, cinematic teal-orange. 5s, 9:16. Negative: identity drift, plastic skin, floating hands.
```

### 3. Environmental B-roll
```
Drone descending from above through {ENVIRONMENT}. Volumetric god rays, golden hour, particles in air, photoreal. 10s, 9:16.
```
