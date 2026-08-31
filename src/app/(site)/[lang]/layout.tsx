import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppShell from "@/app/AppShell";
import { RouteLangProvider } from "@/lib/i18n-context";
import { baseMetadata } from "@/lib/seo";
import type { Lang } from "@/types";

export const metadata: Metadata = baseMetadata;

// Root layout of the (site) group — <html lang> comes straight from the URL
// segment, so /, /terms… prerender as English and /cs/* as Czech statically,
// with no headers() call forcing dynamic rendering.
//
// Only "en" (reached via middleware rewrite from the bare URLs) and "cs"
// (public /cs/* addresses) exist. Any other single-segment path that falls
// through to [lang] must 404, not render an English page under a junk URL.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "cs" }];
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (params.lang !== "en" && params.lang !== "cs") notFound();
  const lang = params.lang as Lang;
  return (
    <AppShell lang={lang}>
      <RouteLangProvider lang={lang}>{children}</RouteLangProvider>
    </AppShell>
  );
}
