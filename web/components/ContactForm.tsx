"use client";

import { useState } from "react";
import { ArrowIcon } from "./ui";
import { site } from "@/content/site";

type Status = "idle" | "sent";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  // Static site (no backend): compose an email from the fields and hand it to the
  // visitor's mail app. Email + WeChat are shown alongside as the direct channels.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("company_website")) return; // honeypot
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const subject = String(fd.get("subject") || "").trim() || `Enquiry from ${name || "the website"}`;
    const message = String(fd.get("message") || "").trim();
    const body = `${message}\n\n— ${name}${email ? ` · ${email}` : ""}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center shadow-card">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent/10 text-accent">
          <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m4 10.5 4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-semibold">Your email is ready</h3>
        <p className="mt-2 text-slate">
          Your mail app should have opened with your message — just hit send. If
          it didn&apos;t, email me directly at{" "}
          <a href={`mailto:${site.email}`} className="font-medium text-accent hover:underline">
            {site.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
      {/* Honeypot — hidden from humans, catches bots */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <div className="mt-5">
        <Field label="Subject" name="subject" />
      </div>
      <div className="mt-5">
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell me about your product, where it's at, and what you need help with."
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition placeholder:text-slate/60 focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-card transition hover:bg-accent-600 sm:w-auto"
      >
        Send message <ArrowIcon />
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition placeholder:text-slate/60 focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}
