import "server-only";
import * as cheerio from "cheerio";

export type IngestedSource = {
  type: "x" | "article" | "reddit" | "youtube" | "unknown";
  url: string;
  title: string;
  body: string;
  authorHandle?: string;
  authorName?: string;
  mediaUrls: string[];
  publishedAt?: string;
};

export class TopicTooThinError extends Error {
  constructor(message: string, public readonly source: Partial<IngestedSource>) {
    super(message);
    this.name = "TopicTooThinError";
  }
}

const MIN_BODY_LENGTH = 80;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Phantom/0.1";

export async function ingestUrl(url: string): Promise<IngestedSource> {
  const u = new URL(url);
  const host = u.hostname.replace(/^www\./, "");

  let source: IngestedSource;
  if (host === "x.com" || host === "twitter.com") {
    source = await ingestX(url, u);
  } else if (host === "reddit.com" || host === "old.reddit.com") {
    source = await ingestReddit(url);
  } else if (host === "youtube.com" || host === "youtu.be") {
    source = await ingestYouTube(url);
  } else {
    source = await ingestArticle(url);
  }

  if (!source.title || source.body.length < MIN_BODY_LENGTH) {
    throw new TopicTooThinError(
      `Topic too thin: title="${source.title}" body=${source.body.length} chars`,
      source
    );
  }
  return source;
}

// === X / Twitter ===

async function ingestX(url: string, u: URL): Promise<IngestedSource> {
  const match = u.pathname.match(/\/status\/(\d+)/);
  if (!match) {
    throw new Error(`X URL missing status id: ${url}`);
  }
  const id = match[1];

  // Public syndication endpoint — no auth required
  const syndUrl = `https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=a`;
  const res = await fetch(syndUrl, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`X syndication failed: ${res.status}`);
  }
  const data = await res.json();

  const text = (data.text as string) || "";
  const author = data.user || {};
  const created = (data.created_at as string) || undefined;
  const mediaUrls: string[] = [];
  const media = (data.mediaDetails || []) as Array<{
    type: string;
    media_url_https?: string;
    video_info?: { variants?: Array<{ url: string; content_type: string }> };
  }>;
  for (const m of media) {
    if (m.type === "photo" && m.media_url_https) {
      mediaUrls.push(m.media_url_https);
    } else if ((m.type === "video" || m.type === "animated_gif") && m.video_info) {
      const variants = (m.video_info.variants || []).filter(
        (v) => v.content_type === "video/mp4"
      );
      // Pick the highest-bitrate variant
      const best = variants[variants.length - 1];
      if (best) mediaUrls.push(best.url);
    }
  }

  return {
    type: "x",
    url,
    title: text.split("\n")[0].slice(0, 120),
    body: text,
    authorHandle: author.screen_name ? `@${author.screen_name}` : undefined,
    authorName: author.name,
    mediaUrls,
    publishedAt: created,
  };
}

// === Reddit ===

async function ingestReddit(url: string): Promise<IngestedSource> {
  const jsonUrl = url.replace(/\/?$/, ".json");
  const res = await fetch(jsonUrl, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) throw new Error(`Reddit fetch failed: ${res.status}`);
  const data = await res.json();
  const post = data?.[0]?.data?.children?.[0]?.data;
  if (!post) throw new Error("Reddit response missing post data");

  const body = [post.title, post.selftext].filter(Boolean).join("\n\n");
  const mediaUrls: string[] = [];
  if (post.url_overridden_by_dest && /\.(png|jpg|jpeg|webp|gif|mp4)$/i.test(post.url_overridden_by_dest)) {
    mediaUrls.push(post.url_overridden_by_dest);
  }
  if (post.preview?.images) {
    for (const img of post.preview.images) {
      const src = img?.source?.url;
      if (src) mediaUrls.push(String(src).replace(/&amp;/g, "&"));
    }
  }

  return {
    type: "reddit",
    url,
    title: post.title || "",
    body,
    authorHandle: post.author ? `u/${post.author}` : undefined,
    mediaUrls,
    publishedAt: post.created_utc ? new Date(post.created_utc * 1000).toISOString() : undefined,
  };
}

// === YouTube ===

async function ingestYouTube(url: string): Promise<IngestedSource> {
  // Minimum-viable: pull og: tags from the page; for full transcripts wire in
  // youtube-transcript or similar in v2.
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`YouTube fetch failed: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text().replace(/ - YouTube$/, "") ||
    "";
  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    "";
  const image = $('meta[property="og:image"]').attr("content");

  return {
    type: "youtube",
    url,
    title,
    body: description,
    mediaUrls: image ? [image] : [],
  };
}

// === Article (generic) ===

async function ingestArticle(url: string): Promise<IngestedSource> {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Article fetch failed: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="twitter:title"]').attr("content") ||
    $("h1").first().text().trim() ||
    $("title").text().trim() ||
    "";

  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    "";

  // Try to extract main article content
  let body = "";
  const articleSelector = $("article").first();
  if (articleSelector.length) {
    body = articleSelector.find("p").slice(0, 12).map((_, el) => $(el).text().trim()).get().join("\n\n");
  } else {
    body = $("main p, .post-content p, .entry-content p, [class*=article] p")
      .slice(0, 12)
      .map((_, el) => $(el).text().trim())
      .get()
      .join("\n\n");
  }
  if (body.length < MIN_BODY_LENGTH) {
    // Fallback: just take the first N paragraphs
    body = $("p").slice(0, 12).map((_, el) => $(el).text().trim()).get().join("\n\n");
  }
  if (!body.trim()) body = description;

  const mediaUrls: string[] = [];
  const ogImage = $('meta[property="og:image"]').attr("content");
  if (ogImage) mediaUrls.push(ogImage);

  const authorName =
    $('meta[name="author"]').attr("content") ||
    $('meta[property="article:author"]').attr("content") ||
    undefined;

  return {
    type: "article",
    url,
    title,
    body,
    authorName,
    mediaUrls,
    publishedAt:
      $('meta[property="article:published_time"]').attr("content") ||
      undefined,
  };
}

// === Helpers ===

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}
