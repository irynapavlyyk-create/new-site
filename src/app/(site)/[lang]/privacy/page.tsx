import type { Metadata } from "next";
import { t } from "@/lib/translations";
import { localizedPageMetadata } from "@/lib/seo";
import type { Lang } from "@/types";
import PrivacyContent from "./PrivacyContent";

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  return localizedPageMetadata({
    lang: params.lang,
    enPath: "/privacy",
    title: t.meta.privacyTitle,
    description: t.meta.privacyDescription,
  });
}

export default function PrivacyPage() {
  return <PrivacyContent />;
}
