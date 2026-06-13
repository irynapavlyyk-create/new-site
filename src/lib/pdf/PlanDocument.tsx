import {
  Document,
  Page,
  View,
  Text,
  Svg,
  Path,
  Line,
  StyleSheet,
} from "@react-pdf/renderer";
import { t, pick } from "@/lib/translations";
import type { Lang, ProPlanV2, PhenotypeData, ProtocolStep, WeekProtocol, SupplementItem } from "@/types";

// On-brand palette — light/paper theme (NOT the dark dashboard).
const AMBER = "#F59E0B"; // exact brand amber
const ORANGE = "#FF6B35";
const INK = "#1A1A1A";
const MUTED = "#6B6B6B";
const PAPER = "#FFFFFF";
const CARD = "#FAF7F2"; // warm paper for chips
const HAIR = "#EFEAE2"; // hairline / grid
const NORMAL_LINE = "#C9C3B8"; // gray "normal" curve

// Shared baseline reference curve — mirrors NORMAL_CURVE in EnergyChart.tsx.
const NORMAL_CURVE = "M 0,150 Q 100,55 200,45 T 400,75 T 600,95 T 800,160";

const styles = StyleSheet.create({
  page: {
    backgroundColor: PAPER,
    color: INK,
    fontFamily: "Manrope",
    fontWeight: 400,
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontSize: 10,
    lineHeight: 1.5,
  },

  // Header
  header: { flexDirection: "row", alignItems: "center", marginBottom: 28 },
  brand: { fontSize: 18, fontWeight: 700, color: INK },
  accentBar: { width: 32, height: 4, borderRadius: 2, backgroundColor: AMBER, marginLeft: 10 },

  // Section
  section: { marginBottom: 22 },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: AMBER,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  // Phenotype identity
  labelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 },
  shortCode: { fontSize: 8, fontWeight: 700, color: MUTED, letterSpacing: 1 },
  // Explicit lineHeight + marginBottom give the name a deterministic box so the
  // underline (its own block below) can't overlap. No negative letterSpacing —
  // it triggers leading/trailing glyph clipping in @react-pdf.
  phenoName: { fontSize: 26, lineHeight: 1.15, fontWeight: 700, color: INK, marginBottom: 8 },
  underline: { width: 110, height: 3, borderRadius: 2, backgroundColor: ORANGE, marginBottom: 12 },
  subtitle: { fontSize: 11, color: MUTED, lineHeight: 1.5, marginBottom: 14 },

  statsRow: { flexDirection: "row", marginBottom: 14 },
  stat: { flex: 1, backgroundColor: CARD, borderRadius: 8, border: `1pt solid ${HAIR}`, paddingVertical: 8, paddingHorizontal: 10, marginRight: 8 },
  statLast: { marginRight: 0 },
  statLabel: { fontSize: 7.5, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 },
  statValue: { fontSize: 12, fontWeight: 700, color: INK },

  summary: { fontSize: 11, lineHeight: 1.6, color: INK },

  // Chart
  legendRow: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 6 },
  legendItem: { flexDirection: "row", alignItems: "center", marginLeft: 14 },
  legendDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  legendText: { fontSize: 8, color: MUTED },
  axisRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  axisLabel: { fontSize: 8, color: MUTED, fontFamily: "Manrope" },

  // Insights
  insightRow: { flexDirection: "row", marginBottom: 9 },
  insightBar: { width: 3, borderRadius: 2, backgroundColor: AMBER, marginRight: 9 },
  insightBody: { flex: 1 },
  insightLabel: { fontSize: 10.5, fontWeight: 700, color: INK, marginBottom: 1 },
  insightDesc: { fontSize: 9.5, color: MUTED, lineHeight: 1.45 },

  // Protocol steps
  stepRow: { flexDirection: "row", marginBottom: 8 },
  stepTime: { width: 46, fontSize: 10, fontWeight: 700, color: AMBER },
  stepBody: { flex: 1 },
  stepAction: { fontSize: 10.5, fontWeight: 700, color: INK, marginBottom: 1 },
  stepNote: { fontSize: 9.5, color: MUTED, lineHeight: 1.45 },

  // Weeks
  weekBlock: { borderLeft: `3pt solid ${AMBER}`, paddingLeft: 12, marginBottom: 16 },
  weekTitle: { fontSize: 12, fontWeight: 700, color: INK, marginBottom: 3 },
  weekFocus: { fontSize: 10, color: MUTED, lineHeight: 1.5, marginBottom: 8 },

  // Mini labeled lists (key actions / nutrition / stress)
  miniList: { marginBottom: 7 },
  miniLabel: { fontSize: 8, fontWeight: 700, color: AMBER, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 },
  // Drawn marker — not a "→" text glyph — so the bullet is font-independent.
  bulletRow: { flexDirection: "row", marginBottom: 2, alignItems: "flex-start" },
  bulletDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: AMBER, marginTop: 4.5, marginRight: 6 },
  bulletText: { flex: 1, fontSize: 9.5, color: INK, lineHeight: 1.45 },

  // Supplements
  suppItem: { marginBottom: 10, paddingBottom: 10, borderBottom: `1pt solid ${HAIR}` },
  suppName: { fontSize: 11, fontWeight: 700, color: INK, marginBottom: 2 },
  suppTiming: { fontSize: 9.5, fontWeight: 700, color: AMBER, marginBottom: 2 },
  suppNote: { fontSize: 9.5, color: MUTED, lineHeight: 1.45 },

  // Footer
  footer: { marginTop: 10 },
  footerLine: { height: 1, backgroundColor: HAIR, marginBottom: 10 },
  footerMeta: { fontSize: 8.5, fontWeight: 700, color: INK, marginBottom: 3 },
  footerDisc: { fontSize: 8, color: MUTED, lineHeight: 1.45 },
});

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      {/* minPresenceAhead keeps a section label from orphaning at a page bottom */}
      <View minPresenceAhead={70}>
        <Text style={styles.sectionLabel}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

