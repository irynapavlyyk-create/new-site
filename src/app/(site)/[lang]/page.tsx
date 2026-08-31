import type { Metadata } from "next";
import { t } from "@/lib/translations";
import { localizedPageMetadata } from "@/lib/seo";
import type { Lang } from "@/types";
import HomeContent from "./HomeContent";

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  return localizedPageMetadata({
    lang: params.lang,
    enPath: "/",
    title: t.meta.homeTitle,
    description: t.meta.homeDescription,
  });
}

export default function Home() {
  return <HomeContent />;
}
