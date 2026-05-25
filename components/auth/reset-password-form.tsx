"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { ArrowRight, LockKeyhole } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ResetPasswordFormProps = {
  token: string;
};

type ResetPasswordResponse = {
  message?: string;
  success?: boolean;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const missingToken = !token;
  const isDisabled = loading || missingToken || Boolean(success);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isDisabled) return;

    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = (await res.json()) as ResetPasswordResponse;

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Could not reset password.");
      }

      setSuccess("Password reset successfully. Redirecting to login...");
      setNewPassword("");
      setConfirmPassword("");

      window.setTimeout(() => {
        router.replace("/login");
      }, 1800);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Secure reset"
      title="Reset password"
      subtitle="Choose a new password for your AIFLOW workspace."
    >
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            htmlFor="newPassword"
            className="text-sm font-semibold text-slate-700"
          >
            New password
          </label>
          <div className="relative">
            <LockKeyhole
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Enter a new password"
              autoComplete="new-password"
              disabled={isDisabled}
              className="h-12 rounded-[14px] border-[#CBD5E1] bg-white pl-11 pr-4 text-[15px] shadow-sm focus-visible:border-[#0EA5E9] focus-visible:ring-[#0EA5E9]/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-semibold text-slate-700"
          >
            Confirm password
          </label>
          <div className="relative">
            <LockKeyhole
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              disabled={isDisabled}
              className="h-12 rounded-[14px] border-[#CBD5E1] bg-white pl-11 pr-4 text-[15px] shadow-sm focus-visible:border-[#0EA5E9] focus-visible:ring-[#0EA5E9]/20"
            />
          </div>
        </div>

        {missingToken ? (
          <div
            className="rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            aria-live="polite"
          >
            Reset link is missing. Request a new password reset link.
          </div>
        ) : null}

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
            className="rounded-[14px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
            aria-live="polite"
          >
            {success}
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={isDisabled}
          className="h-12 w-full rounded-[14px] bg-[#0F172A] text-[15px] font-bold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] hover:bg-[#1E293B]"
        >
          {loading ? "Resetting..." : "Reset Password"}
          <ArrowRight size={18} />
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Back to{" "}
        <Link
          href="/login"
          className="font-bold text-[#0EA5E9] hover:text-[#0284C7]"
        >
          login
        </Link>
      </p>
    </AuthShell>
  );
}
