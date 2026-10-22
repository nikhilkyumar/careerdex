
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STATUSES } from "@/lib/applications";
import { z } from "zod";

/*
 * Normalize optional form values.
 * HTML forms may send empty strings, while missing fields are undefined.
 */
function normalizeEmptyString(value: unknown): unknown {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return value;
}

/* Optional text fields */
const optionalText = (maxLength: number) =>
  z.preprocess(
    normalizeEmptyString,
    z.string().max(maxLength, `Maximum ${maxLength} characters allowed`)
  );

/* Optional URLs: blank is allowed, but populated URLs must be valid HTTP(S). */
const optionalUrl = z.preprocess(
  normalizeEmptyString,
  z.union([
    z.literal(""),
    z
      .string()
      .url("Enter a valid URL")
      .refine(
        (value) => /^https?:\/\//i.test(value),
        "URL must start with http:// or https://"
      ),
  ])
);

/* Optional date fields: blank is allowed. */
const optionalDate = z.preprocess(
  normalizeEmptyString,
  z.union([z.literal(""), z.string().date()])
);

/* Optional salary values must be non-negative numbers when provided. */
const optionalSalary = z.preprocess(
  normalizeEmptyString,
  z.string().refine(
    (value) =>
      value === "" ||
      (Number.isFinite(Number(value)) && Number(value) >= 0),
    "Enter a valid non-negative salary"
  )
);

/* Application form validation */
const applicationSchema = z
  .object({
    company_name: z
      .string()
      .trim()
      .min(1, "Company name is required")
      .max(160),

    job_title: z
      .string()
      .trim()
      .min(1, "Job title is required")
      .max(160),

    // Required: the form should prefill today's date,
    // but the user can select another valid date.
    application_date: z.string().date(),

    status: z.preprocess(
      (value) =>
        value === undefined || value === null || value === ""
          ? "Applied"
          : value,
      z.enum(STATUSES)
    ),

    job_url: optionalUrl,
    careers_url: optionalUrl,

    location: optionalText(160),

    work_mode: z.preprocess(
      (value) =>
        value === undefined || value === null || value === ""
          ? "Not specified"
          : value,
      z.enum(["On-site", "Hybrid", "Remote", "Not specified"])
    ),

    employment_type: z.preprocess(
      (value) =>
        value === undefined || value === null || value === ""
          ? "Full-time"
          : value,
      z.enum(["Full-time", "Internship", "Part-time", "Contract", "Other"])
    ),

    source: optionalText(200),
    opportunity_type: optionalText(100),

    salary_min: optionalSalary,
    salary_max: optionalSalary,

    salary_currency: z.preprocess(
      (value) =>
        typeof value === "string" && value.trim() !== ""
          ? value.trim().toUpperCase()
          : "INR",
      z.string().min(1).max(10)
    ),

    follow_up_date: optionalDate,
    notes: optionalText(5000),
  })
  .superRefine((data, ctx) => {
    if (
      data.salary_min !== "" &&
      data.salary_max !== "" &&
      Number(data.salary_min) > Number(data.salary_max)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["salary_max"],
        message:
          "Maximum salary must be greater than or equal to minimum salary",
      });
    }
  });

/*
 * Create or update an application.
 */
