"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";

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
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-8 text-[#0F172A] sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_480px]">
        <section className="hidden lg:block">
          <Link href="/" className="inline-flex items-center gap-3">
            <AiflowLogo />
          </Link>

          <div className="mt-14 max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5E9]">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-5xl font-black leading-[1.05] tracking-tight text-[#0F172A]">
              Automate daily business work with clarity and control.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
              AIFLOW helps small business owners create customer replies,
              captions, invoices, and product content from one calm workspace.
            </p>
          </div>

          <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-2">
            <TrustPoint title="Built for speed" body="Launch repeat tasks in seconds." />
            <TrustPoint title="Business-ready" body="Clean tools for real workflows." />
          </div>
        </section>

        <section className="mx-auto w-full max-w-[480px]">
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-3">
              <AiflowLogo />
            </Link>
          </div>

          <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-sm font-semibold text-[#0369A1]">
                <Sparkles size={15} />
                AIFLOW workspace
              </div>
              <h2 className="mt-6 text-3xl font-black tracking-tight text-[#0F172A] sm:text-4xl">
                {title}
              </h2>
              <p className="mt-3 text-[15px] leading-6 text-slate-500">
                {subtitle}
              </p>
            </div>

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
                    href="#"
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
                className="h-12 w-full rounded-[14px] border-[#CBD5E1] bg-white text-[15px] font-bold text-[#0F172A] shadow-sm hover:bg-slate-50"
              >
                <span className="flex size-5 items-center justify-center rounded-full border border-slate-200 text-sm font-black text-[#0EA5E9]">
                  G
                </span>
                {googleLoading ? "Opening Google..." : googleAction}
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
          </div>
        </section>
      </div>
    </main>
  );
}

function AiflowLogo() {
  return (
    <>
      <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#0F172A] text-xl font-black text-white shadow-[0_12px_30px_rgba(15,23,42,0.22)]">
        A
      </div>
      <div>
        <p className="text-2xl font-black leading-none tracking-tight text-[#0F172A]">
          AIFLOW
        </p>
        <p className="mt-1 text-sm font-medium text-slate-500">
          AI automation SaaS
        </p>
      </div>
    </>
  );
}

function TrustPoint({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <div className="mb-4 h-2 w-16 rounded-full bg-[#0EA5E9]" />
      <h3 className="text-base font-bold text-[#0F172A]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
    </div>
  );
}
