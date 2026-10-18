import "./charts.css";
import { chartJsonLd, getChartMeta } from "@/lib/charts";
import { site } from "@/content/site";

const pages = [
  { slug: "metric-tap-drills", label: "Metric tap drills" },
  { slug: "inch-tap-drills", label: "Inch tap drills" },
  { slug: "decimal-equivalents", label: "Decimal equivalents" },
  { slug: "cheat-sheet", label: "Cheat sheet" },
];

export function ChartShell({
  slug,
  title,
  sub,
  children,
}: {
  slug: string;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  const url = `${site.url.replace(/^https?:\/\//, "")}/tools/charts/${slug}/`;
  const howTo = getChartMeta(slug)?.howTo;
  return (
    <div className="chart-page">
      {chartJsonLd(slug).map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
        />
      ))}
      <div className="chart-sheet">
        <div className="chart-head">
          <div>
            <div className="chart-eyebrow">Shop charts</div>
            <h1>{title}</h1>
            <div className="chart-sub">{sub}</div>
          </div>
          <div className="chart-mark">
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
              <rect x="1" y="1" width="24" height="24" fill="none" stroke="#14181a" strokeWidth="2" />
              <path d="M7 5v14h12" fill="none" stroke="#b4451f" strokeWidth="3" />
            </svg>
            Lavigne Labs
          </div>
        </div>
        <nav className="chart-nav no-print" aria-label="Shop charts">
          {pages.map((p) => (
            <a
              key={p.slug}
              href={`/tools/charts/${p.slug}/`}
              aria-current={p.slug === slug ? "page" : undefined}
            >
              {p.label}
            </a>
          ))}
        </nav>
        {children}
        {howTo && (
          <section className="chart-sec chart-howto" id="how-to-use">
            <h2>How to use</h2>
            <p className="chart-note">{howTo.name}:</p>
            <ol>
              {howTo.steps.map((s) => (
                <li key={s.name}>
                  <strong>{s.name}.</strong> {s.text}
                </li>
              ))}
            </ol>
          </section>
        )}
        <div className="chart-pdf no-print">
          <strong>Download PDF</strong>
          <a href={`/tools/charts/${slug}-a4.pdf`}>A4</a>
          <a href={`/tools/charts/${slug}-letter.pdf`}>US Letter</a>
          <span className="chart-note" style={{ margin: 0 }}>
            Print-ready for the shop wall.
          </span>
        </div>
        <div className="chart-foot">
          <span>{url}</span>
          <span>Lavigne Labs · verify against your own tooling before cutting</span>
        </div>
      </div>
    </div>
  );
}
