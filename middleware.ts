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
  const { pathname } = req.nextUrl;

  // Platform front door: tawasul.idealailabs.com → the /tawasul intro landing.
  // /onboard, /privacy, /api and assets pass through unchanged so the Connect
  // flow works on the same subdomain.
  if (first === "tawasul") {
    if (pathname === "/") {
      const url = req.nextUrl.clone();
      url.pathname = "/tawasul";
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // Demo subdomains (store./spa./bots./pages./docs.) → /en/demos/<demo>.
  const demo = subdomainRoutes[first];

  if (!demo || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

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
