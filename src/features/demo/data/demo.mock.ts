/** Legacy demo pages (Emma Schneider, senior product designer job). */
export const demoMock = {
  org: {
    name: "NovaTech Solutions",
  },
  dashboard: {
    activeJobs: 12,
    candidates: 482,
    avgEvidenceCoveragePct: 74,
    evidenceSignalDistribution: {
      work: 85,
      communication: 62,
      reliability: 48,
    },
    aiHub: {
      interviewsTranscribedThisMonth: 1204,
      flags: {
        highRisk: 4,
        medium: 12,
      },
    },
  },
  jobSeniorProductDesigner: {
    breadcrumb: ["Jobs", "Senior Product Designer"],
    title: "Senior Product Designer",
    status: "LIVE" as const,
    stats: {
      totalApplicants: 48,
      inWorkSignals: 12,
      avgEvidenceCoveragePct: 82,
      hiringConfidence: "Strong" as const,
    },
    candidates: [
      {
        name: "Sarah Jenkins",
        location: "London, UK",
        stage: "Work Signals",
        evidenceScorePct: 94,
        aiSignal: "High Signal",
        lastActivity: "2h ago",
      },
      {
        name: "Marcus Thorne",
        location: "Berlin, DE",
        stage: "Interviews",
        evidenceScorePct: 88,
        aiSignal: "High Signal",
        lastActivity: "4h ago",
      },
      {
        name: "Elena Rodriguez",
        location: "New York, US",
        stage: "New Applicant",
        evidenceScorePct: 72,
        aiSignal: "Medium Risk",
        lastActivity: "1d ago",
      },
    ],
  },
  emma: {
    id: "emma-schneider",
    name: "Emma Schneider",
    titleLine: "Senior Product Designer · Berlin",
    metrics: {
      evidenceCoveragePct: 92,
      hiringConfidencePct: 88,
      atsScorePct: 94,
    },
    intelligenceOverview: {
      heading: "Evidence Intelligence Overview",
      paragraphs: [
        "Emma demonstrates exceptional structured reasoning and cross-functional collaboration skills, particularly in high-growth environments.",
        "Detailed analysis reveals a strong alignment with the leadership principles of transparency and data-driven iteration. Her design systems approach is highly systematic.",
      ],
      strongEvidenceAreas: ["Structured Reasoning", "Collaboration", "User Empathy"],
      missingEvidence: ["Work Simulation", "SQL Knowledge"],
    },
    workSignals: [
      {
        title: "Decision Making",
        description: "Ability to evaluate trade-offs and arrive at high-confidence design choices.",
        status: "Strong" as const,
      },
      {
        title: "Ownership",
        description: "Taking end-to-end responsibility for project outcomes and team success.",
        status: "Strong" as const,
      },
      {
        title: "Collaboration",
        description: "Effectiveness in working across product, engineering, and data teams.",
        status: "Moderate" as const,
      },
      {
        title: "Execution Under Ambiguity",
        description: "Maintaining velocity when requirements or constraints are unclear.",
        status: "Strong" as const,
      },
    ],
    interviewIntelligence: {
      quoteOverlay: "...and that's why I chose a NoSQL database for the logging microservice specifically.",
      transcript: [
        {
          speaker: "Marcus Chen",
          time: "00:00",
          text:
            "Hi Emma, thanks for joining us today for the final technical round. I'd like to dive straight into your experience with distributed systems. Can you walk me through a complex architectural decision you made recently?",
        },
        {
          speaker: "Emma Schneider",
          time: "00:42",
          text:
            "Certainly. At my last role, we were moving from a monolithic structure to microservices. The biggest challenge was data consistency.",
        },
        {
          speaker: "Emma Schneider",
          time: "01:18",
          text:
            "I advocated for an eventual consistency model using an event-driven bus because our primary concern was high availability over strict ACID properties in the logging layer.",
          highlight: true,
        },
      ],
      evidenceSummary: [
        "Strong technical trade-off articulation: Demonstrated deep understanding of CAP theorem in real-world application.",
        "Experience with scale: Clearly described managing log pipelines at 10k events/sec.",
        "Proactive communication: Explained technical concepts clearly without using unnecessary jargon.",
      ],
      competencyScorecard: {
        problemSolving: 4.8,
        outOf: 5.0,
      },
    },
    decisionSummary: {
      tabs: [
        "CV Snapshot",
        "ATS Screening",
        "Work Signals",
        "Interviews",
        "Written Responses",
        "Reliability Signals",
        "Decision Summary",
      ],
      recommendedAction: "Proceed",
      confidencePct: 72,
      evidenceBackedJustification: [
        "Strong communication evidence across 3 interview stages.",
        "Demonstrated ownership in portfolio case study.",
        "Missing live task assessment — recommend completion before offer.",
        "No contradictions detected in evidence cross-referencing.",
      ],
      editableReasoning:
        "Emma shows strong evidence in communication and structured thinking. Recommend proceeding to final round after completing the live task assessment to close the evidence gap in execution under ambiguity.",
    },
  },
};

