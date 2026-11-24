import { GoogleAuthSubmit } from "@/components/google-auth-submit";

export function GoogleAuthButton({ action, label, dividerPosition = "before" }: { action: () => Promise<void>; label: string; dividerPosition?: "before" | "after" }) {
  return <>
    {dividerPosition === "before" && <div aria-hidden="true" className="my-5 flex items-center gap-3 text-xs text-[#85897F]"><span className="h-px flex-1 bg-[#D5D6CB]"/><span>or</span><span className="h-px flex-1 bg-[#D5D6CB]"/></div>}
    <form action={action}>
      <GoogleAuthSubmit label={label}/>
    </form>
    {dividerPosition === "after" && <div aria-hidden="true" className="my-5 flex items-center gap-3 text-xs text-[#85897F]"><span className="h-px flex-1 bg-[#D5D6CB]"/><span>or</span><span className="h-px flex-1 bg-[#D5D6CB]"/></div>}
  </>;
}
