import Link from "next/link";
import { footerLinks, site } from "@/content/site";
import { Container } from "./ui";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5 font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-ink font-mono text-sm">
                L
              </span>
              {site.name}
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              Helping North American hardware teams manufacture in China —
              vetted factories, real quality control, on the ground.
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, items]) => (
            <div key={heading}>
              <h3 className="font-mono text-xs uppercase tracking-widest text-white/50">
                {heading}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-white/75 transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-white/50">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li>
                <a href={`mailto:${site.email}`} className="transition hover:text-white">
                  {site.email}
                </a>
              </li>
              <li>WeChat: {site.wechat}</li>
              <li>{site.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/45">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
