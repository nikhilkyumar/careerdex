import Link from "next/link";
import { signUp } from "@/app/auth-actions";
import { Brand } from "@/components/shell";

const field = "mt-1.5 w-full rounded-md border border-[#D5D6CB] bg-[#FAF9F4] px-3 py-2.5 text-sm text-[#20221C] placeholder:text-[#85897F] focus:border-[#6656B5] focus:outline-none focus:ring-2 focus:ring-[#6656B5]/15";

export default async function Signup({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const sp = await searchParams;
  return <main className="grid min-h-screen place-items-center bg-[#F1F0E9] px-4 py-10">
    <div className="w-full max-w-[420px] rounded-xl border border-[#D5D6CB] bg-[#FAF9F4] p-7 shadow-[0_12px_36px_-30px_rgba(32,34,28,0.22)] sm:p-9">
      <Brand />
      <h1 className="mt-9 text-[28px] font-semibold tracking-[-0.04em] text-[#20221C]">Create your workspace</h1>
      <p className="mt-2 text-sm text-[#65695F]">A calmer way to organize your job search.</p>
      {sp.error && <p role="alert" className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{sp.error}</p>}
      <form action={signUp} className="mt-7 space-y-4">
        <label className="block text-sm font-medium text-[#303442]">Name<input name="full_name" autoComplete="name" className={field}/></label>
        <label className="block text-sm font-medium text-[#303442]">Email<input required type="email" name="email" autoComplete="email" className={field}/></label>
        <label className="block text-sm font-medium text-[#303442]">Password<input required minLength={8} type="password" name="password" autoComplete="new-password" className={field}/><span className="mt-1.5 block text-xs font-normal text-[#65695F]">Use at least 8 characters.</span></label>
        <button className="w-full rounded-md bg-[#C1E944] py-2.5 text-sm font-semibold text-[#20221C] hover:bg-[#B1D83B]">Create account</button>
      </form>
      <p className="mt-7 border-t border-[#D5D6CB] pt-5 text-center text-sm text-[#65695F]">Already have an account? <Link href="/login" className="font-medium text-[#6656B5] hover:text-[#514294]">Sign in</Link></p>
    </div>
  </main>;
}
