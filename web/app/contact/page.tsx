import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Brian Barrett — hardware engineer in Shenzhen, open to full-time roles and projects. Reach out by email, WeChat, or the form.",
};

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow>Get in touch</Eyebrow>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Let&apos;s bring your product to life.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate">
              Whether you have a question, need a second opinion on a quote, or
              you&apos;re ready to take a prototype to production — send me a note
              and I&apos;ll get back to you within one business day.
            </p>

            <dl className="mt-10 space-y-6">
              <ContactItem label="Email">
                <a href={`mailto:${site.email}`} className="text-accent hover:underline">
                  {site.email}
                </a>
              </ContactItem>
              <ContactItem label="WeChat">
                {site.wechat}
              </ContactItem>
              <ContactItem label="Hours">{site.hours}</ContactItem>
            </dl>

            <p className="mt-10 max-w-sm text-sm text-slate">
              Prefer to talk directly? Reach out on WeChat or by email anytime —
              whatever&apos;s easiest for you.
            </p>
          </div>

          <ContactForm />
        </div>
      </Container>
    </section>
  );
}

function ContactItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-4">
      <dt className="w-20 shrink-0 font-mono text-xs uppercase tracking-widest text-slate">
        {label}
      </dt>
      <dd className="font-medium text-ink">{children}</dd>
    </div>
  );
}
