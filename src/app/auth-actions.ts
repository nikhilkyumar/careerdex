"use server";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
export async function signIn(formData:FormData){const supabase=await createClient();const {error}=await supabase.auth.signInWithPassword({email:String(formData.get("email")),password:String(formData.get("password"))});if(error)redirect(`/login?error=${encodeURIComponent(error.message)}`);redirect("/");}
export async function signUp(formData:FormData){const supabase=await createClient();const {error}=await supabase.auth.signUp({email:String(formData.get("email")),password:String(formData.get("password")),options:{data:{full_name:String(formData.get("full_name"))}}});if(error)redirect(`/signup?error=${encodeURIComponent(error.message)}`);redirect("/login?message=Check+your+email+to+confirm+your+account");}
async function googleOAuth(errorPath: "/login" | "/signup") {
  const supabase = await createClient();
  const requestOrigin = (await headers()).get("origin");
  const siteUrl = requestOrigin || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const cookieStore = await cookies();
  cookieStore.set("careerdex_oauth_error_path", errorPath, {
    httpOnly: true,
    sameSite: "lax",
    secure: siteUrl.startsWith("https://"),
    path: "/auth/callback",
    maxAge: 10 * 60,
  });
  const callbackUrl = new URL("/auth/callback", siteUrl);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl.toString() },
  });
  if (error) {
    cookieStore.delete("careerdex_oauth_error_path");
    console.error("Could not start Google OAuth:", error.message);
    const detail = error.message.toLowerCase();
    const message = detail.includes("unsupported provider") || detail.includes("provider is not enabled")
      ? "Google sign-in is not enabled in Supabase yet. Configure Google under Authentication → Sign In / Providers."
      : "Google sign-in could not be started. Please try again.";
    redirect(`${errorPath}?error=${encodeURIComponent(message)}`);
  }
  if (data.url) redirect(data.url);
  redirect(`${errorPath}?error=${encodeURIComponent("Google sign-in could not be started. Please try again.")}`);
}
export async function signInWithGoogle() { await googleOAuth("/login"); }
export async function signUpWithGoogle() { await googleOAuth("/signup"); }
export async function resetPassword(formData:FormData){const supabase=await createClient();const {error}=await supabase.auth.resetPasswordForEmail(String(formData.get("email")),{redirectTo:`${process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"}/auth/callback?next=/settings`});if(error)redirect(`/login?error=${encodeURIComponent(error.message)}`);redirect("/login?message=Password+reset+link+sent");}
