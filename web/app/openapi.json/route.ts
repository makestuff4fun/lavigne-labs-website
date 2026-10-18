import { buildOpenApi } from "@/lib/openapi";

export const dynamic = "force-static"; // for `output: export`

export function GET() {
  return new Response(JSON.stringify(buildOpenApi(), null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
