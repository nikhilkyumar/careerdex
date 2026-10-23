"use client";
import { useState } from "react";
import Image from "next/image";

export function JobCardImage({ company, jobUrl, size = 44 }: { company: string; jobUrl?: string | null; size?: number }) {
  const [failed, setFailed] = useState(!jobUrl);
  const fallback = <div style={{ width: size, height: size }} className="grid shrink-0 place-items-center rounded-xl bg-indigo-50 font-semibold text-indigo-700" aria-label={`${company} logo unavailable`}>{company.trim().slice(0, 1).toUpperCase()}</div>;
  if (!jobUrl || failed) return fallback;

  // Resolve the favicon for the posting URL's site. This is the same icon
  // browsers use in the tab and does not depend on the job board allowing our
  // server to download and parse its listing page.
  let src: string;
  try {
    const postingUrl = new URL(jobUrl);
    if (postingUrl.protocol !== "https:" && postingUrl.protocol !== "http:") return fallback;
    src = `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(postingUrl.origin)}&sz=128`;
  } catch {
    return fallback;
  }
  return <div style={{ width: size, height: size }} className="relative grid shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-100 bg-white">
    <Image src={src} alt={`${company} logo`} fill sizes={`${size}px`} unoptimized className="object-contain p-1" onError={() => setFailed(true)}/>
  </div>;
}
