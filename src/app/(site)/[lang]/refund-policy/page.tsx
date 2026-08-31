import type { Metadata } from "next";
import { t } from "@/lib/translations";
import { localizedPageMetadata } from "@/lib/seo";
import type { Lang } from "@/types";
import RefundPolicyContent from "./RefundPolicyContent";

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  return localizedPageMetadata({
    lang: params.lang,
    enPath: "/refund-policy",
    title: t.meta.refundTitle,
    description: t.meta.refundDescription,
  });
}

export default function RefundPolicyPage() {
  return <RefundPolicyContent />;
}
