import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Shell } from "@/components/shell";
import { ApplicationList } from "./application-list";
import { STATUSES } from "@/lib/applications";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 25;

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const requestedPage = Number.parseInt(params.page || "1", 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;
  const search = (params.q || "").trim().replace(/[,.()%_*"\\]/g, " ").replace(/\s+/g, " ").slice(0, 80);
  const status = params.status || "all";
  const sortOptions = ["newest", "oldest", "company", "salary", "status"] as const;
  const { data: profile } = await supabase.from("profiles").select("full_name,timezone,preferences").eq("id", user.id).maybeSingle();
  const defaultSort = String((profile?.preferences as Record<string, unknown> | null)?.default_sort || "newest");
  const requestedSort = params.sort || defaultSort;
  const sort = sortOptions.includes(requestedSort as (typeof sortOptions)[number]) ? requestedSort : "newest";
  let query = supabase.from("applications")
    .select("id,company_name,job_title,status,application_date,location,work_mode,job_url,salary_min,salary_max,salary_currency,follow_up_date,employment_type", { count: "exact" })
    .is("archived_at", null);

  if (status === "active") query = query.in("status", ["Applied", "Assessment", "Interview", "On Hold"]);
  else if (STATUSES.includes(status as (typeof STATUSES)[number])) query = query.eq("status", status);
  if (search) {
    const pattern = `%${search}%`;
    query = query.or([
      `company_name.ilike.${pattern}`,
      `job_title.ilike.${pattern}`,
      `location.ilike.${pattern}`,
      `description.ilike.${pattern}`,
      `notes.ilike.${pattern}`,
      `job_url.ilike.${pattern}`,
      `recruiter_name.ilike.${pattern}`,
    ].join(","));
  }
  if (sort === "newest") query = query.order("created_at", { ascending: false });
  else if (sort === "oldest") query = query.order("created_at", { ascending: true });
  else if (sort === "company") query = query.order("company_name", { ascending: true });
  else if (sort === "salary") query = query.order("salary_max", { ascending: false, nullsFirst: false }).order("salary_min", { ascending: false, nullsFirst: false });
  else query = query.order("status", { ascending: true });
  const { data: applications, count, error } = await query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (error) throw new Error("Could not load applications. Please refresh and try again.");

  return <Shell name={profile?.full_name || undefined}>
    <div>
      <p className="text-sm font-medium text-indigo-600">Your pipeline</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Applications</h1>
      <p className="mt-2 text-sm text-slate-500">One place for every role, response, and next step.</p>
    </div>
    <ApplicationList
      applications={(applications || []) as never[]}
      defaults={{ ...((profile?.preferences || {}) as Record<string, unknown>), timezone: profile?.timezone }}
      searchParams={{ ...params, sort }}
      total={count || 0}
      page={page}
      pageSize={PAGE_SIZE}
    />
  </Shell>;
}
