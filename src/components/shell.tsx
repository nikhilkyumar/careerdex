"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BriefcaseBusiness, LayoutDashboard, Settings, LogOut, Bell, CalendarClock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: BriefcaseBusiness },
  { href: "/reminders", label: "Follow-ups", icon: CalendarClock },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link href="/" aria-label="CareerDex home" className="group flex items-center gap-2.5">
    <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none" className="shrink-0">
      <rect x="2" y="2" width="28" height="28" rx="8" fill="#C1E944" />
      <rect x="8" y="8" width="10" height="13" rx="2" stroke="white" strokeWidth="1.7" />
      <path d="M13 24h11V12M20 12h4v4" stroke="#20221C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    {!compact && <span className="text-[17px] font-semibold tracking-[-0.04em] text-[#20221C]">CareerDex</span>}
  </Link>;
}

export function Shell({ children, name }: { children: React.ReactNode; name?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  async function signOut() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }
  const active = (href: string) => pathname === href || (href === "/applications" && pathname.startsWith(href));

  return <div className="min-h-screen bg-[#F1F0E9] text-[#20221C]">
    <header className="sticky top-0 z-20 border-b border-[#D5D6CB] bg-[#FAF9F4]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[62px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Brand />
        <nav aria-label="Main navigation" className="hidden h-full items-center gap-1 md:flex">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={active(href) ? "page" : undefined} className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-[13px] ${active(href) ? "bg-[#C1E944] font-semibold text-[#20221C]" : "text-[#65695F] hover:bg-[#E8E8DF] hover:text-[#20221C]"}`}><Icon size={16} strokeWidth={1.8}/>{label}</Link>)}</nav>
        <div className="flex items-center gap-2 sm:gap-3"><Link href="/reminders" aria-label="Follow-ups" title="Follow-ups" className="grid h-9 w-9 place-items-center rounded-md text-[#65695F] hover:bg-[#E8E8DF]"><Bell size={17} strokeWidth={1.8}/></Link><span className="hidden max-w-36 truncate border-l border-[#D5D6CB] pl-3 text-[13px] text-[#65695F] sm:block">{name || "Your workspace"}</span><button onClick={signOut} title="Sign out" aria-label="Sign out" className="grid h-9 w-9 place-items-center rounded-md text-[#65695F] hover:bg-[#E8E8DF]"><LogOut size={17} strokeWidth={1.8}/></button></div>
      </div>
    </header>
    <main className="mx-auto min-h-[calc(100vh-112px)] max-w-[1440px] px-4 pb-24 pt-7 sm:px-6 md:pb-10 md:pt-9 lg:px-8">{children}</main>
    <footer className="border-t border-[#D5D6CB] bg-[#FAF9F4] px-4 pb-24 pt-5 sm:px-6 md:py-5 lg:px-8"><div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 text-sm text-[#65695F]"><span>CareerDex · Your career, in clear focus.</span><Link href="/contact" className="inline-flex min-h-11 items-center rounded-lg bg-[#C1E944] px-5 text-sm font-bold text-[#20221C] hover:bg-[#B1D83B]">Contact us <span className="ml-2" aria-hidden="true">↗</span></Link></div></footer>
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-[#D5D6CB] bg-[#FAF9F4]/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur-sm md:hidden">{links.map(({href,label,icon:Icon})=><Link key={href} href={href} aria-current={active(href) ? "page" : undefined} className={`flex flex-col items-center gap-1 px-1 py-2 text-[10px] ${active(href) ? "font-semibold text-[#20221C]" : "text-[#65695F]"}`}><Icon size={18} strokeWidth={1.8}/>{label}</Link>)}</nav>
  </div>;
}
