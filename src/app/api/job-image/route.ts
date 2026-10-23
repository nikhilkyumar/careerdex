import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
const MAX_HTML_BYTES = 512 * 1024;
const MAX_REDIRECTS = 3;

function isPublicIp(address: string): boolean {
  if (address.includes(":")) {
    const lower = address.toLowerCase();
    if (lower.startsWith("::ffff:")) return isPublicIp(lower.slice(7));
    const first = Number.parseInt(lower.split(":")[0] || "0", 16);
    return first >= 0x2000 && first < 0x4000 && !lower.startsWith("2001:db8:") && !lower.startsWith("2002:");
  }
  const octets = address.split(".").map(Number);
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [a, b, c] = octets;
  return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 192 && b === 0 && (c === 0 || c === 2)) || (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100)) ) || (a === 203 && b === 0 && c === 113));
}

async function isPublicUrl(url: URL): Promise<boolean> {
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return false;
  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (!hostname || hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local") || hostname.endsWith(".internal")) return false;
  if (isIP(hostname)) return isPublicIp(hostname);
  try {
    const addresses = await lookup(hostname, { all: true, verbatim: true });
    return addresses.length > 0 && addresses.every((entry) => isPublicIp(entry.address));
  } catch {
    return false;
  }
}

async function readHtml(response: Response): Promise<string> {
  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > MAX_HTML_BYTES || !response.body) throw new Error("Page is too large");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_HTML_BYTES) {
      await reader.cancel();
      throw new Error("Page is too large");
    }
    chunks.push(value);
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(body);
}

function imageFromHtml(html: string, pageUrl: URL): URL | null {
  const tags = html.slice(0, MAX_HTML_BYTES).match(/<(?:meta|link)\b[^>]*>/gi) || [];
  const previews: string[] = [];
  const icons: string[] = [];
  for (const tag of tags) {
    const attrs = new Map<string, string>();
    for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
      attrs.set(match[1].toLowerCase(), (match[2] ?? match[3] ?? match[4] ?? "").replace(/&amp;/gi, "&").trim());
    }
    const property = (attrs.get("property") || attrs.get("name") || "").toLowerCase();
    const rel = (attrs.get("rel") || "").toLowerCase().split(/\s+/);
    const content = attrs.get("content") || attrs.get("href") || "";
    if ((property === "og:image" || property === "og:image:secure_url" || property === "twitter:image" || property === "twitter:image:src" || rel.includes("image_src")) && content) previews.push(content);
    // Job listing pages often expose the company mark as the tab icon rather
    // than as social preview metadata. Prefer larger touch icons when present.
    if (rel.some((item) => item === "apple-touch-icon" || item === "apple-touch-icon-precomposed")) {
      if (content) icons.unshift(content);
    } else if ((rel.includes("icon") || rel.includes("shortcut")) && content) {
      icons.push(content);
    }
  }
  for (const value of [...previews, ...icons]) {
    try {
      const candidate = new URL(value, pageUrl);
      if (["http:", "https:"].includes(candidate.protocol) && !candidate.username && !candidate.password) return candidate;
    } catch { /* Ignore malformed metadata and try the next candidate. */ }
  }
  // Many older listing sites do not declare the favicon in their HTML.
  return new URL("/favicon.ico", pageUrl);
}

async function fetchPageImage(pageUrl: URL): Promise<URL | null> {
  let current = pageUrl;
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
    if (!(await isPublicUrl(current))) return null;
    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(4500),
      headers: { Accept: "text/html,application/xhtml+xml", "User-Agent": "CareerDexPreview/1.0" },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location || redirects === MAX_REDIRECTS) return null;
      current = new URL(location, current);
      continue;
    }
    if (!response.ok || !(response.headers.get("content-type") || "").toLowerCase().includes("text/html")) return null;
    const html = await readHtml(response);
    const image = imageFromHtml(html, current);
    if (image && await isPublicUrl(image)) return image;
    return null;
  }
  return null;
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse(null, { status: 401 });

  const rawUrl = new URL(request.url).searchParams.get("url");
  if (!rawUrl || rawUrl.length > 2048) return new NextResponse(null, { status: 400 });
  try {
    const pageUrl = new URL(rawUrl);
    if (!(await isPublicUrl(pageUrl))) return new NextResponse(null, { status: 400, headers: { "Cache-Control": "private, max-age=300" } });
    const image = await fetchPageImage(pageUrl);
    if (!image) return new NextResponse(null, { status: 404, headers: { "Cache-Control": "private, max-age=900" } });
    return new NextResponse(null, { status: 302, headers: { Location: image.href, "Cache-Control": "private, max-age=86400, stale-while-revalidate=604800" } });
  } catch {
    return new NextResponse(null, { status: 404, headers: { "Cache-Control": "private, max-age=900" } });
  }
}
