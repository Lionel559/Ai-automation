"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Bot,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Crown,
  Grid2X2,
  Headphones,
  Inbox,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  Settings,
  Sparkles,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react";

const examples = [
  "How much is this product?",
  "Do you deliver to Lagos?",
  "Is this item still available?",
  "Can I pay on delivery?",
];

const tones = [
  {
    value: "Friendly",
    description: "Warm and approachable",
  },
  {
    value: "Professional",
    description: "Clear and polished",
  },
  {
    value: "Apologetic",
    description: "Calm and reassuring",
  },
  {
    value: "Sales",
    description: "Helpful and persuasive",
  },
] as const;

type Tone = (typeof tones)[number]["value"];

const inboxItems = [
  {
    name: "Ada",
    message: "Is this item still available?",
    time: "2m",
    active: true,
  },
  {
    name: "Tunde",
    message: "Can you deliver this today?",
    time: "8m",
    active: false,
  },
  {
    name: "Mina",
    message: "What size do you have left?",
    time: "14m",
    active: false,
  },
];

export default function ReplyPage() {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<Tone>("Friendly");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");

  const replyCards = useMemo(() => splitReplies(reply), [reply]);

  const generateReply = async () => {
    if (!message.trim() || loading) return;

    setLoading(true);
    setReply("");
    setCopied("");
    setError("");

    try {
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: buildReplyMessage(message, tone),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.reply) {
        throw new Error(data.message || "Unable to generate replies.");
      }

      setReply(data.reply);
    } catch (error) {
      console.log(error);
      setError("Could not generate replies right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyReply = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[292px] shrink-0 border-r border-[#E2E8F0] bg-white px-5 py-6 shadow-[18px_0_60px_rgba(15,23,42,0.04)] lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-3">
            <AiflowLogo />
          </Link>

          <nav className="mt-10 space-y-2">
            <SidebarItem icon={Grid2X2} label="Dashboard" href="/dashboard" />
            <SidebarItem active icon={MessageSquare} label="Reply Assistant" />
            <SidebarItem icon={Bot} label="Automations" />
            <SidebarItem icon={Settings} label="Settings" />
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
                Generate customer replies for DMs, WhatsApp, and sales chats.
              </p>
              <div className="mt-5">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Generations</span>
                  <span className="text-[#0EA5E9]">10 / 10</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-full rounded-full bg-[#0EA5E9]" />
                </div>
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

        <section className="flex-1 px-4 py-5 sm:px-6 lg:px-10 lg:py-7">
          <div className="mx-auto w-full max-w-7xl">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center justify-between gap-4 lg:hidden">
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

                <div className="hidden items-center gap-3 rounded-[18px] border border-[#E2E8F0] bg-white px-3 py-2 shadow-sm sm:flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F172A] text-sm font-black text-white">
                    AE
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none text-[#0F172A]">
                      Amao Elijah
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      Small Business
                    </p>
                  </div>
                </div>
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
                <Inbox size={15} />
                AI inbox assistant
              </div>
            </div>

            <section className="mt-5 overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_400px] xl:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-sm font-semibold text-[#0369A1]">
                    <MessageSquare size={15} />
                    Customer reply studio
                  </div>
                  <h1 className="mt-6 max-w-3xl text-3xl font-black leading-[1.08] tracking-tight text-[#0F172A] sm:text-5xl">
                    Customer Reply Assistant
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                    Turn incoming customer questions into clear, on-brand
                    replies for DMs, WhatsApp chats, and sales conversations.
                  </p>
                </div>

                <InboxPreview />
              </div>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.78fr)]">
              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5E9]">
                      Inbox
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0F172A]">
                      Customer Message
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Paste the customer question, pick the tone, and generate
                      reply options that are ready to send.
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="customer-message"
                  className="mt-6 block text-sm font-bold text-[#0F172A]"
                >
                  Message from customer
                </label>
                <textarea
                  id="customer-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Paste the customer's message here..."
                  className="mt-3 h-44 w-full resize-none rounded-[20px] border border-[#CBD5E1] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-[#BAE6FD]/50"
                />

                <div className="mt-5 flex flex-wrap gap-2">
                  {examples.map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => setMessage(example)}
                      className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-left text-xs font-bold text-slate-600 shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0369A1]"
                    >
                      {example}
                    </button>
                  ))}
                </div>

                <div className="mt-7">
                  <p className="text-sm font-bold text-[#0F172A]">Tone</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    {tones.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setTone(item.value)}
                        className={[
                          "min-h-[76px] rounded-[16px] border px-4 py-3 text-left transition",
                          tone === item.value
                            ? "border-[#0EA5E9] bg-[#F0F9FF] text-[#0369A1] shadow-[0_10px_24px_rgba(14,165,233,0.12)]"
                            : "border-[#E2E8F0] bg-white text-slate-600 hover:border-[#BAE6FD] hover:bg-[#F8FAFC]",
                        ].join(" ")}
                      >
                        <span className="block text-sm font-black">
                          {item.value}
                        </span>
                        <span className="mt-1 block text-xs font-semibold text-slate-500">
                          {item.description}
                        </span>
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
                  onClick={generateReply}
                  disabled={loading || !message.trim()}
                  className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#0F172A] px-5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading ? (
                    <>
                      <LoadingDot />
                      Generating replies
                    </>
                  ) : (
                    <>
                      <Sparkles size={17} />
                      Generate Replies
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5E9]">
                      Replies
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0F172A]">
                      AI Response Cards
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Copy one reply, or regenerate a fresh set using the same
                      customer message and tone.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={generateReply}
                    disabled={loading || !message.trim()}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white px-4 text-sm font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0369A1] disabled:cursor-not-allowed disabled:opacity-60"
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
                ) : replyCards.length > 0 ? (
                  <div className="mt-6 space-y-4">
                    {replyCards.map((item, index) => {
                      const copyId = `reply-${index}`;

                      return (
                        <article
                          key={copyId}
                          className="rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-5 transition hover:border-[#BAE6FD] hover:bg-white hover:shadow-[0_18px_42px_rgba(14,165,233,0.10)]"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#F0F9FF] text-[#0EA5E9]">
                                <Send size={18} />
                              </div>
                              <div>
                                <h3 className="text-sm font-black text-[#0F172A]">
                                  Reply Option {index + 1}
                                </h3>
                                <p className="mt-1 text-xs font-semibold text-slate-500">
                                  {tone} tone
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => copyReply(item, copyId)}
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
                      onClick={() => copyReply(reply, "all-replies")}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[#0EA5E9] px-4 text-sm font-bold text-white shadow-[0_12px_24px_rgba(14,165,233,0.24)] transition hover:bg-[#0284C7]"
                    >
                      {copied === "all-replies" ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                      {copied === "all-replies"
                        ? "All replies copied"
                        : "Copy all replies"}
                    </button>
                  </div>
                ) : (
                  <EmptyState tone={tone} />
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function buildReplyMessage(message: string, tone: Tone) {
  return [
    message.trim(),
    "",
    `Preferred tone: ${tone}`,
    "Write replies in this tone while keeping them clear, short, and suitable for WhatsApp or Instagram DM.",
  ].join("\n");
}

function splitReplies(reply: string) {
  return reply
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

function InboxPreview() {
  return (
    <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#0F172A] text-white">
            <Inbox size={21} />
          </div>
          <div>
            <p className="text-sm font-black text-[#0F172A]">Inbox Queue</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              3 open conversations
            </p>
          </div>
        </div>
        <div className="rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-xs font-bold text-[#0369A1]">
          Live
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {inboxItems.map((item) => (
          <div
            key={item.name}
            className={[
              "rounded-[18px] border p-4",
              item.active
                ? "border-[#BAE6FD] bg-white shadow-[0_12px_28px_rgba(14,165,233,0.10)]"
                : "border-[#E2E8F0] bg-white/70",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0F9FF] text-[#0EA5E9]">
                <UserRound size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-[#0F172A]">
                    {item.name}
                  </p>
                  <p className="text-xs font-semibold text-slate-400">
                    {item.time}
                  </p>
                </div>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {item.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <MiniMetric icon={Clock3} value="<1m" label="Reply time" />
        <MiniMetric icon={CheckCircle2} value="3" label="Options" />
        <MiniMetric icon={Zap} value="AI" label="Assisted" />
      </div>
    </div>
  );
}

function MiniMetric({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-3">
      <Icon size={16} className="text-[#0EA5E9]" />
      <p className="mt-3 text-lg font-black leading-none text-[#0F172A]">
        {value}
      </p>
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
            Drafting customer replies
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Matching the selected tone with a clear response.
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

function EmptyState({ tone }: { tone: Tone }) {
  return (
    <div className="mt-6 rounded-[24px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#F0F9FF] text-[#0EA5E9]">
        <MessageSquare size={26} />
      </div>
      <h3 className="mt-5 text-lg font-black text-[#0F172A]">
        Your reply cards will appear here
      </h3>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
        Paste a customer message and generate {tone.toLowerCase()} replies
        ready for your inbox.
      </p>
    </div>
  );
}
