import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

const ERROR_PATH_COOKIE = "careerdex_oauth_error_path";

function safeInternalPath(value: string | null, fallback: string) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

function loginError(request: NextRequest, message: string) {
  const errorPath = request.cookies.get(ERROR_PATH_COOKIE)?.value === "/signup" ? "/signup" : "/login";
  const url = new URL(errorPath, request.url);
  url.searchParams.set("error", message);
  const response = NextResponse.redirect(url);
  response.cookies.set(ERROR_PATH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/auth/callback",
    maxAge: 0,
  });
  return response;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const providerError = request.nextUrl.searchParams.get("error_description") || request.nextUrl.searchParams.get("error");
  if (providerError) return loginError(request, providerError);
  if (!code) return loginError(request, "Google sign-in did not complete. Please try again.");

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("OAuth callback code exchange failed:", error.message);
    return loginError(request, "We couldn't finish signing you in. Please try again.");
  }

  const next = safeInternalPath(request.nextUrl.searchParams.get("next"), "/");
  const response = NextResponse.redirect(new URL(next, request.url));
  response.cookies.set(ERROR_PATH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/auth/callback",
    maxAge: 0,
  });
  return response;
}
