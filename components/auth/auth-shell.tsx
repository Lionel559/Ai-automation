import Link from "next/link";
import type { ReactNode } from "react";

import { Sparkles } from "lucide-react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC] px-4 py-6 text-[#0F172A] sm:px-6 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
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
            <TrustPoint
              title="Built for speed"
              body="Launch repeat tasks in seconds."
            />
            <TrustPoint
              title="Business-ready"
              body="Clean tools for real workflows."
            />
          </div>
        </section>

        <section className="mx-auto w-full max-w-[480px]">
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-3">
              <AiflowLogo />
            </Link>
          </div>

          <div className="w-full rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:rounded-[28px] sm:p-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-sm font-semibold text-[#0369A1]">
                <Sparkles size={15} />
                AIFLOW workspace
              </div>
              <h2 className="mt-6 text-2xl font-black tracking-tight text-[#0F172A] sm:text-4xl">
                {title}
              </h2>
              <p className="mt-3 text-[15px] leading-6 text-slate-500">
                {subtitle}
              </p>
            </div>

            {children}
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
