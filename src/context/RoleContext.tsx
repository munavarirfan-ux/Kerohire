"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { PreviewRole } from "@/config/previewRole";

type RoleContextValue = {
  selectedRole: PreviewRole;
  setSelectedRole: (role: PreviewRole) => void;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [selectedRole, setSelectedRole] = useState<PreviewRole>("superAdmin");

  const value = useMemo(
    () => ({
      selectedRole,
      setSelectedRole,
    }),
    [selectedRole],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}

/** @deprecated Use `PreviewRole` — kept for older imports. */
export type UserRole = PreviewRole;
