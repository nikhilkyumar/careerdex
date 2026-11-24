
import type { Metadata } from "next";
import { Manrope, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const editorial = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-editorial",
});

const technical = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-technical",
});

export const metadata: Metadata = {
  title: "CareerDex · Job search, in control",
  description: "Track applications, interviews, and follow-ups in one calm workspace.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: { title: "CareerDex · Your job search, in clear focus", description: "Track applications, interviews, and follow-ups in one calm workspace.", url: "/", siteName: "CareerDex", type: "website" },
  twitter: { card: "summary_large_image", title: "CareerDex · Your job search, in clear focus", description: "Track applications, interviews, and follow-ups in one calm workspace." },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${editorial.variable} ${technical.variable}`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
