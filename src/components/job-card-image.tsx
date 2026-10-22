"use client";
import { useState } from "react";
import Image from "next/image";

export function JobCardImage({ company, jobUrl, size = 44 }: { company: string; jobUrl?: string | null; size?: number }) {
  const [failed, setFailed] = useState(!jobUrl);
  const fallback = <div style={{ width: size, height: size }} className="grid shrink-0 place-items-center rounded-xl bg-indigo-50 font-semibold text-indigo-700" aria-label={`${company} logo unavailable`}>{company.trim().slice(0, 1).toUpperCase()}</div>;
  if (!jobUrl || failed) return fallback;

  const src = `/api/job-image?url=${encodeURIComponent(jobUrl)}`;
  return <div style={{ width: size, height: size }} className="relative grid shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-100 bg-white">
    <Image src={src} alt={`${company} logo`} fill sizes={`${size}px`} unoptimized className="object-contain p-1" onError={() => setFailed(true)}/>
  </div>;
}
