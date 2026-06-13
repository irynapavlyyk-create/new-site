import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Lang } from "@/types";

// On-brand palette — light/paper theme (NOT the dark dashboard).
const AMBER = "#F5A623";
const ORANGE = "#FF6B35";
const INK = "#1A1A1A";
const MUTED = "#6B6B6B";
const PAPER = "#FFFFFF";

const LABELS = {
  phenotype: { en: "Your phenotype", ru: "Твой фенотип" },
} as const;

const styles = StyleSheet.create({
  page: {
    backgroundColor: PAPER,
    color: INK,
    fontFamily: "Manrope",
    fontWeight: 400,
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 56,
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  brand: {
    fontSize: 20,
    fontWeight: 700,
    color: INK,
    letterSpacing: -0.3,
  },
  accent: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: AMBER,
    marginLeft: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: 700,
    color: AMBER,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  phenotype: {
    fontSize: 30,
    fontWeight: 700,
    color: INK,
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  rule: {
    height: 2,
    width: 60,
    backgroundColor: ORANGE,
    marginBottom: 20,
  },
  summary: {
    fontSize: 12,
    lineHeight: 1.6,
    color: MUTED,
  },
});

export function PlanDocument({
  phenotypeName,
  summary,
  lang,
}: {
  phenotypeName: string;
  summary: string;
  lang: Lang;
}) {
  return (
    <Document title="EnergyForge — Plan" author="EnergyForge">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>EnergyForge</Text>
          <View style={styles.accent} />
        </View>

        <Text style={styles.label}>{LABELS.phenotype[lang]}</Text>
        <Text style={styles.phenotype}>{phenotypeName}</Text>
        <View style={styles.rule} />
        <Text style={styles.summary}>{summary}</Text>
      </Page>
    </Document>
  );
}
