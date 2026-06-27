import { NextResponse, type NextRequest } from "next/server";

const subdomainRoutes: Record<string, string> = {
  store: "store",
  spa: "spa",
  bots: "whatsapp",
  pages: "landing-pages",
  docs: "documents",
};

export function middleware(req: NextRequest) {
  const host = req.headers.get("host")?.split(":")[0] || "";
  const first = host.split(".")[0];
  const demo = subdomainRoutes[first];

  if (!demo || req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/en") || pathname.startsWith("/ar")) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = `/en/demos/${demo}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
