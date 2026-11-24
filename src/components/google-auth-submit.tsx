"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";

export function GoogleAuthSubmit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} aria-busy={pending} className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-[#747775] bg-white px-3 text-[14px] font-medium leading-5 text-[#1F1F1F] transition-colors [font-family:'Google_Sans',Roboto,Arial,sans-serif] hover:border-[#5F6368] hover:bg-[#F8F8F3] disabled:cursor-wait disabled:opacity-70">
    {pending ? <LoaderCircle size={18} aria-hidden="true" className="animate-spin"/> : <span aria-hidden="true" className="h-5 w-5 shrink-0 bg-white bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url(https://developers.google.com/static/identity/images/g-logo.png)" }}/>}
    {pending ? "Connecting to Google…" : label}
  </button>;
}
