import path from "path";
import { Font } from "@react-pdf/renderer";

// Bundled Manrope (Latin + Cyrillic subset) so RU plans render real glyphs,
// not tofu. The .ttf files are force-included in the serverless bundle via
// `outputFileTracingIncludes` in next.config.mjs — keep that path in sync.
const FONT_DIR = path.join(process.cwd(), "src", "lib", "pdf", "fonts");

let registered = false;

/** Idempotent — safe to call on every request; Font.register runs once. */
export function registerFonts(): void {
  if (registered) return;

  Font.register({
    family: "Manrope",
    fonts: [
      { src: path.join(FONT_DIR, "Manrope-Regular.ttf"), fontWeight: 400 },
      { src: path.join(FONT_DIR, "Manrope-Bold.ttf"), fontWeight: 700 },
    ],
  });

  // Disable @react-pdf's default hyphenation (it would split words mid-glyph).
  Font.registerHyphenationCallback((word) => [word]);

  registered = true;
}
