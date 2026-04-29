import { Suspense } from "react";
import WelcomeClient from "./WelcomeClient";

export const dynamic = "force-dynamic";

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <WelcomeClient />
    </Suspense>
  );
}
