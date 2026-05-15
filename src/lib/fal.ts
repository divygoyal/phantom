import "server-only";
import { fal } from "@fal-ai/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
  provider: "fal" | "gemini" | "scripted";
};

export async function generateImage(
  prompt: string,
  opts: { width?: number; height?: number } = {}
): Promise<GeneratedImage> {
  const status = imageGenStatus();
  const width = opts.width ?? 1280;
  const height = opts.height ?? 720;

  if (status === "fal") {
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
    if (!first) throw new Error("Fal returned no images");
    return { url: first.url, width, height, provider: "fal" };
  }

  if (status === "gemini") {
    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    // Gemini's image gen endpoint via the Imagen model
    // Falls back to a placeholder if the SDK version doesn't expose image gen directly
    try {
      // Newer SDK: use the Imagen model
      // @ts-expect-error Newer SDK adds .getImageModel; old SDKs throw — we catch
      const model = client.getImageModel?.("imagen-3.0-generate-001");
      if (model) {
        const result = await model.generateImages({ prompt, numberOfImages: 1 });
        const img = result.generatedImages?.[0];
        if (img?.image?.imageBytes) {
          const dataUrl = `data:image/png;base64,${img.image.imageBytes}`;
          return { url: dataUrl, width, height, provider: "gemini" };
        }
      }
    } catch {
      // fall through to placeholder
    }
    return scriptedImage(prompt, width, height);
  }

  return scriptedImage(prompt, width, height);
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
  // Return a deterministic placeholder seeded by the prompt hash
  let h = 0;
  for (let i = 0; i < prompt.length; i++) h = (h * 31 + prompt.charCodeAt(i)) | 0;
  const seed = Math.abs(h);
  return {
    url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
    width,
    height,
    provider: "scripted",
  };
}
