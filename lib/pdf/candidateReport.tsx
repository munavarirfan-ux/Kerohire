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

type CandidateReportData = {
  name: string;
  roleName: string;
  roleFitScore: number;
  strengths: string[];
  risks: string[];
  traitRows: { trait: string; percentile: number }[];
  confidence: number;
  interviewSummary?: string;
  scorecardRecommendation?: string;
};

export function CandidateReportPDF({ data }: { data: CandidateReportData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Candidate report — {data.name}</Text>
        <Text style={styles.body}>Role: {data.roleName}</Text>

        <Text style={styles.h2}>Role fit score</Text>
        <Text style={styles.body}>{data.roleFitScore}%</Text>

        <Text style={styles.h2}>Strengths</Text>
        {data.strengths.length === 0 ? (
          <Text style={styles.body}>None</Text>
        ) : (
          data.strengths.map((s, i) => (
            <Text key={i} style={styles.body}>• {s}</Text>
          ))
        )}

        <Text style={styles.h2}>Risks</Text>
        {data.risks.length === 0 ? (
          <Text style={styles.body}>None</Text>
        ) : (
          data.risks.map((r, i) => (
            <Text key={i} style={styles.body}>• {r}</Text>
          ))
        )}

        <Text style={styles.h2}>Trait breakdown</Text>
        <View style={styles.table}>
          {data.traitRows.map((row, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.cell}>{row.trait}</Text>
              <Text style={styles.cellRight}>{row.percentile}%</Text>
            </View>
          ))}
        </View>

        <Text style={styles.h2}>Confidence</Text>
        <Text style={styles.body}>{data.confidence}%</Text>

        {data.interviewSummary && (
          <>
            <Text style={styles.h2}>Interview summary</Text>
            <Text style={styles.body}>{data.interviewSummary}</Text>
          </>
        )}
        {data.scorecardRecommendation && (
          <>
            <Text style={styles.h2}>Recommendation</Text>
            <Text style={styles.body}>{data.scorecardRecommendation}</Text>
          </>
        )}
      </Page>
    </Document>
  );
}
