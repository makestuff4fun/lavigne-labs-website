import { site } from "@/content/site";
import { ALL_ENDPOINTS, API_BASE, type Endpoint } from "@/lib/api";

type Schema = Record<string, unknown>;

const str: Schema = { type: "string" };
const uri: Schema = { type: "string", format: "uri" };
const strs: Schema = { type: "array", items: str };
const ref = (name: string): Schema => ({ $ref: `#/components/schemas/${name}` });
const arr = (items: Schema): Schema => ({ type: "array", items });
const obj = (properties: Record<string, Schema>, required: string[] = Object.keys(properties)): Schema => ({
  type: "object",
  properties,
  required,
});
/** Every response body is the shared envelope plus the endpoint's own fields. */
const body = (properties: Record<string, Schema>, required?: string[]): Schema => ({
  allOf: [ref("Envelope"), obj(properties, required)],
});

const schemas: Record<string, Schema> = {
  Envelope: obj({
    version: { type: "string", const: "v1" },
    generated: { type: "string", format: "date-time", description: "Build time of this file." },
    site: { ...uri, description: "Site origin." },
  }),
  ArticleMeta: obj({
    slug: str,
    title: str,
    date: { type: "string", description: "Publication date, YYYY-MM-DD." },
    excerpt: str,
    tag: str,
    readingTime: { type: "integer", description: "Minutes." },
  }),
  ArticleLinks: obj({ url: uri, markdownUrl: uri, jsonUrl: uri }),
  ArticleListItem: { allOf: [ref("ArticleMeta"), ref("ArticleLinks")] },
  Service: obj({ id: str, title: str, summary: str, points: strs }),
  EngagementModel: obj({ name: str, tag: str, body: str }),
  ProcessStep: obj({ step: str, title: str, body: str }),
  Faq: obj({ q: str, a: str, featured: { type: "boolean" } }, ["q", "a"]),
  Project: obj(
    {
      slug: str,
      title: str,
      blurb: str,
      image: str,
      tags: strs,
      featured: { type: "boolean" },
      url: uri,
      imageUrl: uri,
      galleryUrls: { type: "array", items: uri },
    },
    ["slug", "title", "blurb", "image", "tags", "url", "imageUrl", "galleryUrls"],
  ),
  SearchRecord: {
    type: "object",
    properties: {
      id: { type: "string", description: "<type>:<key>, e.g. article:my-slug, faq:1." },
      type: { type: "string", enum: ["article", "faq", "service", "project", "page"] },
      title: str,
      url: uri,
      text: { type: "string", description: "Plain text." },
      slug: str,
      tag: str,
      excerpt: str,
      tags: strs,
    },
    required: ["id", "type", "title", "url", "text"],
  },
  Contact: obj({
    name: str,
    email: { type: "string", format: "email" },
    wechat: str,
    location: str,
    contactPage: uri,
  }),
  ToolListItem: obj({ id: str, title: str, kind: str, summary: str, jsonUrl: uri, pageUrl: str }),
  ToolInput: {
    type: "object",
    properties: {
      name: str,
      label: str,
      unit: str,
      type: { type: "string", enum: ["number", "enum", "boolean", "set"] },
      min: { type: "number" },
      max: { type: "number" },
      step: { type: "number" },
      options: arr(obj({ value: { type: ["string", "number"] }, label: str })),
      default: {},
      activeWhen: str,
      hint: str,
      notes: str,
    },
    required: ["name", "label", "unit", "type"],
  },
  ToolOutput: obj({ name: str, label: str, unit: str }),
  ToolExample: obj({
    inputs: { type: "object", additionalProperties: true },
    outputs: { type: "object", additionalProperties: true },
  }),
  ToolCalculator: {
    type: "object",
    properties: {
      id: str,
      title: str,
      kind: str,
      summary: str,
      url: str,
      inputs: arr(ref("ToolInput")),
      outputs: arr(ref("ToolOutput")),
      formula: str,
      assumptions: strs,
      examples: arr(ref("ToolExample")),
      data: {},
      notes: str,
    },
    required: ["id", "title", "kind", "summary", "inputs", "outputs", "formula", "examples"],
  },
  ToolSpec: {
    type: "object",
    description: "Calculators carry inputs/outputs/formula/examples; reference sheets carry data; the pcb page carries calculators.",
    properties: {
      id: str,
      title: str,
      kind: str,
      summary: str,
      url: str,
      jsonUrl: uri,
      inputs: arr(ref("ToolInput")),
      outputs: arr(ref("ToolOutput")),
      formula: str,
      assumptions: strs,
      examples: arr(ref("ToolExample")),
      data: {},
      calculators: arr(ref("ToolCalculator")),
      notes: str,
    },
    required: ["id", "title", "kind", "summary", "url", "jsonUrl"],
  },
  IndexEntry: obj({
    name: str,
    path: { type: "string", description: "Site-relative path." },
    url: uri,
    description: str,
    mediaType: str,
  }),
};

