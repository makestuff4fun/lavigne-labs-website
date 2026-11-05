import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { InquiryForm } from "@/components/InquiryForm";
import { site, mailtoHref } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Lavigne Labs team, a Shenzhen hardware product-development team led by Brian Barrett. Reach out by email or WeChat.",
};

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Get in touch</Eyebrow>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Start a project.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate">
            Tell us what you&apos;re making, where it stands and when you need
            it. Taking a product from prototype to production is what we do
            best, and smaller jobs are welcome too: machined or printed parts,
            a quick prototype, or a second opinion on a quote. If we&apos;re not
            the right fit, we&apos;ll point you to someone who is.
          </p>

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-ink">What happens next</h2>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-slate">
              <li>Brian replies personally, within one business day.</li>
              <li>For a full product, a short call about your stage and your timeline.</li>
              <li>A clear plan: who builds what, what it costs and how long it takes.</li>
            </ol>
          </div>

          <InquiryForm />

          <dl className="mt-12 space-y-6">
            <ContactItem label="Email">
              <a href={mailtoHref} className="text-accent hover:underline">
                {site.email}
              </a>
            </ContactItem>
            <ContactItem label="WeChat">{site.wechat}</ContactItem>
            <ContactItem label="Location">{site.hours}</ContactItem>
          </dl>

          <p className="mt-10 max-w-sm text-sm text-slate">
            Prefer to talk directly? Reach out on WeChat or by email anytime.
          </p>
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