function Stat({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={last ? [styles.stat, styles.statLast] : styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function MiniList({ label, items }: { label: string; items: string[] }) {
  return (
    <View style={styles.miniList}>
      <Text style={styles.miniLabel}>{label}</Text>
      {items.map((it, i) => (
        <View key={i} style={styles.bulletRow} wrap={false}>
          <View style={styles.bulletDot} />
          <Text style={styles.bulletText}>{it}</Text>
        </View>
      ))}
    </View>
  );
}

function StepRow({ step }: { step: ProtocolStep }) {
  return (
    <View style={styles.stepRow} wrap={false}>
      <Text style={styles.stepTime}>{step.time}</Text>
      <View style={styles.stepBody}>
        <Text style={styles.stepAction}>{step.action}</Text>
        {step.note ? <Text style={styles.stepNote}>{step.note}</Text> : null}
      </View>
    </View>
  );
}

function WeekBlock({ week, lang }: { week: WeekProtocol; lang: Lang }) {
  return (
    <View style={styles.weekBlock} wrap={false}>
      <Text style={styles.weekTitle}>
        {pick(t.dashboard.week, lang)} {week.number}: {week.title}
      </Text>
      {week.focus ? <Text style={styles.weekFocus}>{week.focus}</Text> : null}
      {week.keyActions?.length ? <MiniList label={pick(t.pdf.keyActions, lang)} items={week.keyActions} /> : null}
      {week.nutritionFocus?.length ? (
        <MiniList label={pick(t.dashboard.weekDetail.nutrition, lang)} items={week.nutritionFocus} />
      ) : null}
      {week.stressPractices?.length ? (
        <MiniList label={pick(t.dashboard.weekDetail.stress, lang)} items={week.stressPractices} />
      ) : null}
    </View>
  );
}

function SuppItem({ supp }: { supp: SupplementItem }) {
  return (
    <View style={styles.suppItem} wrap={false}>
      <Text style={styles.suppName}>
        {supp.name}  ·  {supp.dose}
      </Text>
      {supp.timing ? <Text style={styles.suppTiming}>{supp.timing}</Text> : null}
      {supp.note ? <Text style={styles.suppNote}>{supp.note}</Text> : null}
    </View>
  );
}

function EnergyChartPdf({ phenotype, lang }: { phenotype: PhenotypeData; lang: Lang }) {
  const areaPath = `${phenotype.energyCurve} L 800,220 L 0,220 Z`;
  const axis = pick(t.chart.axis, lang);
  return (
    <View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: AMBER }]} />
          <Text style={styles.legendText}>{pick(t.chart.you, lang)}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: NORMAL_LINE }]} />
          <Text style={styles.legendText}>{pick(t.chart.normal, lang)}</Text>
        </View>
      </View>

      <Svg viewBox="0 0 800 220" style={{ width: "100%", height: 150 }}>
        {/* grid */}
        <Line x1="0" y1="55" x2="800" y2="55" stroke={HAIR} strokeWidth={1} />
        <Line x1="0" y1="110" x2="800" y2="110" stroke={HAIR} strokeWidth={1} />
        <Line x1="0" y1="165" x2="800" y2="165" stroke={HAIR} strokeWidth={1} />
        {/* area under "you" */}
        <Path d={areaPath} fill={AMBER} fillOpacity={0.1} />
        {/* normal baseline — gray dashed */}
        <Path d={NORMAL_CURVE} fill="none" stroke={NORMAL_LINE} strokeWidth={1.5} strokeDasharray="4 5" />
        {/* you — amber solid */}
        <Path d={phenotype.energyCurve} fill="none" stroke={AMBER} strokeWidth={2.5} strokeLinecap="round" />
      </Svg>

      <View style={styles.axisRow}>
        {axis.map((a, i) => (
          <Text key={i} style={styles.axisLabel}>
            {a}
          </Text>
        ))}
      </View>
    </View>
  );
}

