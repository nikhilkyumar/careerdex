import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, CalendarClock, ListChecks, Mail } from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public-site";

export const metadata: Metadata = {
  title: "About us · CareerDex",
  description: "Learn why CareerDex brings job applications, updates, and follow-ups into one clear workspace.",
};

const email = process.env.CONTACT_EMAIL;
const github = process.env.CONTACT_GITHUB_USERNAME;
const linkedin = process.env.CONTACT_LINKEDIN_USERNAME;

const principles = [
  { icon: BriefcaseBusiness, title: "One clear pipeline", body: "Keep every role and its current stage together, from the first application through an offer or a decision." },
  { icon: ListChecks, title: "Useful details, in context", body: "Keep job links, notes, salary ranges, and application details beside the opportunity they belong to." },
  { icon: CalendarClock, title: "Follow through", body: "Set follow-up dates and reminders so the next step is easier to see and act on." },
];

export default function AboutPage() {
  return <div className="min-h-screen bg-[#F1F0E9] text-[#20221C]"><PublicHeader/><main className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
    <div className="max-w-3xl"><p className="font-mono text-xs uppercase tracking-[.16em] text-[#6656B5]">About CareerDex</p><h1 className="mt-5 font-[family-name:var(--font-editorial)] text-5xl leading-[1.02] tracking-tight sm:text-7xl">A little more clarity for the job search.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-[#65695F]">CareerDex is a focused workspace for keeping job applications, interview progress, and follow-ups in one place. It is built to make the process easier to see, remember, and manage.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/signup" className="rounded-lg bg-[#C1E944] px-5 py-3 text-sm font-bold hover:bg-[#B1D83B]">Create your workspace <span aria-hidden="true">→</span></Link><Link href="/contact" className="rounded-lg border border-[#D5D6CB] bg-[#FAF9F4] px-5 py-3 text-sm font-semibold hover:bg-white">Get in touch</Link></div></div>
    <section aria-label="What CareerDex helps with" className="mt-14 grid gap-4 md:grid-cols-3">{principles.map(({ icon: Icon, title, body }) => <article key={title} className="rounded-xl border border-[#D5D6CB] bg-[#FAF9F4] p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#E8E8DF] text-[#6656B5]"><Icon size={20}/></span><h2 className="mt-5 text-lg font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-[#65695F]">{body}</p></article>)}</section>
    <section className="mt-10 grid gap-8 rounded-xl border border-[#D5D6CB] bg-[#FAF9F4] p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center"><div><p className="font-mono text-xs uppercase tracking-[.12em] text-[#6656B5]">Made for the next step</p><h2 className="mt-3 text-2xl font-semibold tracking-tight">Your search deserves a home of its own.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#65695F]">Start with the details you have, update progress as things change, and keep the next follow-up visible.</p></div><div className="flex flex-wrap gap-3">{email && <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-lg border border-[#D5D6CB] px-4 py-3 text-sm font-semibold hover:bg-white"><Mail size={16}/>Email us</a>}{github && <a href={`https://github.com/${github}/careerdex`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#D5D6CB] px-4 py-3 text-sm font-semibold hover:bg-white">GitHub <ArrowUpRight size={15}/></a>}{linkedin && <a href={`https://www.linkedin.com/in/${linkedin}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#D5D6CB] px-4 py-3 text-sm font-semibold hover:bg-white">LinkedIn <ArrowUpRight size={15}/></a>}</div></section>
  </main><PublicFooter/></div>;
}
