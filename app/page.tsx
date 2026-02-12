import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-parchment p-6">
      <h1 className="text-3xl font-semibold text-primary mb-2">keroHire</h1>
      <p className="text-slate-600 mb-6 text-center max-w-md">
        HR Psychometric + Interview Intelligence — Deep Forest Edition
      </p>
      <Link href="/login">
        <Button>Sign in</Button>
      </Link>
    </div>
  );
}
