import { marked } from "marked";

const words = (s: string) => s.toLowerCase().match(/[a-z0-9]+/g) ?? [];

/**
 * Render a project description to HTML. Presentation-only transform of the
 * source markdown (prose is untouched):
 *  - a leading heading that merely restates the page title is dropped (any
 *    subtitle after the colon stays as an intro lead); otherwise it becomes
 *    a lead paragraph instead of a second title,
 *  - bold-only "Label:" paragraphs become H3 headings.
 */
export function renderProjectBody(source: string, title: string): string {
  let md = source.trim();

  const first = md.match(/^(?:#{1,6}\s+(.+)|\*\*([^*\n]+)\*\*)[ \t]*(?:\n|$)/);
  if (first) {
    const text = (first[1] ?? first[2]).replace(/\*\*/g, "").trim();
    const [head, ...rest] = text.split(/:\s+/);
    const sub = rest.join(": ").trim();
    const t = new Set(words(title));
    const h = words(head);
    const shared = h.filter((w) => t.has(w)).length;
    const restates = t.size > 0 && shared / t.size >= 0.5;
    const lead = restates ? sub : text;
    md = (lead ? `<p class="lead">${marked.parseInline(lead)}</p>\n\n` : "") + md.slice(first[0].length).trimStart();
  }

  md = md.replace(/^\*\*([^*\n]{3,80}?):?\*\*[ \t]*$/gm, (_, label: string) => `### ${label.trim()}`);
  return marked.parse(md) as string;
}
