import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { LOCALIZED_EN_PATHS } from "@/lib/locale-paths";

// The four localized pages live under src/app/(site)/[lang]/… — bare English
// URLs are REWRITTEN (never redirected: they are indexed and must keep
// answering 200) to the /en variant, /cs/* matches the [lang] segment as-is.
const EN_PATHS = new Set<string>(LOCALIZED_EN_PATHS);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /en/* is an internal implementation detail, not a public address — anyone
  // landing there (typed by hand, leaked link) is bounced to the canonical
  // bare URL so no duplicate of the indexed EN pages can exist. The bare EN
  // paths themselves are never redirected.
  if (pathname === "/en" || (pathname.startsWith("/en/") && EN_PATHS.has(pathname.slice(3)))) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const sessionResponse = await updateSession(request);
  // updateSession may redirect (unauthenticated visitor on a protected page).
  // That never overlaps the four public localized paths, but stay general:
  // a redirect always wins over our rewrite.
  if (sessionResponse.headers.has("location")) {
    return sessionResponse;
  }

  // /cs/* matches the [lang] segment directly — no rewrite needed. <html lang>
  // comes from the segment itself ((site)/[lang] is its own root layout).
  if (!EN_PATHS.has(pathname)) {
    return sessionResponse;
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  const response = NextResponse.rewrite(url, {
    request: { headers: new Headers(request.headers) },
  });

  // Re-attach any cookies updateSession set (refreshed Supabase session) —
  // our response replaces the one it built, but must not lose them.
  for (const cookie of sessionResponse.cookies.getAll()) {
    response.cookies.set(cookie);
  }
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/* (API routes manage their own auth; Stripe webhook must not be redirected)
     * - _next/static, _next/image
     * - favicon.ico, robots.txt, sitemap.xml, monitoring (Sentry tunnel)
     * - image and font extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|monitoring|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)",
  ],
};
