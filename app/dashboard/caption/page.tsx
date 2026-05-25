"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  DashboardUsageSummary,
  DashboardUserMenu,
} from "@/components/auth/dashboard-auth";

import {
  ArrowLeft,
  Bell,
  Bot,
  Check,
  Clock3,
  Copy,
  Crown,
  Grid2X2,
  Headphones,
  MessageSquare,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

const examples = [
  "Luxury perfume business launching a new evening scent",
  "Fashion brand for women promoting a weekend sale",
  "Restaurant opening promo for families in Lagos",
  "Real estate business advertising affordable apartments",
];

const platforms = [
  {
    value: "Instagram",
    label: "Instagram",
    description: "Scroll-stopping social caption",
    icon: Sparkles,
  },
  {
    value: "WhatsApp",
    label: "WhatsApp",
    description: "Direct customer broadcast",
    icon: MessageSquare,
  },
  {
    value: "Facebook",
    label: "Facebook",
    description: "Community-ready post",
    icon: Grid2X2,
  },
  {
    value: "LinkedIn",
    label: "LinkedIn",
    description: "Business-focused update",
    icon: Bot,
  },
];

const tones = [
  "Professional",
  "Friendly",
  "Luxury",
  "Promotional",
] as const;

type Platform = (typeof platforms)[number]["value"];
type Tone = (typeof tones)[number];

export default function CaptionPage() {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [tone, setTone] = useState<Tone>("Professional");
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");

  const selectedPlatform =
    platforms.find((item) => item.value === platform) ?? platforms[0];

  const captionCards = useMemo(() => splitCaptions(caption), [caption]);

  const generateCaption = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setCaption("");
    setCopied("");
    setError("");

    try {
      const res = await fetch("/api/caption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: buildCaptionPrompt(prompt, platform, tone),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.caption) {
        throw new Error(data.message || "Unable to generate captions.");
      }

      setCaption(data.caption);
      window.dispatchEvent(new Event("aiflow:generation-saved"));
    } catch (error) {
      console.log(error);
      setError(
        error instanceof Error
          ? error.message
          : "Could not generate captions right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyCaption = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#0F172A]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[292px] shrink-0 border-r border-[#E2E8F0] bg-white px-5 py-6 shadow-[18px_0_60px_rgba(15,23,42,0.04)] lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-3">
            <AiflowLogo />
          </Link>

          <nav className="mt-10 space-y-2">
            <SidebarItem icon={Grid2X2} label="Dashboard" href="/dashboard" />
            <SidebarItem icon={Clock3} label="History" href="/dashboard/history" />
            <SidebarItem active icon={Sparkles} label="Caption Generator" />
            <SidebarItem icon={Bot} label="Automations" />
            <SidebarItem icon={Settings} label="Settings" href="/dashboard/settings" />
          </nav>

          <div className="mt-auto space-y-4">
            <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#F0F9FF] text-[#0EA5E9]">
                <Crown size={22} />
              </div>
              <h3 className="mt-5 text-lg font-black tracking-tight text-[#0F172A]">
                Free Plan
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create captions, replies, invoices, FAQs, and product copy.
              </p>
              <div className="mt-5">
                <DashboardUsageSummary />
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#F0F9FF] text-[#0EA5E9]">
                <Headphones size={21} />
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A]">Need help?</h4>
                <p className="text-sm text-slate-500">Contact support</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="hidden">
                <Link href="/" className="flex items-center gap-3">
                  <AiflowLogo compact />
                </Link>
              </div>

              <div className="flex h-12 w-full items-center gap-3 rounded-[16px] border border-[#E2E8F0] bg-white px-4 shadow-sm sm:max-w-md">
                <Search size={18} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-400">
                  Search anything...
                </span>
                <span className="ml-auto hidden rounded-lg bg-[#F8FAFC] px-2.5 py-1 text-xs font-semibold text-slate-400 sm:inline">
                  CTRL K
                </span>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#E2E8F0] bg-white shadow-sm transition hover:border-[#0EA5E9]">
                  <Bell size={20} className="text-[#0F172A]" />
                  <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#0EA5E9] text-[10px] font-bold text-white">
                    2
                  </span>
                </button>

                <DashboardUserMenu />
              </div>
            </header>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#0EA5E9]"
              >
                <ArrowLeft size={17} />
                Back to Dashboard
              </Link>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-sm font-semibold text-[#0369A1]">
                <Zap size={15} />
                AI caption workflow
              </div>
            </div>

            <section className="mt-5 overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:rounded-[28px]">
              <div className="grid gap-8 p-5 sm:p-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)] xl:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-sm font-semibold text-[#0369A1]">
                    <Sparkles size={15} />
                    Caption studio
                  </div>
                  <h1 className="mt-6 max-w-3xl text-3xl font-black leading-[1.08] tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
                    AI Caption Generator
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                    Turn a product, offer, or business idea into polished
                    captions tailored for your platform and brand tone.
                  </p>
                </div>

                <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#F0F9FF] text-[#0EA5E9]">
                      <selectedPlatform.icon size={23} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#0F172A]">
                        {selectedPlatform.label} ready
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {tone} tone selected
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-3 min-[360px]:grid-cols-3">
                    <MiniMetric value="3" label="Captions" />
                    <MiniMetric value="<40" label="Words each" />
                    <MiniMetric value="1" label="Click copy" />
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)]">
              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5E9]">
                      Create
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0F172A]">
                      Caption Brief
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Add the offer, audience, product details, or customer
                      promise you want the AI to shape into captions.
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="caption-prompt"
                  className="mt-6 block text-sm font-bold text-[#0F172A]"
                >
                  Business or product details
                </label>
                <textarea
                  id="caption-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your product, offer, audience, and any important details..."
                  className="mt-3 h-44 w-full resize-none rounded-[20px] border border-[#CBD5E1] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-[#BAE6FD]/50"
                />

                <div className="mt-5 flex flex-wrap gap-2">
                  {examples.map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => setPrompt(example)}
                      className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-left text-xs font-bold text-slate-600 shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0369A1]"
                    >
                      {example}
                    </button>
                  ))}
                </div>

                <div className="mt-7">
                  <p className="text-sm font-bold text-[#0F172A]">Platform</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {platforms.map((item) => (
                      <SelectorButton
                        key={item.value}
                        active={platform === item.value}
                        description={item.description}
                        icon={item.icon}
                        label={item.label}
                        onClick={() => setPlatform(item.value)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-7">
                  <p className="text-sm font-bold text-[#0F172A]">Tone</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-4">
                    {tones.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setTone(item)}
                        className={[
                          "h-11 rounded-[14px] border px-3 text-sm font-bold transition",
                          tone === item
                            ? "border-[#0EA5E9] bg-[#F0F9FF] text-[#0369A1] shadow-[0_10px_24px_rgba(14,165,233,0.12)]"
                            : "border-[#E2E8F0] bg-white text-slate-600 hover:border-[#BAE6FD] hover:bg-[#F8FAFC]",
                        ].join(" ")}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {error ? (
                  <div className="mt-5 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={generateCaption}
                  disabled={loading || !prompt.trim()}
                  className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#0F172A] px-5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading ? (
                    <>
                      <LoadingDot />
                      Generating captions
                    </>
                  ) : (
                    <>
                      <Sparkles size={17} />
                      Generate Captions
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5E9]">
                      Output
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0F172A]">
                      Generated Captions
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Review each option, copy your favorite, or regenerate a
                      fresh set with the same brief.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={generateCaption}
                    disabled={loading || !prompt.trim()}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white px-4 text-sm font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0369A1] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    <RefreshCw
                      size={16}
                      className={loading ? "animate-spin" : ""}
                    />
                    Regenerate
                  </button>
                </div>

                {loading ? (
                  <LoadingState />
                ) : captionCards.length > 0 ? (
                  <div className="mt-6 space-y-4">
                    {captionCards.map((item, index) => {
                      const copyId = `caption-${index}`;

                      return (
                        <article
                          key={copyId}
                          className="rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-5 transition hover:border-[#BAE6FD] hover:bg-white hover:shadow-[0_18px_42px_rgba(14,165,233,0.10)]"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#F0F9FF] text-sm font-black text-[#0EA5E9]">
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="text-sm font-black text-[#0F172A]">
                                  Caption Option
                                </h3>
                                <p className="mt-1 text-xs font-semibold text-slate-500">
                                  {platform} / {tone}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => copyCaption(item, copyId)}
                              className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white px-3 text-xs font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0369A1]"
                            >
                              {copied === copyId ? (
                                <Check size={15} className="text-[#0EA5E9]" />
                              ) : (
                                <Copy size={15} className="text-[#0EA5E9]" />
                              )}
                              {copied === copyId ? "Copied" : "Copy"}
                            </button>
                          </div>

                          <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                            {item}
                          </p>
                        </article>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => copyCaption(caption, "all-captions")}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[#0EA5E9] px-4 text-sm font-bold text-white shadow-[0_12px_24px_rgba(14,165,233,0.24)] transition hover:bg-[#0284C7]"
                    >
                      {copied === "all-captions" ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                      {copied === "all-captions"
                        ? "All captions copied"
                        : "Copy all captions"}
                    </button>
                  </div>
                ) : (
                  <EmptyState platform={selectedPlatform.label} tone={tone} />
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function buildCaptionPrompt(prompt: string, platform: Platform, tone: Tone) {
  return [
    prompt.trim(),
    "",
    `Platform: ${platform}`,
    `Tone: ${tone}`,
    "Write the captions specifically for this platform and tone.",
  ].join("\n");
}

function splitCaptions(caption: string) {
  return caption
    .split(/\n+/)
    .map((item) =>
      item
        .trim()
        .replace(/^[-*\d.)\s]+/, "")
        .trim()
    )
    .filter(Boolean);
}

function AiflowLogo({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#0F172A] text-xl font-black text-white shadow-[0_12px_30px_rgba(15,23,42,0.22)]">
        A
      </div>
      <div>
        <p className="text-2xl font-black leading-none tracking-tight text-[#0F172A]">
          AIFLOW
        </p>
        {!compact ? (
          <p className="mt-1 text-sm font-medium text-slate-500">
            AI automation SaaS
          </p>
        ) : null}
      </div>
    </>
  );
}

function SidebarItem({
  active = false,
  href,
  icon: Icon,
  label,
}: {
  active?: boolean;
  href?: string;
  icon: LucideIcon;
  label: string;
}) {
  const className = [
    "flex items-center gap-4 rounded-[16px] px-4 py-3 text-sm font-bold transition",
    active
      ? "border border-[#BAE6FD] bg-[#F0F9FF] text-[#0F172A]"
      : "text-slate-500 hover:bg-[#F8FAFC] hover:text-[#0F172A]",
  ].join(" ");

  const content = (
    <>
      <Icon size={20} className={active ? "text-[#0EA5E9]" : ""} />
      {label}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

function SelectorButton({
  active,
  description,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  description: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex min-h-[92px] items-start gap-3 rounded-[18px] border p-4 text-left transition",
        active
          ? "border-[#0EA5E9] bg-[#F0F9FF] shadow-[0_12px_28px_rgba(14,165,233,0.14)]"
          : "border-[#E2E8F0] bg-white hover:border-[#BAE6FD] hover:bg-[#F8FAFC]",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px]",
          active ? "bg-[#0EA5E9] text-white" : "bg-[#F0F9FF] text-[#0EA5E9]",
        ].join(" ")}
      >
        <Icon size={21} />
      </div>
      <div>
        <p className="text-sm font-black text-[#0F172A]">{label}</p>
        <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
      </div>
    </button>
  );
}

function MiniMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-3">
      <p className="text-lg font-black leading-none text-[#0F172A]">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function LoadingDot() {
  return (
    <span className="relative flex h-4 w-4">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7DD3FC] opacity-75" />
      <span className="relative inline-flex h-4 w-4 rounded-full bg-[#0EA5E9]" />
    </span>
  );
}

function LoadingState() {
  return (
    <div className="mt-6 rounded-[24px] border border-[#BAE6FD] bg-[#F0F9FF] p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-white text-[#0EA5E9] shadow-sm">
          <RefreshCw size={22} className="animate-spin" />
        </div>
        <div>
          <p className="text-sm font-black text-[#0F172A]">
            Writing caption options
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Matching platform, tone, and business context.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="rounded-[18px] border border-[#E2E8F0] bg-white p-4"
          >
            <div className="h-3 w-24 animate-pulse rounded-full bg-[#BAE6FD]" />
            <div className="mt-4 space-y-3">
              <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-3/5 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ platform, tone }: { platform: string; tone: Tone }) {
  return (
    <div className="mt-6 rounded-[24px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#F0F9FF] text-[#0EA5E9]">
        <Sparkles size={26} />
      </div>
      <h3 className="mt-5 text-lg font-black text-[#0F172A]">
        Your caption cards will appear here
      </h3>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
        Add a brief and generate {tone.toLowerCase()} captions for {platform}.
      </p>
    </div>
  );
}
