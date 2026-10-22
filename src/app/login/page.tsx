import Link from "next/link";
import { signIn, resetPassword } from "@/app/auth-actions";
import { Brand } from "@/components/shell";

const field = "mt-1.5 w-full rounded-md border border-[#D5D6CB] bg-[#FAF9F4] px-3 py-2.5 text-sm text-[#20221C] placeholder:text-[#85897F] focus:border-[#6656B5] focus:outline-none focus:ring-2 focus:ring-[#6656B5]/15";

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const sp = await searchParams;
  return <main className="grid min-h-screen place-items-center bg-[#F1F0E9] px-4 py-10">
    <div className="w-full max-w-[420px] rounded-xl border border-[#D5D6CB] bg-[#FAF9F4] p-7 shadow-[0_12px_36px_-30px_rgba(32,34,28,0.22)] sm:p-9">
      <Brand />
      <h1 className="mt-9 text-[28px] font-semibold tracking-[-0.04em] text-[#20221C]">Welcome back</h1>
      <p className="mt-2 text-sm text-[#65695F]">Sign in to pick up where you left off.</p>
      {sp.error && <p role="alert" className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{sp.error}</p>}
      {sp.message && <p role="status" className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{sp.message}</p>}
      <form action={signIn} className="mt-7 space-y-4">
        <label className="block text-sm font-medium text-[#303442]">Email<input required type="email" name="email" autoComplete="email" className={field}/></label>
        <label className="block text-sm font-medium text-[#303442]">Password<input required type="password" name="password" autoComplete="current-password" className={field}/></label>
        <button className="w-full rounded-md bg-[#C1E944] py-2.5 text-sm font-semibold text-[#20221C] hover:bg-[#B1D83B]">Sign in</button>
      </form>
      <details className="mt-4">
        <summary className="w-fit cursor-pointer text-sm font-medium text-[#6656B5] hover:text-[#514294]">Forgot password?</summary>
        <form action={resetPassword} className="mt-3 flex gap-2"><input required type="email" name="email" placeholder="Your account email" className={`min-w-0 flex-1 ${field}`}/><button className="rounded-md border border-[#D5D6CB] px-3 text-sm text-[#65695F] hover:bg-slate-50">Send link</button></form>
      </details>
      <p className="mt-7 border-t border-[#D5D6CB] pt-5 text-center text-sm text-[#65695F]">New to CareerDex? <Link href="/signup" className="font-medium text-[#6656B5] hover:text-[#514294]">Create an account</Link></p>
    </div>
  </main>;
}
