import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service · CareerDex",
  description: "Terms for using the CareerDex job application tracking service.",
};

export default function TermsPage() {
  return <LegalPage eyebrow="CareerDex / Terms" title="Terms of Service" intro="These terms cover your use of CareerDex. By creating an account or using the service, you agree to follow them.">
    <section><h2>Using CareerDex</h2><p>CareerDex provides tools to organize job applications, notes, contacts, and reminders. You must provide accurate account information, keep your sign-in credentials secure, and use the service only in ways allowed by applicable law. You are responsible for activity under your account.</p></section>
    <section><h2>Your content</h2><p>You retain your rights to the information you enter. You give CareerDex permission to store and process that information only as needed to operate, secure, and improve the service, as described in our <Link href="/privacy">Privacy Policy</Link>. Do not upload content you do not have the right to use.</p></section>
    <section><h2>Acceptable use</h2><p>You may not misuse the service, interfere with its operation or security, attempt to access another person’s account or data, or use CareerDex for unlawful or harmful activity. We may restrict access when reasonably needed to protect users or the service.</p></section>
    <section><h2>Third-party services and availability</h2><p>CareerDex may rely on third-party services, including Google sign-in and infrastructure providers. Their services are subject to their own terms and availability. We work to keep CareerDex available, but features may change or be temporarily unavailable for maintenance or reasons outside our control.</p></section>
    <section><h2>No employment advice</h2><p>CareerDex is an organizational tool. It does not provide job placement, recruiting, legal, financial, or career advice, and it does not guarantee an interview, offer, or employment outcome. You are responsible for verifying job information and deciding how to use it.</p></section>
    <section><h2>Closing or suspending an account</h2><p>You may stop using CareerDex at any time. To request account closure and deletion of associated information, contact us through the <Link href="/contact">contact page</Link>. We may suspend or end access if these terms are violated or if continued access creates a security or legal risk.</p></section>
    <section><h2>Disclaimers and changes</h2><p>To the extent permitted by law, CareerDex is provided as available without warranties that it will be uninterrupted, error-free, or suitable for every purpose. These terms may be updated as the service evolves. The date above shows the latest revision; continued use after an update means you accept the revised terms.</p></section>
    <section><h2>Contact</h2><p>Questions about these terms? Reach us through the <Link href="/contact">CareerDex contact page</Link>.</p></section>
  </LegalPage>;
}
