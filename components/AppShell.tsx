"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Mic2,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/applicants", label: "Applicants", icon: Users },
  { href: "/interviews", label: "Interviews", icon: Mic2 },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6">
      {/* Centered white container - Aurora frame */}
      <div className="max-w-shell mx-auto bg-white rounded-[28px] shadow-sm border border-chrome-border min-h-[calc(100vh-3rem)] flex flex-col overflow-hidden">
        {/* Top nav - Lavender Chrome */}
        <header className="flex items-center justify-between h-14 px-6 border-b border-chrome-border bg-white shrink-0">
          <nav className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className="text-chrome-icon hover:text-chrome-active transition-subtle px-2 py-1 font-medium text-sm"
            >
              keroHire
            </Link>
            {nav.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-subtle",
                    active
                      ? "text-chrome-active border-chrome-active"
                      : "text-chrome-icon border-transparent hover:text-chrome-active hover:border-chrome"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-xs text-chrome-icon">{session?.user?.organizationName}</span>
            <span className="text-xs text-slate-400">{session?.user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-chrome-icon hover:text-chrome-active"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="max-w-content mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
