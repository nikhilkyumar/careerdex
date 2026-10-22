export const STATUSES = ["Applied", "Assessment", "Interview", "Offer", "Rejected", "Withdrawn", "On Hold"] as const;
export type ApplicationStatus = typeof STATUSES[number];
export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: "bg-[#E8E8DF] text-[#53574E]", Assessment: "bg-[#EEEAF7] text-[#514294]", Interview: "bg-[#F3EBDD] text-[#79500F]", Offer: "bg-[#E5F0E8] text-[#26784D]", Rejected: "bg-[#F5E7E4] text-[#B33D3A]", Withdrawn: "bg-[#E8E8DF] text-[#65695F]", "On Hold": "bg-[#F3EBDD] text-[#79500F]",
};
export function localDateValue(date = new Date(), timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const part = (type: string) => parts.find((item) => item.type === type)?.value || "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function formatDate(value: string) { return new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
export function currency(value: number | null, code = "INR") { return value == null ? "" : new Intl.NumberFormat("en-IN", { style: "currency", currency: code, maximumFractionDigits: 0 }).format(value); }
