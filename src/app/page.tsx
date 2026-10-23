import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Shell } from "@/components/shell";
import { BriefcaseBusiness, ArrowUpRight, Plus, CalendarClock } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/applications";
import { JobCardImage } from "@/components/job-card-image";
export const dynamic = "force-dynamic";
export default async function Home() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: apps }, { data: profile }, { data: tasks }, { count: total }, { count: active }, { count: interviews }, { count: offers }, { count: overdue }] = await Promise.all([
    supabase.from("applications").select("id,company_name,job_title,status,application_date,location,work_mode,job_url").is("archived_at", null).order("created_at", { ascending: false }).limit(5),
    supabase.from("profiles").select("full_name,timezone").eq("id", user.id).maybeSingle(),
    supabase.from("tasks").select("id,title,due_at,application_id").is("completed_at", null).is("dismissed_at", null).order("due_at").limit(5),
    supabase.from("applications").select("id", { count: "exact", head: true }).is("archived_at", null),
    supabase.from("applications").select("id", { count: "exact", head: true }).is("archived_at", null).in("status", ["Applied", "Assessment", "Interview", "On Hold"]),
    supabase.from("applications").select("id", { count: "exact", head: true }).is("archived_at", null).eq("status", "Interview"),
    supabase.from("applications").select("id", { count: "exact", head: true }).is("archived_at", null).eq("status", "Offer"),
    supabase.from("applications").select("id", { count: "exact", head: true }).is("archived_at", null).lte("follow_up_date", today).not("status", "in", "(Offer,Rejected,Withdrawn)"),
  ]);
  const rows = apps || [];
  const stats = [
    { label: "Total applications", value: total || 0, href: "/applications" },
    { label: "Active", value: active || 0, href: "/applications?status=active" },
    { label: "Interviews", value: interviews || 0, href: "/applications?status=Interview" },
    { label: "Offers", value: offers || 0, href: "/applications?status=Offer" },
  ];
  const firstName = profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";
  return <Shell name={firstName}><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#65695F]">{new Intl.DateTimeFormat("en-IN", { weekday: "long", month: "long", day: "numeric", timeZone: profile?.timezone || "Asia/Kolkata" }).format(new Date())}</p><h1 className="mt-2 font-[family-name:var(--font-editorial)] text-[36px] font-normal leading-tight tracking-[-0.03em] text-[#20221C] md:text-[46px]">Welcome back, {firstName}.</h1><p className="mt-2 text-sm text-[#65695F]">Good to have you here. Here’s your job search at a glance.</p></div><Link href="/applications?new=1" className="inline-flex items-center gap-2 rounded-md bg-[#C1E944] px-4 py-2.5 text-sm font-semibold text-[#20221C] hover:bg-[#B1D83B]"><Plus size={17}/>Add application</Link></div>
    <section aria-label="Application metrics" className="mt-7 grid grid-cols-2 divide-x divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white sm:grid-cols-4 sm:divide-y-0">{stats.map(({label,value,href})=><Link key={label} href={href} className="group px-5 py-4 hover:bg-slate-50 sm:px-6 sm:py-5"><span className="text-xs font-medium text-slate-500">{label}</span><span className="mt-2 flex items-end justify-between"><span className="font-mono text-[28px] font-medium leading-none tabular-nums tracking-tight text-[#20221C]">{value}</span><ArrowUpRight className="text-slate-300 transition-colors group-hover:text-indigo-600" size={16}/></span><span className="sr-only">View matching applications</span></Link>)}</section>
    <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]"><section className="overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold">Recent applications</h2><p className="mt-1 text-xs text-slate-500">Your latest opportunities</p></div><Link href="/applications" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</Link></div>{rows.length ? <div className="divide-y divide-slate-100">{rows.slice(0,5).map((app)=><Link href={`/applications/${app.id}`} key={app.id} className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-slate-50"><div className="flex min-w-0 items-center gap-3"><JobCardImage company={app.company_name} jobUrl={app.job_url} size={42}/><div className="min-w-0"><p className="truncate text-sm font-medium">{app.job_title}</p><p className="mt-1 truncate text-xs text-slate-500">{app.company_name} · {app.location || app.work_mode || "Location not set"}</p></div></div><div className="shrink-0 text-right"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{app.status}</span><p className="mt-2 text-xs text-slate-400">{formatDate(app.application_date)}</p></div></Link>)}</div> : <div className="px-5 py-12 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><BriefcaseBusiness size={22}/></span><h3 className="mt-4 font-medium">Your next opportunity starts here</h3><p className="mx-auto mt-1 max-w-xs text-sm text-slate-500">Add an application and keep every detail, follow-up, and update in one place.</p><Link href="/applications?new=1" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600"><Plus size={16}/>Add your first application</Link></div>}</section>
    <div className="space-y-5"><section className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Follow-ups</h2><p className="mt-1 text-xs text-slate-500">Stay on top of what’s next</p></div><span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-50 text-rose-600"><CalendarClock size={18}/></span></div><div className="mt-5 rounded-lg bg-rose-50 p-4"><p className="text-2xl font-semibold text-rose-700">{overdue}</p><p className="mt-1 text-sm text-rose-700">Follow-ups due or overdue</p></div>{(tasks || []).length > 0 && <div className="mt-3 space-y-2">{tasks!.map(task=><p key={task.id} className="text-sm text-slate-600">• {task.title}</p>)}</div>}</section></div></div>
    </Shell>;
}

