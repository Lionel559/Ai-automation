"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthField = {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  autoComplete: string;
  icon: "email" | "password" | "name";
};

type AuthFormProps = {
  authMode: "login" | "register";
  eyebrow: string;
  title: string;
  subtitle: string;
  fields: AuthField[];
  primaryAction: string;
  googleAction: string;
  footerText: string;
  footerHref: string;
  footerLink: string;
  submitEndpoint: string;
  googleCallbackUrl: string;
  showForgotPassword?: boolean;
};

type AuthResponse = {
  message?: string;
  success?: boolean;
};

const fieldIcons = {
  email: Mail,
  password: LockKeyhole,
  name: UserRound,
};

export function AuthForm({
  authMode,
  eyebrow,
  title,
  subtitle,
  fields,
  primaryAction,
  googleAction,
  footerText,
  footerHref,
  footerLink,
  submitEndpoint,
  googleCallbackUrl,
  showForgotPassword = false,
}: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isBusy = loading || googleLoading;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isBusy) return;

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const name = String(formData.get("fullName") ?? "").trim();

    setError("");

    if (!email || !password || (authMode === "register" && !name)) {
      setError("Please fill in all required fields.");
      return;
    }

    if (authMode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(submitEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          authMode === "register"
            ? {
                name,
                email,
                password,
              }
            : {
                email,
                password,
              }
        ),
      });

      const data = (await res.json()) as AuthResponse;

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Authentication failed.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isBusy) return;

    setError("");
    setGoogleLoading(true);

    try {
      await signIn("google", { callbackUrl: googleCallbackUrl });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Google sign-in failed. Please try again."
      );
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell eyebrow={eyebrow} title={title} subtitle={subtitle}>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {fields.map((field) => {
          const Icon = fieldIcons[field.icon];

          return (
            <div key={field.name} className="space-y-2">
              <label
                htmlFor={field.name}
                className="text-sm font-semibold text-slate-700"
              >
                {field.label}
              </label>
              <div className="relative">
                <Icon
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  disabled={isBusy}
                  className="h-12 rounded-[14px] border-[#CBD5E1] bg-white pl-11 pr-4 text-[15px] shadow-sm focus-visible:border-[#0EA5E9] focus-visible:ring-[#0EA5E9]/20"
                />
              </div>
            </div>
          );
        })}

        {showForgotPassword ? (
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-[#0EA5E9] hover:text-[#0284C7]"
            >
              Forgot password?
            </Link>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={isBusy}
          className="h-12 w-full rounded-[14px] bg-[#0F172A] text-[15px] font-bold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] hover:bg-[#1E293B]"
        >
          {loading ? "Please wait..." : primaryAction}
          <ArrowRight size={18} />
        </Button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              or
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isBusy}
          onClick={handleGoogleSignIn}
          className="relative h-12 w-full rounded-[14px] border-[#CBD5E1] bg-white text-center text-[15px] font-bold text-[#0F172A] shadow-[0_8px_18px_rgba(15,23,42,0.06)] hover:border-[#94A3B8] hover:bg-white"
        >
          <span className="absolute left-4 flex size-5 items-center justify-center">
            <GoogleLogo />
          </span>
          <span>{googleLoading ? "Opening Google..." : googleAction}</span>
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        {footerText}{" "}
        <Link
          href={footerHref}
          className="font-bold text-[#0EA5E9] hover:text-[#0284C7]"
        >
          {footerLink}
        </Link>
      </p>
    </AuthShell>
  );
}

function GoogleLogo() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
        fill="#EA4335"
      />
    </svg>
  );
}
