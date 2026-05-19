import { Suspense } from "react";
import { InterviewsDirectory } from "@/components/hiring/directories/InterviewsDirectory";

export default function InterviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-[13px] text-[#71717A]">
          Loading interviews…
        </div>
      }
    >
      <InterviewsDirectory />
    </Suspense>
  );
}
