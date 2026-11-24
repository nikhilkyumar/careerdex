import { PublicFooter, PublicHeader } from "@/components/public-site";

export function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#F1F0E9] text-[#20221C]"><PublicHeader/><main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16"><div className="max-w-3xl"><p className="font-mono text-xs uppercase tracking-[.16em] text-[#6656B5]">{eyebrow}</p><h1 className="mt-4 font-[family-name:var(--font-editorial)] text-5xl leading-[1.02] tracking-tight sm:text-6xl">{title}</h1><p className="mt-5 text-base leading-7 text-[#65695F]">{intro}</p><p className="mt-3 text-xs text-[#85897F]">Last updated: November 24, 2026</p><div className="mt-8 space-y-7 border-t border-[#D5D6CB] pt-7 text-sm leading-7 text-[#53574E] [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-[#20221C] [&_a]:text-[#6656B5] [&_a]:underline [&_a]:underline-offset-2">{children}</div></div></main><PublicFooter/></div>;
}
