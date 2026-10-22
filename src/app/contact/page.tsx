import { ArrowUpRight, Bug, Github, Linkedin, Mail } from "lucide-react";
import { Shell } from "@/components/shell";

const EMAIL = "nikhilkumar.cout@gmail.com";
const GITHUB = "nikhilkyumar";
const LINKEDIN = "nikhilkyumar";

const contacts = [
  { label: "Email", value: EMAIL, href: `mailto:${EMAIL}`, icon: Mail },
  { label: "GitHub", value: GITHUB, href: `https://github.com/${GITHUB}`, icon: Github },
  { label: "LinkedIn", value: LINKEDIN, href: `https://www.linkedin.com/in/${LINKEDIN}`, icon: Linkedin },
];

export const metadata = {
  title: "Contact · CareerDex",
  description: "Contact the CareerDex creator.",
};

export default function ContactPage() {
  return <Shell><div className="max-w-3xl">
    <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#65695F]">CAREERDEX / CONTACT</p>
    <h1 className="mt-4 font-[family-name:var(--font-editorial)] text-5xl font-normal tracking-tight text-[#20221C] sm:text-6xl">Let’s talk.</h1>
    <p className="mt-4 max-w-xl text-base leading-7 text-[#65695F]">Questions, feedback, or an idea to share? Choose the best way to reach me.</p>

    <div className="mt-8 divide-y divide-[#D5D6CB] border-y border-[#D5D6CB]">
      {contacts.map(({ label, value, href, icon: Icon }) => <a key={label} href={href} target={label === "Email" ? undefined : "_blank"} rel={label === "Email" ? undefined : "noreferrer"} className="group flex min-h-[88px] items-center justify-between gap-4 px-3 py-5 transition-colors hover:bg-[#E8E8DF]/70 sm:px-5">
        <span className="flex min-w-0 items-center gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#E8E8DF] text-[#20221C]"><Icon size={21} strokeWidth={1.8}/></span><span className="min-w-0"><span className="block text-sm text-[#65695F]">{label}</span><span className="mt-1 block break-all text-base font-bold text-[#20221C] sm:text-lg">{value}</span></span></span>
        <ArrowUpRight size={19} className="shrink-0 text-[#85897F] transition-colors group-hover:text-[#6656B5]"/>
      </a>)}
    </div>

    <div className="mt-8 flex flex-wrap gap-3">
      <a href={`mailto:${EMAIL}`} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#C1E944] px-5 text-base font-bold text-[#20221C] hover:bg-[#B1D83B] sm:flex-none"><Mail size={18}/>Contact me</a>
      <a href={`https://github.com/${GITHUB}/careerdex/issues/new`} target="_blank" rel="noreferrer" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-[#D5D6CB] bg-[#FAF9F4] px-5 text-base font-bold text-[#20221C] hover:bg-[#E8E8DF] sm:flex-none"><Bug size={18}/>Report an issue <ArrowUpRight size={16}/></a>
    </div>
    <p className="mt-4 text-xs text-[#65695F]">Issue reports open GitHub in a new tab.</p>
  </div></Shell>;
}
