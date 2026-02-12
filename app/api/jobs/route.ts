import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { orgId, title, department, location, employmentType, level, salaryMin, salaryMax } = body;

  if (!title || orgId !== session.user.organizationId) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: {
      orgId,
      title,
      department: department || null,
      location: location || null,
      employmentType: employmentType || null,
      level: level || null,
      salaryMin: salaryMin != null ? Number(salaryMin) : null,
      salaryMax: salaryMax != null ? Number(salaryMax) : null,
      status: "DRAFT",
    },
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
  await prisma.jobStage.createMany({
    data: defaultStages.map((name, order) => ({
      jobId: job.id,
      name,
      order,
      slaTargetHours: order < 2 ? 48 : null,
    })),
  });

  return NextResponse.json({ id: job.id });
}
