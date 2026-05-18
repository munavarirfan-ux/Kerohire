import { PrismaClient } from "@prisma/client";
import { seedDemo } from "./seedDemo";

const prisma = new PrismaClient();

async function main() {
  await seedDemo(prisma);
  console.log(
    "Seed completed: NovaTech Solutions, users, traits, roles, candidates, assessments, interview sessions, translations, AI signals.",
  );
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
