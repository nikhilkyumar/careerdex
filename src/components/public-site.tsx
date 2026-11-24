import Link from "next/link";
import { Brand } from "@/components/shell";

export function PublicHeader() {
  return <header className="border-0 bg-transparent shadow-none"><div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between gap-4 px-5 sm:px-8"><Brand/><nav aria-label="Public navigation" className="flex items-center gap-1 sm:gap-3"><Link href="/login" className="rounded-lg px-3 py-2 font-sans text-[15px] font-semibold hover:bg-white">Sign in</Link><Link href="/signup" className="rounded-lg bg-[#C1E944] px-4 py-2.5 font-sans text-[15px] font-bold hover:bg-[#B1D83B]">Get started <span aria-hidden="true">→</span></Link></nav></div></header>;
}

export function PublicFooter() {
  return <footer className="border-t border-[#D5D6CB] bg-[#FAF9F4]"><div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 text-sm text-[#65695F] sm:flex-row sm:items-center sm:justify-between sm:px-8"><span>CareerDex · Your career, in clear focus.</span><nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2"><Link href="/about" className="hover:text-[#20221C]">About us</Link><Link href="/contact" className="hover:text-[#20221C]">Contact us</Link><Link href="/privacy" className="hover:text-[#20221C]">Privacy</Link><Link href="/terms" className="hover:text-[#20221C]">Terms</Link><Link href="/signup" className="font-semibold text-[#20221C] hover:text-[#6656B5]">Build your workspace →</Link></nav></div></footer>;
}

export function PublicInfoLinks() {
  return <nav aria-label="Information pages" className="flex justify-center gap-5 text-sm text-[#65695F]"><Link href="/about" className="hover:text-[#20221C]">About us</Link><Link href="/contact" className="hover:text-[#20221C]">Contact us</Link></nav>;
}
