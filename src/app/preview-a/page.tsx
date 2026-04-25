import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import Constellation from "@/components/preview/Constellation";

export const metadata: Metadata = {
  title: "Preview A — The Plan Constellation",
  robots: { index: false, follow: false },
};

export default function PreviewAPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeUp>
            <h1 className="h-display text-4xl sm:text-5xl text-center mb-3">
              <span className="gradient-text">Your plan, mapped</span>
            </h1>
            <p className="text-muted text-center mb-12 max-w-xl mx-auto">
              Every part connects. Nothing is generic.
            </p>
          </FadeUp>
          <Constellation />
        </div>
      </main>
      <Footer />
    </>
  );
}