/** Response body schema per registry endpoint name. */
const responses: Record<string, Schema> = {
  index: body({ endpoints: arr(ref("IndexEntry")) }),
  articles: body({ articles: arr(ref("ArticleListItem")) }),
  services: body({
    services: arr(ref("Service")),
    engagement: obj({ intro: str, models: arr(ref("EngagementModel")) }),
    process: arr(ref("ProcessStep")),
  }),
  faq: body({ faqs: arr(ref("Faq")) }),
  portfolio: body({ projects: arr(ref("Project")) }),
  "search-index": body({ records: arr(ref("SearchRecord")) }),
  contact: body({ contact: ref("Contact") }),
  tools: body({ tools: arr(ref("ToolListItem")) }),
};

/** Parametrised endpoint families (registry entries with listed:false), keyed by directory. */
const families: Record<string, { param: string; summary: string; description: string; schema: Schema }> = {
  articles: {
    param: "slug",
    summary: "One article",
    description: "A single article: metadata, links, and the body as Markdown and rendered HTML.",
    schema: body(
      {
        ...(schemas.ArticleMeta.properties as Record<string, Schema>),
        ...(schemas.ArticleLinks.properties as Record<string, Schema>),
        markdown: str,
        html: str,
      },
    ),
  },
  tools: {
    param: "id",
    summary: "One tool spec",
    description: "Machine-readable spec for one calculator or reference sheet: inputs with units and ranges, outputs, formula, worked examples.",
    schema: { allOf: [ref("Envelope"), ref("ToolSpec")] },
  },
};

const ok = (schema: Schema) => ({
  "200": { description: "OK", content: { "application/json": { schema } } },
});

export function buildOpenApi() {
  const paths: Record<string, unknown> = {};
  const groups = new Map<string, Endpoint[]>();

  for (const e of ALL_ENDPOINTS) {
    const dir = e.path.includes("/") ? e.path.slice(0, e.path.indexOf("/")) : "";
    if (dir) {
      groups.set(dir, [...(groups.get(dir) ?? []), e]);
      continue;
    }
    paths[`${API_BASE}/${e.path}`] = {
      get: {
        operationId: `get_${e.name.replace(/\W+/g, "_")}`,
        summary: e.name === "index" ? "API index" : `${e.name[0].toUpperCase()}${e.name.slice(1)}`,
        description: e.description,
        responses: ok(responses[e.name] ?? ref("Envelope")),
      },
    };
  }

  for (const [dir, endpoints] of groups) {
    const fam = families[dir] ?? { param: "id", summary: dir, description: `Entries under ${dir}/.`, schema: ref("Envelope") };
    const values = endpoints.map((e) => e.path.slice(dir.length + 1).replace(/\.json$/, ""));
    paths[`${API_BASE}/${dir}/{${fam.param}}.json`] = {
      get: {
        operationId: `get_${dir}_by_${fam.param}`,
        summary: fam.summary,
        description: fam.description,
        parameters: [
          {
            name: fam.param,
            in: "path",
            required: true,
            description: `One of the ${values.length} published values.`,
            schema: { type: "string", enum: values },
            example: values[0],
          },
        ],
        responses: ok(fam.schema),
      },
    };
  }

  return {
    openapi: "3.1.0",
    info: {
      title: `${site.name} public JSON API`,
      version: "v1",
      description: `Read-only static JSON describing ${site.name}: articles, services, FAQ, portfolio, contact details, calculator specs and a search index. Start at ${API_BASE}/index.json. Every response is wrapped in a shared envelope (version, generated, site).`,
      contact: { name: site.founder, email: site.email },
    },
    servers: [{ url: site.url }],
    paths,
    components: { schemas },
  };
}
