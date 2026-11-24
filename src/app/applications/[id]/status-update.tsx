"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { STATUS_STYLES, STATUSES, type ApplicationStatus } from "@/lib/applications";
import { changeStatus } from "../actions";

export function StatusUpdate({ id, initialStatus }: { id: string; initialStatus: ApplicationStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [selected, setSelected] = useState(initialStatus);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const previous = status;
    setError(""); setStatus(selected);
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      try { await changeStatus(formData); router.refresh(); }
      catch { setStatus(previous); setError("Could not update status. Please try again."); }
    });
  }
  return <section className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-semibold">Update status</h2><div className="mt-3"><span aria-live="polite" className={`rounded-full px-2.5 py-1 text-xs ${STATUS_STYLES[status]}`}>{status}</span></div><form onSubmit={submit} className="mt-4 flex gap-2"><input type="hidden" name="id" value={id}/><select name="status" value={selected} onChange={(event) => setSelected(event.target.value as ApplicationStatus)} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm">{STATUSES.map((item) => <option key={item}>{item}</option>)}</select><button disabled={pending} className="min-w-24 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{pending ? "Updating…" : "Update"}</button></form>{error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}</section>;
}
