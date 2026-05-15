import "server-only";

const HEYGEN_API_BASE = "https://api.heygen.com";
const HEYGEN_API_V2 = `${HEYGEN_API_BASE}/v2`;

function apiKey(): string | null {
  return process.env.HEYGEN_API_KEY?.trim() || null;
}

export type HeyGenStatus = "live" | "scripted" | "unconfigured";

export function heygenStatus(): HeyGenStatus {
  return apiKey() ? "live" : "scripted";
}

type HeadersInit = Record<string, string>;

function authedHeaders(): HeadersInit {
  const k = apiKey();
  if (!k) throw new Error("HEYGEN_API_KEY not set");
  return {
    "X-Api-Key": k,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

// === Avatar Video ===

export type CreateAvatarVideoInput = {
  script: string;
  avatarLookId: string;
  voiceId: string;
  dimension?: { width: number; height: number };
  background?: { type: "color"; value: string };
  title?: string;
};

export type CreateAvatarVideoResult = {
  videoId: string;
  status: "queued" | "processing" | "completed" | "failed";
  videoUrl?: string;
  thumbnailUrl?: string;
};

export async function createAvatarVideo(
  input: CreateAvatarVideoInput
): Promise<CreateAvatarVideoResult> {
  if (heygenStatus() === "scripted") return scriptedAvatarVideo(input);

  const body = {
    title: input.title ?? "Phantom-generated",
    caption: false,
    dimension: input.dimension ?? { width: 1080, height: 1920 },
    video_inputs: [
      {
        character: {
          type: "avatar",
          avatar_id: input.avatarLookId,
          avatar_style: "normal",
        },
        voice: {
          type: "text",
          input_text: input.script,
          voice_id: input.voiceId,
          speed: 1.0,
        },
        background: input.background ?? { type: "color", value: "#0a0a0a" },
      },
    ],
  };

  const res = await fetch(`${HEYGEN_API_V2}/video/generate`, {
    method: "POST",
    headers: authedHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HeyGen createAvatarVideo failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  return {
    videoId: data.data?.video_id ?? data.video_id,
    status: "queued",
  };
}

export async function getVideoStatus(
  videoId: string
): Promise<CreateAvatarVideoResult> {
  if (heygenStatus() === "scripted") {
    return { videoId, status: "completed", videoUrl: "/demo/sample-video.mp4" };
  }

  const res = await fetch(`${HEYGEN_API_BASE}/v1/video_status.get?video_id=${videoId}`, {
    headers: authedHeaders(),
  });
  if (!res.ok) throw new Error(`getVideoStatus failed: ${res.status}`);
  const data = await res.json();
  const d = data.data;
  return {
    videoId,
    status: d.status === "completed" ? "completed" : d.status,
    videoUrl: d.video_url,
    thumbnailUrl: d.thumbnail_url,
  };
}

// === Video Translate ===

export type TranslateVideoInput = {
  videoUrl: string;
  outputLanguage: string; // e.g. "Hindi", "Spanish"
  title?: string;
};

export async function translateVideo(input: TranslateVideoInput) {
  if (heygenStatus() === "scripted") {
    return {
      translationId: `scripted_tr_${Date.now()}`,
      status: "completed" as const,
      videoUrl: `/demo/sample-${input.outputLanguage.toLowerCase()}.mp4`,
    };
  }

  const res = await fetch(`${HEYGEN_API_V2}/video_translate`, {
    method: "POST",
    headers: authedHeaders(),
    body: JSON.stringify({
      video_url: input.videoUrl,
      output_language: input.outputLanguage,
      title: input.title ?? `Translated to ${input.outputLanguage}`,
    }),
  });
  if (!res.ok) throw new Error(`translateVideo failed: ${res.status}`);
  const data = await res.json();
  return {
    translationId: data.data?.video_translate_id ?? data.video_translate_id,
    status: "processing" as const,
  };
}

// === Video Agent (live conversational video) ===

export type CreateVideoAgentInput = {
  prompt: string;
  mode?: "chat" | "generate";
  styleId?: string;
};

export async function createVideoAgentSession(input: CreateVideoAgentInput) {
  if (heygenStatus() === "scripted") {
    const sessionId = `scripted_va_${Date.now()}`;
    return {
      sessionId,
      sessionUrl: `https://app.heygen.com/video-agent/${sessionId}`,
      status: "scripted" as const,
    };
  }

  const res = await fetch(`${HEYGEN_API_V2}/video_agent/session`, {
    method: "POST",
    headers: authedHeaders(),
    body: JSON.stringify({
      prompt: input.prompt,
      mode: input.mode ?? "chat",
      style_id: input.styleId,
    }),
  });
  if (!res.ok) throw new Error(`createVideoAgentSession failed: ${res.status}`);
  const data = await res.json();
  const sessionId = data.data?.session_id ?? data.session_id;
  return {
    sessionId,
    sessionUrl: `https://app.heygen.com/video-agent/${sessionId}`,
    status: "created" as const,
  };
}

// === Scripted demo fallback ===

function scriptedAvatarVideo(
  _input: CreateAvatarVideoInput
): CreateAvatarVideoResult {
  return {
    videoId: `scripted_${Date.now()}`,
    status: "completed",
    videoUrl: "/demo/sample-video.mp4",
    thumbnailUrl: "/demo/sample-thumb.jpg",
  };
}

// === Defaults from env ===

export const HEYGEN_DEFAULTS = {
  voiceId: process.env.HEYGEN_VOICE_ID || "",
  avatarLookId: process.env.HEYGEN_AVATAR_LOOK_ID || "",
};
