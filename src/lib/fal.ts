import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fal } from "@fal-ai/client";

function falConfigured(): boolean {
  return !!process.env.FAL_KEY?.trim();
}

function geminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY?.trim();
}

export function imageGenStatus(): "fal" | "gemini" | "scripted" {
  if (falConfigured()) return "fal";
  if (geminiConfigured()) return "gemini";
  return "scripted";
}

if (falConfigured()) {
  fal.config({ credentials: process.env.FAL_KEY! });
}

export type GeneratedImage = {
  url: string;
  width: number;
  height: number;
  provider: "fal" | "gemini" | "scripted" | "source-video";
};

export async function generateImage(
  prompt: string,
  opts: { width?: number; height?: number } = {}
): Promise<GeneratedImage> {
  const status = imageGenStatus();
  const width = opts.width ?? 1280;
  const height = opts.height ?? 720;

  if (status === "fal") {
    try {
      const result = await fal.subscribe("fal-ai/flux/schnell", {
        input: {
          prompt,
          image_size: width === height ? "square_hd" : "landscape_16_9",
          num_inference_steps: 4,
          num_images: 1,
          enable_safety_checker: true,
        },
      });
      const data = result.data as { images?: Array<{ url: string }> };
      const first = data.images?.[0];
      if (first) return { url: first.url, width, height, provider: "fal" };
    } catch (err) {
      console.error("Fal image gen failed, falling through:", err);
    }
  }

  if (geminiConfigured()) {
    const result = await generateImageViaGemini(prompt, width, height);
    if (result) return result;
  }

  return scriptedImage(prompt, width, height);
}

// Gemini Nano Banana (gemini-2.5-flash-image-preview) via REST.
// AI Studio API key works. Returns base64 PNG inline data, which we save to disk
// and return as a relative path (HyperFrames file server serves it).
async function generateImageViaGemini(
  prompt: string,
  width: number,
  height: number
): Promise<GeneratedImage | null> {
  const apiKey = process.env.GEMINI_API_KEY!.trim();
  // Try the current Nano Banana model first; fall back to alternatives if it 404s.
  const candidates = [
    "gemini-2.5-flash-image-preview",
    "gemini-2.5-flash-image",
    "gemini-2.0-flash-exp",
  ];

  for (const model of candidates) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const body = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
    };
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        // 404 = model not available on this key; try next candidate.
        if (res.status === 404) continue;
        const errText = await res.text();
        console.error(`Gemini ${model} returned ${res.status}: ${errText.slice(0, 200)}`);
        return null;
      }
      const data = await res.json();
      const parts =
        data.candidates?.[0]?.content?.parts ??
        data.candidates?.[0]?.message?.content ??
        [];
      for (const part of parts) {
        const inline = part?.inlineData ?? part?.inline_data;
        if (inline?.data && inline?.mimeType?.startsWith("image/")) {
          const fileName = `gemini-${hashPrompt(prompt)}.png`;
          const savedUrl = await saveImageToCompositionAssets(inline.data, fileName);
          return { url: savedUrl, width, height, provider: "gemini" };
        }
      }
    } catch (err) {
      console.error(`Gemini ${model} fetch failed:`, err);
      // Try next candidate
    }
  }
  return null;
}

async function saveImageToCompositionAssets(
  base64Data: string,
  fileName: string
): Promise<string> {
  const compRoot = path.resolve(
    process.cwd(),
    process.cwd().endsWith("phantom") ? "composition" : "phantom/composition"
  );
  const assetsDir = path.join(compRoot, "assets");
  await fs.mkdir(assetsDir, { recursive: true });
  const filePath = path.join(assetsDir, fileName);
  const buf = Buffer.from(base64Data, "base64");
  await fs.writeFile(filePath, buf);
  return `assets/${fileName}`;
}

function hashPrompt(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

export async function generateThumbnailVariants(
  topic: string,
  count = 4
): Promise<GeneratedImage[]> {
  const prompts = [
    `YouTube thumbnail, close-up surprised face, bold arrow pointing at "${topic}", high contrast, vivid colors`,
    `YouTube thumbnail, minimal aesthetic, wide shot, "${topic}" in elegant typography, dark moody background`,
    `YouTube thumbnail, three-panel split-screen showing "${topic}" before/after/why, dynamic composition`,
    `YouTube thumbnail, retro tech aesthetic, "${topic}" in chrome 3d text, gradient background, glow`,
  ].slice(0, count);

  return Promise.all(
    prompts.map((p) => generateImage(p, { width: 1280, height: 720 }))
  );
}

function scriptedImage(
  prompt: string,
  width: number,
  height: number
): GeneratedImage {
  const seed = Math.abs(hashSeed(prompt));
  return {
    url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
    width,
    height,
    provider: "scripted",
  };
}

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
