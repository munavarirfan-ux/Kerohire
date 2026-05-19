import { Suspense } from "react";
import { CandidatesDirectory } from "@/components/hiring/directories/CandidatesDirectory";

export default function CandidatesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-[13px] text-[#71717A]">
          Loading candidates…
        </div>
      }
    >
      <CandidatesDirectory />
    </Suspense>
  );
}
