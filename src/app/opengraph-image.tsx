import { ImageResponse } from "next/og";

export const alt = "CareerDex keeps your job applications and follow-ups in focus";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#F1F0E9", color: "#20221C", padding: 58, fontFamily: "sans-serif" }}>
      <div style={{ width: "51%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, fontWeight: 700 }}><svg width="40" height="40" viewBox="0 0 32 32" fill="none"><rect x="2" y="2" width="28" height="28" rx="8" fill="#C1E944"/><rect x="8" y="8" width="10" height="13" rx="2" stroke="white" strokeWidth="1.7"/><path d="M13 24h11V12M20 12h4v4" stroke="#20221C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>CareerDex</div>
        <h1 style={{ fontSize: 64, lineHeight: 1.04, letterSpacing: -3, margin: "36px 0 18px", fontWeight: 500 }}>Every opportunity,<br/><span style={{ color: "#6656B5" }}>in focus.</span></h1>
        <p style={{ fontSize: 22, lineHeight: 1.5, color: "#65695F", maxWidth: 500 }}>Applications, interviews, and follow-ups in one calm workspace.</p>
      </div>
      <div style={{ width: "49%", display: "flex", alignItems: "center", paddingLeft: 20 }}>
        <div style={{ width: "100%", borderRadius: 24, border: "1px solid #D5D6CB", background: "#FAF9F4", padding: 24, boxShadow: "0 24px 60px rgba(32,34,28,.12)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><div style={{ display: "flex", flexDirection: "column" }}><div style={{ color: "#65695F", fontSize: 13, letterSpacing: 2 }}>YOUR PIPELINE</div><div style={{ fontSize: 27, fontWeight: 700, marginTop: 5 }}>Applications</div></div><div style={{ background: "#C1E944", borderRadius: 10, padding: "12px 15px", fontSize: 14, fontWeight: 700 }}>+ Add application</div></div>
          {[["Product Designer", "Northstar Labs", "Interview", "#F3EBDD", "#79500F"], ["UX Researcher", "Goodkind", "Applied", "#E8E8DF", "#53574E"], ["Design Intern", "Brightline", "Offer", "#E5F0E8", "#26784D"]].map(([role, company, status, background, color]) => <div key={company} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "19px 14px", borderTop: "1px solid #E8E8DF" }}><div style={{ display: "flex", flexDirection: "column" }}><div style={{ fontSize: 17, fontWeight: 700 }}>{role}</div><div style={{ fontSize: 14, color: "#65695F", marginTop: 4 }}>{company}</div></div><span style={{ borderRadius: 99, padding: "8px 13px", background, color, fontSize: 14 }}>{status}</span></div>)}
          <div style={{ marginTop: 14, padding: 15, borderRadius: 12, background: "#E8E8DF", display: "flex", justifyContent: "space-between", fontSize: 15 }}><span>Next 7 days</span><strong>2 follow-ups →</strong></div>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
