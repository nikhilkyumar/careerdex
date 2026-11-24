import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy · CareerDex",
  description: "How CareerDex collects, uses, and protects information when you use the service.",
};

export default function PrivacyPage() {
  return <LegalPage eyebrow="CareerDex / Privacy" title="Privacy Policy" intro="This policy explains what information CareerDex handles, why it is needed, and the choices available to you. CareerDex is a job application tracking workspace.">
    <section><h2>Information we handle</h2><p>When you create an account, we receive your email address and authentication details. If you sign in with Google, Google provides basic account information such as your email address, name, and provider identifier through the sign-in flow. We use this information only to authenticate you, create and secure your CareerDex account, and show your account identity. CareerDex does not use Google user data for advertising, sell it, or use it for purposes unrelated to providing the service.</p><p className="mt-2">You may add application information such as employer and role names, job links, status, dates, salary ranges, contacts, notes, and reminders. This content is associated with your account so CareerDex can provide the tracking features you request.</p></section>
    <section><h2>How we use information</h2><p>We use account information to provide sign-in and account support; application details to organize your job search; and limited service usage information to maintain and understand site performance. We do not sell personal information or use Google account data for targeted advertising.</p></section>
    <section><h2>Service providers and storage</h2><p>CareerDex uses Supabase for authentication and database hosting, and Vercel to host the website and provide web analytics. These providers process information as needed to operate their services for CareerDex. Information may be processed in countries where CareerDex or its service providers operate. CareerDex does not share Google user data with third parties except with service providers as necessary to provide the sign-in and hosting services, or when required by law.</p></section>
    <section><h2>Cookies and session data</h2><p>CareerDex uses browser storage and cookies needed to keep you signed in and protect your session. The site also uses Vercel Analytics to understand general website usage. Google sign-in may involve cookies or redirects managed by Google as part of authentication.</p></section>
    <section><h2>Retention, security, and your choices</h2><p>Your account and saved application information are kept while your account is active. To request access, correction, or deletion of your account information, use our <Link href="/contact">contact page</Link>. We use the access controls and security features provided by our hosting and authentication providers, but no online service can promise absolute security.</p></section>
    <section><h2>Children and policy updates</h2><p>CareerDex is intended for people managing their job search and is not designed for children under 13. We may update this policy as the service changes. The date above shows when it was last revised; material changes will be reflected on this page.</p></section>
    <section><h2>Contact</h2><p>Questions or privacy requests? Reach us through the <Link href="/contact">CareerDex contact page</Link>.</p></section>
  </LegalPage>;
}
