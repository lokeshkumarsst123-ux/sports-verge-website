import { NextRequest, NextResponse } from "next/server";

const BACKEND_TARGET = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://13.204.234.133:3003/api/v1"
).replace(/\/+$/, "");

const BACKEND_ORIGIN = BACKEND_TARGET.replace(/\/api\/v1\/?$/, "");

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const targetUrl = `${BACKEND_ORIGIN}/uploads/${(path || []).join("/")}`;

  try {
    const res = await fetch(targetUrl, { cache: "no-store" });
    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/png";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
