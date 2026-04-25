import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import DashboardMockup from "@/components/preview/DashboardMockup";
import FloatingChip from "@/components/preview/FloatingChip";

export const metadata: Metadata = {
  title: "Preview B — Living Dashboard",
  robots: { index: false, follow: false },
};

export default function PreviewBPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeUp>
            <h1 className="h-display text-4xl sm:text-5xl text-center mb-3">
              <span className="gradient-text">This is what you get</span>
            </h1>
            <p className="text-muted text-center mb-12 max-w-xl mx-auto">
              A real plan, generated for you in 40 seconds.
            </p>
          </FadeUp>
          <div className="mockup-stage">
            <FloatingChip emoji="✨" text="AI-personalized" className="chip-tl" delay={0} />
            <FloatingChip emoji="⏱" text="30 days" className="chip-tr" delay={1} />
            <FloatingChip emoji="🧬" text="Science-backed" className="chip-bl" delay={2} />
            <FloatingChip emoji="🎯" text="Just for you" className="chip-br" delay={3} />
            <DashboardMockup />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
