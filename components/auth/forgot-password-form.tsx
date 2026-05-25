"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { ArrowRight, Mail } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ForgotPasswordResponse = {
  message?: string;
  resetUrl?: string;
  success?: boolean;
};

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");
    setResetUrl("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = (await res.json()) as ForgotPasswordResponse;

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Could not send reset link.");
      }

      setSuccess(data.message || "Password reset link generated.");
      setResetUrl(data.resetUrl || "");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Password help"
      title="Forgot password?"
      subtitle="Enter your account email and we will generate a secure reset link."
    >
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-slate-700"
          >
            Email address
          </label>
          <div className="relative">
            <Mail
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              disabled={loading}
              className="h-12 rounded-[14px] border-[#CBD5E1] bg-white pl-11 pr-4 text-[15px] shadow-sm focus-visible:border-[#0EA5E9] focus-visible:ring-[#0EA5E9]/20"
            />
          </div>
        </div>

        {error ? (
          <div
            className="rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            aria-live="polite"
          >
            {error}
          </div>
        ) : null}

        {success ? (
          <div
            className="space-y-3 rounded-[14px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
            aria-live="polite"
          >
            <p>{success}</p>
            {resetUrl ? (
              <Link
                href={resetUrl}
                className="inline-flex break-all text-[#0284C7] hover:text-[#0369A1]"
              >
                {resetUrl}
              </Link>
            ) : null}
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-[14px] bg-[#0F172A] text-[15px] font-bold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] hover:bg-[#1E293B]"
        >
          {loading ? "Sending..." : "Send Reset Link"}
          <ArrowRight size={18} />
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-bold text-[#0EA5E9] hover:text-[#0284C7]"
        >
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
