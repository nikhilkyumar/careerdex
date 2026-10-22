"use client";

import { Trash2 } from "lucide-react";
import { deleteApplication } from "./actions";

export function DeleteApplicationButton({ id, title, company, compact = false }: {
  id: string;
  title: string;
  company: string;
  compact?: boolean;
}) {
  const label = `Delete ${title} at ${company}`;
  return <form action={deleteApplication} onSubmit={(event) => {
    if (!window.confirm(`Permanently delete ${title} at ${company}? This cannot be undone.`)) event.preventDefault();
  }}>
    <input type="hidden" name="id" value={id}/>
    <button type="submit" title={label} aria-label={label} className={compact
      ? "inline-flex items-center gap-1 text-xs text-[#B33D3A] hover:text-[#8D2F2C]"
      : "inline-flex items-center gap-2 rounded-lg border border-[#E0C9C5] px-3 py-2.5 text-sm text-[#B33D3A] hover:bg-[#F5E7E4]"}>
      <Trash2 size={compact ? 14 : 16}/>{compact ? "Delete" : "Delete permanently"}
    </button>
  </form>;
}
