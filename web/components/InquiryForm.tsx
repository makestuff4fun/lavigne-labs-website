"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formsEndpoint, mailtoHref, site } from "@/content/site";

const TOKEN_URL = `${formsEndpoint}/v1/token`;
const INQUIRY_URL = `${formsEndpoint}/v1/inquiry`;

const STAGES = [
  ["idea", "Just an idea"],
  ["prototype", "Prototype built"],
  ["funded", "Funded"],
  ["kickstarter_completed", "Kickstarter completed"],
  ["in_production", "In production"],
] as const;

const FUNDING = [
  ["yc_or_accelerator", "YC or another accelerator"],
  ["seed_or_series_a", "Seed or Series A"],
  ["crowdfunded", "Crowdfunded"],
  ["self_funded", "Self-funded"],
  ["other", "Something else"],
] as const;

const PRIORITIES = [
  ["speed", "Getting there quickly"],
  ["lowest_dev_cost", "Lowest development cost"],
  ["polish", "Polish and finish"],
] as const;

type Token = { ts: number; sig: string };
type Status = "idle" | "sending" | "done" | "error";

const field =
  "mt-1 block w-full rounded-lg border border-line bg-white px-3 py-2 text-base text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";
const labelCls = "block text-sm font-medium text-ink";

export function InquiryForm() {
  const [token, setToken] = useState<Token | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);

  const loadToken = useCallback(async () => {
    try {
      const res = await fetch(TOKEN_URL);
      if (!res.ok) throw new Error("token");
      const t = (await res.json()) as Token;
      setToken(typeof t.ts === "number" && t.sig ? t : null);
    } catch {
      setToken(null);
    }
  }, []);

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  useEffect(() => {
    if (status === "done" || status === "error") msgRef.current?.focus();
  }, [status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const body: Record<string, string | number> = {};
    fd.forEach((v, k) => {
      if (typeof v === "string") body[k] = v.trim();
    });
    body.contact_time = "";
    try {
      let t = token;
      if (!t) {
        const r = await fetch(TOKEN_URL);
        if (!r.ok) throw new Error("token");
        t = (await r.json()) as Token;
      }
      body.ts = t.ts;
      body.sig = t.sig;
      const res = await fetch(INQUIRY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("http");
      const data = (await res.json()) as { ok?: boolean };
      if (!data.ok) throw new Error("rejected");
      formRef.current?.reset();
      setStatus("done");
    } catch {
      setStatus("error");
    } finally {
      setToken(null);
      loadToken();
    }
  }

  return (
    <div className="mt-12 rounded-2xl border border-line bg-mist p-6">
      <h2 className="text-xl font-semibold text-ink">Tell us about your project</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate">
        Only name, email and message are required. The rest helps us see your
        stage, funding and timeline. Please keep to a link or two, as we may
        not see messages with many links.
      </p>

      <div ref={msgRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        {status === "done" && (
          <p className="mt-4 rounded-lg bg-white p-4 font-medium text-ink">
            Thanks, we review every inquiry and reply to the ones we can help with.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="mt-4 rounded-lg bg-white p-4 text-ink">
            Sorry, that didn&apos;t go through. What you typed is still here;
            please try again, or email us at{" "}
            <a href={mailtoHref} className="text-accent underline">
              {site.email}
            </a>
            .
          </p>
        )}
      </div>

      <form ref={formRef} onSubmit={onSubmit} className="mt-5 space-y-4">
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: -9999, top: "auto", width: 1, height: 1, overflow: "hidden" }}
        >
          <label htmlFor="contact_time">Leave this empty</label>
          <input id="contact_time" type="text" name="contact_time" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <div>
          <label htmlFor="f-name" className={labelCls}>Your name</label>
          <input id="f-name" name="name" required maxLength={100} autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="f-email" className={labelCls}>Email</label>
          <input id="f-email" name="email" type="email" required maxLength={254} autoComplete="email" className={field} />
        </div>
        <div>
          <label htmlFor="f-company" className={labelCls}>Company (optional)</label>
          <input id="f-company" name="company" maxLength={150} autoComplete="organization" className={field} />
        </div>
        <div>
          <label htmlFor="f-website" className={labelCls}>Website (optional)</label>
          <input id="f-website" name="website" type="url" maxLength={300} placeholder="https://" autoComplete="url" className={field} />
        </div>
        <div>
          <label htmlFor="f-product" className={labelCls}>What are you building? (optional)</label>
          <input id="f-product" name="product_type" maxLength={200} className={field} />
        </div>
        <div>
          <label htmlFor="f-stage" className={labelCls}>Where are you now? (optional)</label>
          <select id="f-stage" name="stage" defaultValue="" className={field}>
            <option value="">Choose one</option>
            {STAGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="f-funding" className={labelCls}>How is it funded? (optional)</label>
          <select id="f-funding" name="funding" defaultValue="" className={field}>
            <option value="">Choose one</option>
            {FUNDING.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="f-fd" className={labelCls}>Anything to add on funding? (optional)</label>
          <input id="f-fd" name="funding_detail" maxLength={500} className={field} />
        </div>
        <div>
          <label htmlFor="f-needed" className={labelCls}>When do you need prototypes? (optional)</label>
          <input id="f-needed" name="prototypes_needed_by" maxLength={100} placeholder="A date or a rough timeframe" className={field} />
        </div>
        <div>
          <label htmlFor="f-prio" className={labelCls}>What matters most right now? (optional)</label>
          <select id="f-prio" name="dev_priority" defaultValue="" className={field}>
            <option value="">Choose one</option>
            {PRIORITIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="f-goal" className={labelCls}>Production goal (optional)</label>
          <textarea id="f-goal" name="production_goal" rows={2} maxLength={1000} placeholder="e.g. lowest unit cost at volume" className={field} />
        </div>
        <div>
          <label htmlFor="f-message" className={labelCls}>Message</label>
          <textarea id="f-message" name="message" required rows={6} maxLength={5000} className={field} />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-accent px-6 py-3 font-semibold text-white disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send inquiry"}
        </button>
        <p className="text-sm text-slate">
          Prefer email?{" "}
          <a href={mailtoHref} className="text-accent underline">{site.email}</a>
        </p>
      </form>
    </div>
  );
}
