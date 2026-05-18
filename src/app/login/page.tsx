"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_NAME, DEMO_PASSWORD, DEMO_USERS } from "@/constants/app";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false, callbackUrl });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    window.location.href = callbackUrl;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(90deg, #F7A99F 0%, #D8A7E3 50%, #9DD3F8 100%)" }}>
      <div className="w-full max-w-md bg-surface rounded-[28px] shadow-sm border border-chrome-border p-6">
        <h1 className="text-2xl font-semibold text-chrome-active mb-6">Sign in to {APP_NAME}</h1>
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-secondary">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={DEMO_USERS.superAdmin}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted">
            Demo: <span className="font-medium">{DEMO_USERS.superAdmin}</span> / {DEMO_PASSWORD} (role preview) ·{" "}
            <span className="font-medium">{DEMO_USERS.admin}</span> / {DEMO_PASSWORD}
          </p>
        </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-parchment">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
