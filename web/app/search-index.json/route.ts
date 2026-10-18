import { ALL_ENDPOINTS, respond } from "@/lib/api";

export const dynamic = "force-static"; // for `output: export`

/** Same index as /api/v1/search-index.json, at a root path crawlers and tools look for. */
export function GET() {
  return respond(ALL_ENDPOINTS.find((e) => e.name === "search-index")!);
}
