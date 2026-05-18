"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 p-6 text-zinc-100 antialiased">
        <div className="mx-auto flex max-w-md flex-col gap-4 pt-24 text-center">
          <h1 className="text-xl font-semibold">Application error</h1>
          <p className="text-sm text-zinc-400">{error.message || "A critical error occurred."}</p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
