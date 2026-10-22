
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
  description: "A calm workspace for your job search.",
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
