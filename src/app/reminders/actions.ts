"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function completeTask(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Task ID is required.");
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("tasks").update({ completed_at: new Date().toISOString() }).eq("id", id).eq("user_id", user.id);
  if (error) throw new Error("Could not complete this task.");
  revalidatePath("/"); revalidatePath("/reminders");
}

export async function postponeTask(formData: FormData) {
  const id = String(formData.get("id") || "");
  const dueAt = String(formData.get("due_at") || "");
  if (!id || Number.isNaN(Date.parse(dueAt))) throw new Error("A valid reminder date is required.");
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("tasks").update({ due_at: dueAt }).eq("id", id).eq("user_id", user.id);
  if (error) throw new Error("Could not postpone this task.");
  revalidatePath("/"); revalidatePath("/reminders");
}

export async function completeFollowUp(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Application ID is required.");
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase.from("applications").update({ follow_up_date: null }).eq("id", id).eq("user_id", user.id).select("id").maybeSingle();
  if (error || !data) throw new Error("Could not complete this follow-up.");
  await supabase.from("application_events").insert({ user_id: user.id, application_id: id, event_type: "follow_up_completed", note: "Follow-up marked complete" });
  revalidatePath("/"); revalidatePath("/reminders"); revalidatePath("/applications");
}

export async function postponeFollowUp(formData: FormData) {
  const id = String(formData.get("id") || "");
  const date = String(formData.get("follow_up_date") || "");
  if (!id || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("A valid follow-up date is required.");
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("applications").update({ follow_up_date: date }).eq("id", id).eq("user_id", user.id);
  if (error) throw new Error("Could not postpone this follow-up.");
  revalidatePath("/"); revalidatePath("/reminders"); revalidatePath("/applications");
}
