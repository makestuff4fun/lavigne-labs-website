import { ALL_ENDPOINTS, findEndpoint, respond } from "@/lib/api";

export const dynamic = "force-static"; // for `output: export`
export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_ENDPOINTS.map((e) => ({ endpoint: e.path.split("/") }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ endpoint: string[] }> }) {
  const { endpoint } = await ctx.params;
  const e = findEndpoint(endpoint);
  return e ? respond(e) : new Response("Not found", { status: 404 });
}
