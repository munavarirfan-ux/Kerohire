import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "demo123";

async function main() {
  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const org = await prisma.organization.upsert({
    where: { id: "seed-org-1" },
    create: {
      id: "seed-org-1",
      name: "NovaTech Solutions",
    },
    update: { name: "NovaTech Solutions" },
  });

  await prisma.user.upsert({
    where: { email: "admin@kerohire.io" },
    create: {
      email: "admin@kerohire.io",
      passwordHash: hash,
      name: "Admin",
      role: "ADMIN",
      organizationId: org.id,
    },
    update: {},
  });
  await prisma.user.upsert({
    where: { email: "hr@kerohire.io" },
    create: {
      email: "hr@kerohire.io",
      passwordHash: hash,
      name: "HR User",
      role: "HR",
      organizationId: org.id,
    },
    update: {},
  });
  await prisma.user.upsert({
    where: { email: "manager@kerohire.io" },
    create: {
      email: "manager@kerohire.io",
      passwordHash: hash,
      name: "Hiring Manager",
      role: "HIRING_MANAGER",
      organizationId: org.id,
    },
    update: {},
  });

  const traitNames = [
    "Leadership Drive",
    "Strategic Thinking",
    "Collaboration",
    "Emotional Stability",
    "Adaptability",
    "Accountability",
    "Communication",
    "Resilience",
    "Risk Tolerance",
    "Detail Orientation",
  ];

  const traits: { id: string; name: string }[] = [];
  for (let i = 0; i < traitNames.length; i++) {
    const t = await prisma.trait.upsert({
      where: { id: `seed-trait-${i + 1}` },
      create: { id: `seed-trait-${i + 1}`, name: traitNames[i] },
      update: { name: traitNames[i] },
    });
    traits.push(t);
  }

  const rolePm = await prisma.roleProfile.upsert({
    where: { id: "seed-role-pm" },
    create: {
      id: "seed-role-pm",
      name: "Product Manager",
      organizationId: org.id,
    },
    update: {},
  });
  const roleDa = await prisma.roleProfile.upsert({
    where: { id: "seed-role-da" },
    create: {
      id: "seed-role-da",
      name: "Data Analyst",
      organizationId: org.id,
    },
    update: {},
  });

  const defaultWeight = 1 / traits.length;
  for (const role of [rolePm, roleDa]) {
    for (let i = 0; i < traits.length; i++) {
      const targetMin = 40 + i * 3;
      const targetMax = 85 + (i % 3);
      await prisma.roleTraitConfig.upsert({
        where: {
          roleId_traitId: { roleId: role.id, traitId: traits[i].id },
        },
        create: {
          roleId: role.id,
          traitId: traits[i].id,
          weight: defaultWeight,
          targetMin,
          targetMax: Math.min(100, targetMax),
          riskBelow: 25,
          riskAbove: 95,
        },
        update: {},
      });
    }
  }

  // Seed 1 live job: Business Development Manager
  const job = await prisma.job.upsert({
    where: { id: "seed-job-1" },
    create: {
      id: "seed-job-1",
      orgId: org.id,
      title: "Business Development Manager",
      department: "Sales",
      location: "Berlin / Hybrid",
      employmentType: "Full-time",
      level: "Senior",
      status: "LIVE",
    },
    update: {},
  });

  const defaultStages = [
    "New / Applied",
    "ATS Screening",
    "Psychometric Assessment",
    "One-way Interview",
    "Technical Interview",
    "HR Interview",
    "Offer",
    "Hired / Rejected",
  ];
  const stages: { id: string }[] = [];
  for (let i = 0; i < defaultStages.length; i++) {
    const s = await prisma.jobStage.upsert({
      where: { id: `seed-stage-${job.id}-${i}` },
      create: {
        id: `seed-stage-${job.id}-${i}`,
        jobId: job.id,
        name: defaultStages[i],
        order: i,
        slaTargetHours: i < 2 ? 48 : null,
      },
      update: {},
    });
    stages.push(s);
  }

  const roleBdm = await prisma.roleProfile.upsert({
    where: { id: "seed-role-bdm" },
    create: {
      id: "seed-role-bdm",
      name: "Business Development Manager",
      organizationId: org.id,
    },
    update: {},
  });
  await prisma.job.update({
    where: { id: job.id },
    data: { roleProfileId: roleBdm.id },
  });
  for (let i = 0; i < traits.length; i++) {
    await prisma.roleTraitConfig.upsert({
      where: {
        roleId_traitId: { roleId: roleBdm.id, traitId: traits[i].id },
      },
      create: {
        roleId: roleBdm.id,
        traitId: traits[i].id,
        weight: defaultWeight,
        targetMin: 45 + i * 2,
        targetMax: Math.min(100, 80 + (i % 4)),
        riskBelow: 25,
        riskAbove: 95,
      },
      update: {},
    });
  }

  const candidatesData = [
    { name: "Alex Chen", email: "alex.chen@example.com", atsScore: 82 },
    { name: "Sam Rivera", email: "sam.rivera@example.com", atsScore: 71 },
    { name: "Jordan Lee", email: "jordan.lee@example.com", atsScore: 88 },
    { name: "Casey Morgan", email: "casey.morgan@example.com", atsScore: 68 },
    { name: "Riley Kim", email: "riley.kim@example.com", atsScore: 79 },
    { name: "Taylor Brooks", email: "taylor.brooks@example.com", atsScore: 64 },
    { name: "Morgan Hill", email: "morgan.hill@example.com", atsScore: 75 },
    { name: "Jamie Fox", email: "jamie.fox@example.com", atsScore: 90 },
  ];

  const percentilesByCandidate: Record<number, number[]> = {
    0: [72, 68, 85, 61, 78, 70, 82, 65, 55, 88],
    1: [58, 75, 62, 71, 69, 80, 58, 72, 48, 75],
    2: [88, 82, 90, 78, 85, 88, 92, 80, 70, 82],
    3: [65, 72, 68, 74, 70, 65, 71, 69, 52, 90],
    4: [78, 85, 75, 80, 82, 78, 85, 88, 65, 70],
    5: [62, 58, 65, 55, 60, 72, 65, 58, 80, 68],
  };

  const appliedAt = new Date(Date.now() - 86400000 * 3);
  const candidates: { id: string; name: string; email: string | null; roleId: string | null }[] = [];
  for (let i = 0; i < candidatesData.length; i++) {
    const stageIndex = i % stages.length;
    const stageId = stages[stageIndex].id;
    const c = await prisma.candidate.upsert({
      where: { id: `seed-cand-${i + 1}` },
      create: {
        id: `seed-cand-${i + 1}`,
        name: candidatesData[i].name,
        email: candidatesData[i].email,
        organizationId: org.id,
        jobId: job.id,
        currentStageId: stageId,
        roleId: roleBdm.id,
        status: "in_review",
        atsScore: candidatesData[i].atsScore ?? 70,
        skillScore: 70 + (i % 5) * 5,
        appliedAt,
      },
      update: { jobId: job.id, currentStageId: stages[stageIndex].id, roleId: roleBdm.id, atsScore: candidatesData[i].atsScore ?? 70, skillScore: 70 + (i % 5) * 5, appliedAt },
    });
    candidates.push(c);
    const percs = percentilesByCandidate[i] ?? percentilesByCandidate[0];
    for (let t = 0; t < traits.length; t++) {
      await prisma.assessmentResult.upsert({
        where: {
          candidateId_traitId: { candidateId: c.id, traitId: traits[t].id },
        },
        create: {
          candidateId: c.id,
          traitId: traits[t].id,
          percentile: percs[t] ?? 70,
        },
        update: { percentile: percs[t] ?? 70 },
      });
    }
  }

  const adminUser = await prisma.user.findUnique({ where: { email: "admin@kerohire.io" } });
  if (!adminUser) throw new Error("Admin user not found");

  const interviewTypes = ["ONE_WAY", "TECHNICAL"] as const;
  const interviewTitles = ["One-way Interview", "Technical Interview"];
  for (let i = 0; i < 2; i++) {
    const cand = candidates[i];
    const session = await prisma.interviewSession.upsert({
      where: { id: `seed-session-${i + 1}` },
      create: {
        id: `seed-session-${i + 1}`,
        orgId: org.id,
        candidateId: cand.id,
        title: `${interviewTitles[i]} – ${cand.name}`,
        interviewType: interviewTypes[i],
        sourceType: "UPLOAD",
        status: "SUMMARIZED",
        languageOriginal: "en",
        languagePreferred: "en",
      },
      update: { interviewType: interviewTypes[i], title: `${interviewTitles[i]} – ${cand.name}` },
    });

    const transcriptText = i === 0
      ? "Interviewer: Tell me about a time you led a project under pressure.\nCandidate: I led a cross-functional team of eight during a product launch. We had a two-week delay from engineering. I realigned priorities, ran daily standups, and we shipped on the new date. I learned that clear communication and accountability were critical.\nInterviewer: How do you handle disagreement with stakeholders?\nCandidate: I try to understand their constraints first. Then I share data and trade-offs. Usually we find a middle path or agree to a short experiment."
      : "Interviewer: Describe your experience with data-driven decisions.\nCandidate: In my last role I built dashboards for the sales team. We reduced reporting time by 40%. I also ran A/B tests on pricing and presented findings to leadership. I prefer to base decisions on evidence rather than intuition.";

    await prisma.interviewTranscript.upsert({
      where: { sessionId: session.id },
      create: {
        sessionId: session.id,
        text: transcriptText,
        segments: JSON.stringify([
          { start: 0, end: 5, text: "Interviewer: Tell me about a time..." },
          { start: 5, end: 30, text: "Candidate: I led a cross-functional team..." },
        ]),
      },
      update: {},
    });

    await prisma.interviewSummary.upsert({
      where: { sessionId: session.id },
      create: {
        sessionId: session.id,
        roleId: cand.roleId ?? rolePm.id,
        summary: i === 0
          ? "Candidate demonstrated strong leadership and communication. Gave a concrete example of leading under pressure with clear outcomes. Handles stakeholder disagreement with a structured, data-informed approach."
          : "Candidate showed solid analytical and communication skills. Experience with dashboards and A/B testing. Evidence-based decision making.",
        evidence: JSON.stringify([
          { quote: "I led a cross-functional team of eight during a product launch", timestamp: "00:45" },
          { quote: "clear communication and accountability were critical", timestamp: "01:20" },
        ]),
        mappedTraits: JSON.stringify({ "Leadership Drive": "Led team under pressure", "Communication": "Clear standups and stakeholder dialogue" }),
        risks: JSON.stringify([]),
      },
      update: {},
    });

    await prisma.interviewScorecard.upsert({
      where: { sessionId: session.id },
      create: {
        sessionId: session.id,
        overallRecommendation: i === 0 ? "Strong yes – recommend for next round." : "Yes – good fit for data-focused role.",
        rubric: JSON.stringify({
          "Leadership Drive": 4,
          "Communication": 5,
          "Strategic Thinking": 4,
        }),
        interviewerNotes: "Positive impression.",
      },
      update: {},
    });
  }

  // Demo HR Interview for first candidate
  const hrCandidate = candidates[0];
  const hrSession = await prisma.interviewSession.upsert({
    where: { id: "seed-session-hr" },
    create: {
      id: "seed-session-hr",
      orgId: org.id,
      candidateId: hrCandidate.id,
      title: `HR Interview – ${hrCandidate.name}`,
      interviewType: "HR",
      sourceType: "UPLOAD",
      status: "SUMMARIZED",
      languageOriginal: "en",
      languagePreferred: "en",
    },
    update: {},
  });
  await prisma.interviewTranscript.upsert({
    where: { sessionId: hrSession.id },
    create: {
      sessionId: hrSession.id,
      text: "HR: Why do you want to join our company?\nCandidate: I'm excited about the product and the growth stage. I've followed your launches and think my BD experience in B2B SaaS would be a strong fit.\nHR: What are your salary expectations?\nCandidate: I'm flexible and would like to understand the full package. My range is aligned with market for this level in Berlin.\nHR: When could you start?\nCandidate: I have a one-month notice period. I could start by early next quarter.",
      segments: JSON.stringify([
        { start: 0, end: 8, text: "HR: Why do you want to join..." },
        { start: 8, end: 35, text: "Candidate: I'm excited about the product..." },
      ]),
    },
    update: {},
  });
  await prisma.interviewSummary.upsert({
    where: { sessionId: hrSession.id },
    create: {
      sessionId: hrSession.id,
      roleId: hrCandidate.roleId ?? undefined,
      summary: "Candidate showed strong motivation and cultural fit. Clear on expectations and availability. Professional and prepared.",
      evidence: JSON.stringify([
        { quote: "I think my BD experience in B2B SaaS would be a strong fit", timestamp: "01:15" },
        { quote: "I'm flexible and would like to understand the full package", timestamp: "02:30" },
      ]),
      mappedTraits: JSON.stringify({ "Communication": "Clear expectations", "Accountability": "Notice period stated" }),
      risks: JSON.stringify([]),
    },
    update: {},
  });
  await prisma.interviewScorecard.upsert({
    where: { sessionId: hrSession.id },
    create: {
      sessionId: hrSession.id,
      overallRecommendation: "Recommend for offer. Aligned on motivation and logistics.",
      rubric: JSON.stringify({ "Culture fit": 5, "Communication": 5, "Expectations": 4 }),
      interviewerNotes: "Positive. Ready for offer stage.",
    },
    update: {},
  });

  const noteContent = "Shortlisted for final round. Strong alignment on leadership and collaboration.";
  let note = await prisma.note.findFirst({
    where: { candidateId: candidates[0].id, type: "decision", content: noteContent },
  });
  if (!note) {
    note = await prisma.note.create({
      data: {
        candidateId: candidates[0].id,
        authorId: adminUser.id,
        type: "decision",
        content: noteContent,
      },
    });
  }

  const summaryForTranslation = await prisma.interviewSummary.findFirst({
    where: { session: { orgId: org.id } },
  });

  if (summaryForTranslation) {
    const existingSummaryTrans = await prisma.translationRecord.findFirst({
      where: { entityType: "InterviewSummary", entityId: summaryForTranslation.id, toLang: "de" },
    });
    if (!existingSummaryTrans) {
      await prisma.translationRecord.create({
        data: {
          entityType: "InterviewSummary",
          entityId: summaryForTranslation.id,
          fromLang: "en",
          toLang: "de",
          translatedText: "Der Kandidat zeigte starke Führungsqualitäten und Kommunikation. Konkretes Beispiel für Führung unter Druck mit klaren Ergebnissen.",
          summaryId: summaryForTranslation.id,
        },
      });
    }
  }
  if (note) {
    const existingNoteTrans = await prisma.translationRecord.findFirst({
      where: { entityType: "Note", entityId: note.id, toLang: "de" },
    });
    if (!existingNoteTrans) {
      await prisma.translationRecord.create({
        data: {
          entityType: "Note",
          entityId: note.id,
          fromLang: "en",
          toLang: "de",
          translatedText: "Für die Endrunde ausgewählt. Starke Übereinstimmung bei Führung und Zusammenarbeit.",
          noteId: note.id,
        },
      });
    }
  }

  const cleanHumanText = "I chose to work on the payment flow because our support tickets showed a 30% drop-off at step 2. I talked to three customers and read the existing code. I changed the validation order and added a clearer error message. It took me about four hours. I'm not sure if we should add a progress bar—I'd want to A/B test that.";
  const aiAssistedText = "In conclusion, the payment flow optimization was undertaken following a comprehensive analysis of user behavior metrics. Key initiatives included refactoring the validation logic and implementing user-centric error messaging. Moving forward, we recommend conducting further research to validate the proposed progress indicator implementation.";

  let s1 = await prisma.contentSubmission.findFirst({
    where: { orgId: org.id, candidateId: candidates[0].id, type: "TAKE_HOME", text: cleanHumanText },
  });
  if (!s1) {
    s1 = await prisma.contentSubmission.create({
      data: {
        orgId: org.id,
        candidateId: candidates[0].id,
        type: "TAKE_HOME",
        text: cleanHumanText,
      },
    });
  }
  let s2 = await prisma.contentSubmission.findFirst({
    where: { orgId: org.id, candidateId: candidates[1].id, type: "TAKE_HOME", text: aiAssistedText },
  });
  if (!s2) {
    s2 = await prisma.contentSubmission.create({
      data: {
        orgId: org.id,
        candidateId: candidates[1].id,
        type: "TAKE_HOME",
        text: aiAssistedText,
      },
    });
  }

  const existingAi1 = await prisma.aiSignal.findFirst({ where: { submissionId: s1.id } });
  if (!existingAi1) {
    await prisma.aiSignal.create({
      data: {
        submissionId: s1.id,
        band: "LOW",
        score: 0.18,
        reasons: JSON.stringify([
          "Informal phrasing and first-person narrative",
          "Concrete time estimate and uncertainty expressed",
          "Specific numbers and context (30%, step 2, four hours)",
        ]),
        disclaimerShown: true,
      },
    });
  }
  const existingAi2 = await prisma.aiSignal.findFirst({ where: { submissionId: s2.id } });
  if (!existingAi2) {
    await prisma.aiSignal.create({
      data: {
        submissionId: s2.id,
        band: "HIGH",
        score: 0.89,
        reasons: JSON.stringify([
          "Highly structured, conclusion-led phrasing",
          "Generic corporate vocabulary (e.g. 'comprehensive analysis', 'key initiatives')",
          "Lack of personal voice or specific details",
        ]),
        disclaimerShown: true,
      },
    });
  }

  console.log("Seed completed: NovaTech Solutions, users, traits, roles, candidates, assessments, 2 interview sessions, translations, AI signals.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
