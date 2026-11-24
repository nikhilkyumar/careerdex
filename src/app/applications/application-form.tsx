"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoaderCircle, X } from "lucide-react";
import { saveApplication } from "./actions";
import { localDateValue } from "@/lib/applications";

const input = "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
const statuses = ["Applied", "Assessment", "Interview", "Offer", "Rejected", "Withdrawn", "On Hold"];
const options = (items: string[]) => items.map((item) => <option key={item}>{item}</option>);

export function ApplicationForm({ defaults, initial }: { defaults?: Record<string, unknown>; initial?: Record<string, unknown> }) {
  const params = useSearchParams();
  const [open, setOpen] = useState(params.get("new") === "1");
  const [state, formAction, pending] = useActionState(saveApplication, { error: undefined as string | undefined });
  const formRef = useRef<HTMLFormElement>(null);
  const submittedValues = useRef<Record<string, string>>({});
  useEffect(() => {
    if (!state.error || !formRef.current) return;
    for (const element of Array.from(formRef.current.elements)) {
      if (!(element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement)) continue;
      if (element.name in submittedValues.current && element.name !== "salary_min" && element.name !== "salary_max") {
        element.value = submittedValues.current[element.name];
      }
    }
  }, [state]);
  const prefKey = (key: string) => ({ status: "default_status", opportunity_type: "default_opportunity_type", employment_type: "default_employment_type", work_mode: "default_work_mode", source: "default_source", location: "default_location", salary_currency: "default_salary_currency" }[key] || key);
  const val = (key: string, fallback = "") => String(initial?.[key] ?? defaults?.[prefKey(key)] ?? fallback);
  const [salaryMin, setSalaryMin] = useState(val("salary_min"));
  const [salaryMax, setSalaryMax] = useState(val("salary_max"));
  const salaryError = salaryMin !== "" && salaryMax !== "" && Number(salaryMin) > Number(salaryMax);
  const timeZone = String(defaults?.timezone || "Asia/Kolkata");
  const suggestedFollowUp = () => {
    if (initial?.follow_up_date) return String(initial.follow_up_date);
    const date = new Date(); date.setDate(date.getDate() + Number(defaults?.follow_up_interval_days || 7));
    return localDateValue(date, timeZone);
  };
  if (!open) return <button onClick={() => setOpen(true)} className={initial ? "rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50" : "rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white"}>{initial ? "Edit application" : "Add application"}</button>;
  return <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-900/40 p-3 sm:p-6" role="dialog" aria-modal="true"><div className="mx-auto my-4 max-w-3xl rounded-2xl bg-white shadow-xl">
    <div className="flex items-center justify-between border-b px-6 py-5"><div><h2 className="text-lg font-semibold">{initial ? "Edit application" : "Add an application"}</h2><p className="mt-1 text-sm text-slate-500">Capture the details you have. You can fill in more later.</p></div><button onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close"><X size={19}/></button></div>
    <form ref={formRef} action={formAction} aria-busy={pending} onSubmit={(event) => { if (salaryError) { event.preventDefault(); return; } submittedValues.current = Object.fromEntries(Array.from(new FormData(event.currentTarget).entries(), ([key, value]) => [key, String(value)])); }} className="grid gap-5 p-6 sm:grid-cols-2">
      <input type="hidden" name="id" value={String(initial?.id || "")}/>
      {state.error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 sm:col-span-2">{state.error}</p>}
      <label className="text-sm font-medium">Company name *<input required name="company_name" defaultValue={val("company_name")} className={input}/></label>
      <label className="text-sm font-medium">Job title *<input required name="job_title" defaultValue={val("job_title")} className={input}/></label>
      <label className="text-sm font-medium">Application date *<input required type="date" name="application_date" defaultValue={val("application_date", localDateValue(new Date(), timeZone))} className={input}/></label>
      <label className="text-sm font-medium">Status<select name="status" defaultValue={val("status", "Applied")} className={input}>{options(statuses)}</select></label>
      <label className="text-sm font-medium">Job posting URL<input type="url" name="job_url" defaultValue={val("job_url")} placeholder="https://" className={input}/></label>
      <label className="text-sm font-medium">Location<input name="location" defaultValue={val("location")} placeholder="City or remote" className={input}/></label>
      <label className="text-sm font-medium">Work mode<select name="work_mode" defaultValue={val("work_mode", "Not specified")} className={input}>{options(["Not specified", "On-site", "Hybrid", "Remote"])}</select></label>
      <label className="text-sm font-medium">Employment type<select name="employment_type" defaultValue={val("employment_type", "Full-time")} className={input}>{options(["Full-time", "Internship", "Part-time", "Contract", "Other"])}</select></label>
      <label className="text-sm font-medium">Application source<select name="source" defaultValue={val("source", "Company Website")} className={input}>{options(["LinkedIn", "Company Website", "Referral", "College Placement Cell", "Naukri", "Indeed", "Other"])}</select></label>
      <label className="text-sm font-medium">Opportunity type<select name="opportunity_type" defaultValue={val("opportunity_type", "Off-campus")} className={input}>{options(["Campus", "Off-campus", "Internship", "Other"])}</select></label>
      <label className="text-sm font-medium">Salary minimum<input type="number" min="0" name="salary_min" value={salaryMin} onChange={(event) => setSalaryMin(event.target.value)} className={input}/></label>
      <label className="text-sm font-medium">Salary maximum<input type="number" min="0" name="salary_max" value={salaryMax} onChange={(event) => setSalaryMax(event.target.value)} aria-invalid={salaryError} className={input}/>{salaryError && <span role="alert" className="mt-1 block text-xs text-rose-700">Maximum salary must be at least the minimum salary.</span>}</label>
      <label className="text-sm font-medium">Currency<select name="salary_currency" defaultValue={val("salary_currency", "INR")} className={input}>{options(["INR", "USD", "EUR", "GBP", "CAD", "AUD"])}</select></label>
      <label className="text-sm font-medium">Follow-up date<input type="date" name="follow_up_date" defaultValue={suggestedFollowUp()} className={input}/></label>
      <label className="text-sm font-medium sm:col-span-2">Notes<textarea name="notes" rows={3} defaultValue={val("notes")} placeholder="Interview context, contact details, or next steps" className={input}/></label>
      <div className="flex justify-end gap-3 border-t pt-4 sm:col-span-2"><button type="button" onClick={() => setOpen(false)} disabled={pending} className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:opacity-60">Cancel</button><button type="submit" disabled={pending || salaryError} className="inline-flex min-w-40 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-wait disabled:bg-indigo-400">{pending && <LoaderCircle size={16} className="animate-spin" aria-hidden="true"/>}{pending ? "Saving application…" : initial ? "Save changes" : "Save application"}</button></div>
    </form>
  </div></div>;
}
