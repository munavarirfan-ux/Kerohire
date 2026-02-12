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

type CompareRow = {
  name: string;
  roleFitScore: number;
  riskCount: number;
  confidence: number;
  topStrengths: string;
};

export function CompareSnapshotPDF({ rows }: { rows: CompareRow[] }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Candidate comparison</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cell}>Candidate</Text>
            <Text style={styles.cellRight}>Fit %</Text>
            <Text style={styles.cellRight}>Risks</Text>
            <Text style={styles.cellRight}>Confidence</Text>
            <Text style={{ flex: 2 }}>Top strengths</Text>
          </View>
          {rows.map((r, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.cell}>{r.name}</Text>
              <Text style={styles.cellRight}>{r.roleFitScore}%</Text>
              <Text style={styles.cellRight}>{r.riskCount}</Text>
              <Text style={styles.cellRight}>{r.confidence}%</Text>
              <Text style={{ flex: 2 }}>{r.topStrengths}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
