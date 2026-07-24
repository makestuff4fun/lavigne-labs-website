import { NextResponse } from "next/server";
import { site } from "@/content/site";

type Payload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  company_website?: string; // honeypot
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let data: Payload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: if filled, silently accept (pretend success, drop it).
  if (data.company_website) {
    return NextResponse.json({ ok: true });
  }

  const name = data.name?.trim();
  const email = data.email?.trim();
  const message = data.message?.trim();
  const subject = data.subject?.trim() || "New project inquiry";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in your name, email, and message." },
      { status: 400 },
    );
  }
  if (!emailRe.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;

  // Local/dev fallback: no email provider configured yet — log and succeed
  // so the form is fully testable before email is wired up.
  if (!apiKey) {
    console.log("\n📨  New contact submission (no RESEND_API_KEY set — logged only):");
    console.log({ name, email, subject, message });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${site.name} <noreply@lavignelabs.com>`,
        to: [site.email],
        reply_to: email,
        subject: `[${site.name}] ${subject}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Resend error:", res.status, detail);
      return NextResponse.json(
        { error: "Could not send right now. Please email me directly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Could not send right now. Please email me directly." },
      { status: 502 },
    );
  }
}
