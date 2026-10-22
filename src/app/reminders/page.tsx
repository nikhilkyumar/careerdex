import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarClock, Check, Clock3 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Shell } from "@/components/shell";
import { formatDate, localDateValue } from "@/lib/applications";
import { completeFollowUp, completeTask, postponeFollowUp, postponeTask } from "./actions";

export const dynamic = "force-dynamic";
export default async function RemindersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("full_name,timezone").eq("id", user.id).maybeSingle();
  const today = localDateValue(new Date(), profile?.timezone || "Asia/Kolkata");
  const endDate = new Date(`${today}T12:00:00`);
  endDate.setDate(endDate.getDate() + 7);
  const end = localDateValue(endDate, profile?.timezone || "Asia/Kolkata");
  const endTimestamp = `${end}T23:59:59`;
  const [{ data: applications }, { data: tasks }] = await Promise.all([
    supabase.from("applications").select("id,company_name,job_title,follow_up_date,status").is("archived_at", null).not("follow_up_date", "is", null).lte("follow_up_date", end).not("status", "in", "(Offer,Rejected,Withdrawn)").order("follow_up_date").limit(100),
    supabase.from("tasks").select("id,title,due_at,application_id").is("completed_at", null).is("dismissed_at", null).not("due_at", "is", null).lte("due_at", endTimestamp).order("due_at").limit(100),
  ]);
  const hasItems = Boolean(applications?.length || tasks?.length);
  return <Shell name={profile?.full_name || undefined}>
    <div><p className="text-sm font-medium text-indigo-600">Your next steps</p><h1 className="mt-1 text-2xl font-semibold">Reminders</h1><p className="mt-2 text-sm text-slate-500">Follow-ups and tasks due now or in the next seven days.</p></div>
    {!hasItems ? <section className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><CalendarClock size={22}/></span><h2 className="mt-4 font-medium">You’re all caught up</h2><p className="mt-2 text-sm text-slate-500">Scheduled follow-ups and tasks will appear here.</p><Link href="/applications" className="mt-4 inline-block text-sm font-medium text-indigo-600">View applications</Link></section> : <div className="mt-6 grid gap-5 lg:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="flex items-center gap-2 font-semibold"><CalendarClock size={18} className="text-indigo-600"/>Application follow-ups</h2><div className="mt-4 divide-y divide-slate-100">{applications?.map(app=><article key={app.id} className="py-4 first:pt-0 last:pb-0"><div className="flex items-start justify-between gap-3"><div><Link href={`/applications/${app.id}`} className="font-medium hover:text-indigo-600">{app.job_title}</Link><p className="mt-1 text-sm text-slate-500">{app.company_name} · due {formatDate(app.follow_up_date!)}</p></div><span className={`rounded-full px-2.5 py-1 text-xs ${app.follow_up_date! < today ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{app.follow_up_date! < today ? "Overdue" : "Due soon"}</span></div><div className="mt-3 flex flex-wrap gap-2"><form action={completeFollowUp}><input type="hidden" name="id" value={app.id}/><button className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white"><Check size={14}/>Done</button></form><form action={postponeFollowUp} className="flex gap-2"><input type="hidden" name="id" value={app.id}/><input type="date" name="follow_up_date" min={today} defaultValue={localDateValue(new Date(Date.now()+7*86400000),profile?.timezone||"Asia/Kolkata")} className="rounded-lg border border-slate-200 px-2 py-1 text-xs"/><button className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600">Reschedule</button></form></div></article>)}</div>{!applications?.length&&<p className="mt-4 text-sm text-slate-500">No application follow-ups due.</p>}</section>
      <section className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="flex items-center gap-2 font-semibold"><Clock3 size={18} className="text-amber-600"/>Tasks</h2><div className="mt-4 divide-y divide-slate-100">{tasks?.map(task=><article key={task.id} className="py-4 first:pt-0 last:pb-0"><p className="font-medium">{task.title}</p><p className="mt-1 text-sm text-slate-500">Due {new Date(task.due_at!).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short",timeZone:profile?.timezone||"Asia/Kolkata"})}</p><div className="mt-3 flex gap-2"><form action={completeTask}><input type="hidden" name="id" value={task.id}/><button className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white"><Check size={14}/>Complete</button></form><form action={postponeTask}><input type="hidden" name="id" value={task.id}/><input type="hidden" name="due_at" value={new Date(Date.now()+7*86400000).toISOString()}/><button className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600">Postpone 7 days</button></form></div></article>)}</div>{!tasks?.length&&<p className="mt-4 text-sm text-slate-500">No tasks due this week.</p>}</section>
    </div>}
  </Shell>;
}
