import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
  h1: { fontSize: 18, marginBottom: 8 },
  h2: { fontSize: 14, marginTop: 12, marginBottom: 4 },
  body: { marginBottom: 4, color: "#475569" },
  table: { marginTop: 8 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingVertical: 4 },
  cell: { flex: 1 },
  cellRight: { flex: 1, textAlign: "right" },
});

type ConfigRow = {
  traitName: string;
  weight: number;
  targetMin: number;
  targetMax: number;
  riskBelow: number | null;
  riskAbove: number | null;
};

export function RoleConfigSummaryPDF({
  roleName,
  configs,
}: {
  roleName: string;
  configs: ConfigRow[];
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Role config — {roleName}</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cell}>Trait</Text>
            <Text style={styles.cellRight}>Weight</Text>
            <Text style={styles.cellRight}>Target min</Text>
            <Text style={styles.cellRight}>Target max</Text>
            <Text style={styles.cellRight}>Risk below</Text>
            <Text style={styles.cellRight}>Risk above</Text>
          </View>
          {configs.map((c, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.cell}>{c.traitName}</Text>
              <Text style={styles.cellRight}>{c.weight}</Text>
              <Text style={styles.cellRight}>{c.targetMin}</Text>
              <Text style={styles.cellRight}>{c.targetMax}</Text>
              <Text style={styles.cellRight}>{c.riskBelow ?? "—"}</Text>
              <Text style={styles.cellRight}>{c.riskAbove ?? "—"}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