export async function saveApplication(formData: FormData) {
  const parsed = applicationSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => {
      const field = issue.path.join(".") || "form";
      return `${field}: ${issue.message}`;
    });

    // Detailed information appears in the terminal running Next.js.
    console.error("Application validation errors:", errors);

    // During development, include the field errors in the thrown message.
    throw new Error(`Please check the form: ${errors.join("; ")}`);
  }

  const d = parsed.data;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") || "");

  const payload = {
    company_name: d.company_name,
    job_title: d.job_title,
    application_date: d.application_date,
    status: d.status,

    job_url: d.job_url || null,
    careers_url: d.careers_url || null,
    location: d.location || null,

    work_mode: d.work_mode,
    employment_type: d.employment_type,

    source: d.source || null,
    opportunity_type: d.opportunity_type || null,

    salary_min:
      d.salary_min !== "" ? Number(d.salary_min) : null,

    salary_max:
      d.salary_max !== "" ? Number(d.salary_max) : null,

    salary_currency: d.salary_currency || "INR",
    follow_up_date: d.follow_up_date || null,
    notes: d.notes || null,
  };

  /* Update an existing application */
  if (id) {
    const { data: previous, error: previousError } = await supabase
      .from("applications")
      .select("status")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (previousError) {
      throw new Error(previousError.message);
    }

    if (!previous) {
      throw new Error("Application not found or access denied.");
    }

    const statusChanged = previous.status !== d.status;

    const { data: updated, error } = await supabase
      .from("applications")
      .update({
        ...payload,
        ...(statusChanged
          ? { last_status_changed_at: new Date().toISOString() }
          : {}),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!updated) {
      throw new Error("Application could not be updated.");
    }

    if (statusChanged) {
      const { error: eventError } = await supabase
        .from("application_events")
        .insert({
          user_id: user.id,
          application_id: id,
          event_type: "status_change",
          previous_status: previous.status,
          new_status: d.status,
        });

      if (eventError) {
        console.error("Status history insert failed:", eventError.message);
      }
    }

    revalidatePath(`/applications/${id}`);
    revalidatePath("/");
    revalidatePath("/applications");

    redirect(`/applications/${id}`);
  }

  /* Create a new application */
  const { data, error } = await supabase
    .from("applications")
    .insert({
      ...payload,
      user_id: user.id,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  /* Record the initial application event */
  const { error: eventError } = await supabase
    .from("application_events")
    .insert({
      user_id: user.id,
      application_id: data.id,
      event_type: "application_created",
      new_status: d.status,
      note: "Application added",
    });

  if (eventError) {
    // The application itself was saved, so do not make the user
    // submit the form again and accidentally create a duplicate.
    console.error("Application event insert failed:", eventError.message);
  }

  revalidatePath("/");
  revalidatePath("/applications");

  redirect("/applications");
}

/*
 * Change application status from a card, table, or detail page.
 */
export async function changeStatus(formData: FormData) {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");

  if (!id) {
    throw new Error("Application ID is required.");
  }

  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    throw new Error("Invalid status.");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: app, error: findError } = await supabase
    .from("applications")
    .select("status")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (findError) {
    throw new Error(findError.message);
  }

  if (!app) {
    throw new Error("Application not found or access denied.");
  }

  if (app.status === status) {
    revalidatePath("/");
    revalidatePath("/applications");
    revalidatePath(`/applications/${id}`);
    return;
  }

  const { data: updated, error } = await supabase
    .from("applications")
    .update({
      status,
      last_status_changed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!updated) {
    throw new Error("Application status could not be updated.");
  }

  const { error: eventError } = await supabase
    .from("application_events")
    .insert({
      user_id: user.id,
      application_id: id,
      event_type: "status_change",
      previous_status: app.status,
      new_status: status,
    });

  if (eventError) {
    console.error("Status history insert failed:", eventError.message);
  }

  revalidatePath("/");
  revalidatePath("/applications");
  revalidatePath(`/applications/${id}`);
}

/*
 * Archive an application without permanently deleting it.
 */
export async function archiveApplication(formData: FormData) {
  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Application ID is required.");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: archived, error } = await supabase
    .from("applications")
    .update({
      archived_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!archived) {
    throw new Error("Application not found or access denied.");
  }

  revalidatePath("/");
  revalidatePath("/applications");

  redirect("/applications");
}

/* Permanently delete an application and its related records. */
export async function deleteApplication(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Application ID is required.");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: deleted, error } = await supabase
    .from("applications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!deleted) throw new Error("Application not found or access denied.");

  revalidatePath("/");
  revalidatePath("/applications");
  revalidatePath(`/applications/${id}`);
  redirect("/applications");
}
