import type { Metadata } from "next";
import { t } from "@/lib/translations";
import { localizedPageMetadata } from "@/lib/seo";
import type { Lang } from "@/types";
import TermsContent from "./TermsContent";

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  return localizedPageMetadata({
    lang: params.lang,
    enPath: "/terms",
    title: t.meta.termsTitle,
    description: t.meta.termsDescription,
  });
}

export default function TermsPage() {
  return <TermsContent />;
}
