/** Shared Radix overlay / surface motion — 180ms enterprise easing */
export const radixEase = "duration-[180ms] ease-out";

export const radixOverlay =
  "bg-[rgba(15,23,42,0.4)] backdrop-blur-[6px] data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out";

export const radixContent =
  "data-[state=open]:animate-radix-in data-[state=closed]:animate-radix-out";

export const radixSurface =
  "rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-surface shadow-[0_8px_32px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04)] dark:border-white/[0.08] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]";

export const radixItem =
  "rounded-[8px] px-2 py-1.5 text-[13px] outline-none transition-colors duration-[180ms] ease-out focus:bg-[rgba(15,23,42,0.04)] data-[highlighted]:bg-[rgba(15,23,42,0.04)] dark:focus:bg-white/[0.06] dark:data-[highlighted]:bg-white/[0.06]";

export const radixInteractiveCard =
  "transition-[transform,box-shadow,border-color] duration-[180ms] ease-out hover:-translate-y-px hover:border-[rgba(15,61,46,0.08)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.06)] dark:hover:border-emerald-500/10";