export function PlanDocument({
  plan,
  phenotype,
  lang,
  generatedAt,
}: {
  plan: ProPlanV2;
  phenotype: PhenotypeData;
  lang: Lang;
  generatedAt: string;
}) {
  return (
    <Document title="EnergyForge — Plan" author="EnergyForge">
      <Page size="A4" style={styles.page} wrap>
        {/* Header + phenotype identity — keep together */}
        <View wrap={false}>
          <View style={styles.header}>
            <Text style={styles.brand}>EnergyForge</Text>
            <View style={styles.accentBar} />
          </View>

          <View style={styles.labelRow}>
            <Text style={styles.sectionLabel}>{pick(t.pdf.phenotypeLabel, lang)}</Text>
            <Text style={styles.shortCode}>{phenotype.shortCode}</Text>
          </View>
          <Text style={styles.phenoName}>{pick(phenotype.name, lang)}</Text>
          <View style={styles.underline} />
          <Text style={styles.subtitle}>{pick(phenotype.subtitle, lang)}</Text>

          <View style={styles.statsRow}>
            <Stat label={pick(t.dashboard.heroStats.crashWindow, lang)} value={pick(phenotype.crashWindow, lang)} />
            <Stat label={pick(t.dashboard.heroStats.peakHours, lang)} value={pick(phenotype.peakHours, lang)} />
            <Stat label={pick(t.dashboard.heroStats.secondWind, lang)} value={pick(phenotype.secondWind, lang)} last />
          </View>

          <Text style={styles.summary}>{plan.summary}</Text>
        </View>

        {/* 24-hour pattern */}
        <View style={styles.section}>
          <View minPresenceAhead={70}>
            <Text style={styles.sectionLabel}>{pick(t.chart.title, lang)}</Text>
          </View>
          <EnergyChartPdf phenotype={phenotype} lang={lang} />
        </View>

        {/* Insights */}
        <Section label={pick(t.pdf.insights, lang)}>
          {phenotype.insights.map((ins, i) => (
            <View key={i} style={styles.insightRow} wrap={false}>
              <View style={styles.insightBar} />
              <View style={styles.insightBody}>
                <Text style={styles.insightLabel}>{pick(ins.label, lang)}</Text>
                <Text style={styles.insightDesc}>{pick(ins.description, lang)}</Text>
              </View>
            </View>
          ))}
        </Section>

        {/* Morning protocol */}
        <Section label={pick(t.dashboard.sections.morning, lang)}>
          {plan.morningProtocol.map((s, i) => (
            <StepRow key={i} step={s} />
          ))}
        </Section>

        {/* Sleep protocol */}
        <Section label={pick(t.dashboard.sections.sleep, lang)}>
          {plan.sleepProtocol.map((s, i) => (
            <StepRow key={i} step={s} />
          ))}
        </Section>

        {/* 30-day program */}
        <Section label={pick(t.dashboard.sections.plan, lang)}>
          {plan.weeks.map((w, i) => (
            <WeekBlock key={i} week={w} lang={lang} />
          ))}
        </Section>

        {/* Supplements */}
        <Section label={pick(t.dashboard.sections.supplements, lang)}>
          {plan.supplements.map((s, i) => (
            <SuppItem key={i} supp={s} />
          ))}
        </Section>

        {/* Footer */}
        <View style={styles.footer} wrap={false}>
          <View style={styles.footerLine} />
          <Text style={styles.footerMeta}>EnergyForge · energyforge.app · {generatedAt}</Text>
          <Text style={styles.footerDisc}>{pick(t.pdf.disclaimer, lang)}</Text>
        </View>
      </Page>
    </Document>
  );
}
