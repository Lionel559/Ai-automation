"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
  FileText,
  Grid2X2,
  Headphones,
  Package,
  Search,
  Settings,
  Sparkles,
  Trash2,
  type LucideIcon,
} from "lucide-react";

type GenerationType =
  | "caption"
  | "reply"
  | "invoice"
  | "faq"
  | "product-description";

type HistoryFilter = GenerationType | "all";

type GenerationItem = {
  id: string;
  type: GenerationType;
  prompt: string;
  response: string;
  createdAt: string;
};

type HistoryResponse = {
  success?: boolean;
  message?: string;
  generations?: GenerationItem[];
};

const filters: Array<{ label: string; value: HistoryFilter; icon: LucideIcon }> =
  [
    {
      label: "All",
      value: "all",
      icon: Clock3,
    },
    {
      label: "Captions",
      value: "caption",
      icon: Sparkles,
    },
    {
      label: "Replies",
      value: "reply",
      icon: Bot,
    },
    {
      label: "Invoices",
      value: "invoice",
      icon: FileText,
    },
    {
      label: "FAQs",
      value: "faq",
      icon: Bot,
    },
    {
      label: "Products",
      value: "product-description",
      icon: Package,
    },
  ];

const typeLabels: Record<GenerationType, string> = {
  caption: "Caption",
  reply: "Reply",
  invoice: "Invoice",
  faq: "FAQ",
  "product-description": "Product Description",
};

export default function HistoryPage() {
  const [selectedType, setSelectedType] = useState<HistoryFilter>("all");
  const [generations, setGenerations] = useState<GenerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const selectedFilter = useMemo(
    () => filters.find((filter) => filter.value === selectedType) ?? filters[0],
    [selectedType]
  );

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        const query =
          selectedType === "all"
            ? ""
            : `?type=${encodeURIComponent(selectedType)}`;
        const response = await fetch(`/api/history${query}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as HistoryResponse;

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Could not load history.");
        }

        if (active) {
          setGenerations(data.generations ?? []);
          setError("");
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Could not load generation history."
          );
          setGenerations([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      active = false;
    };
  }, [selectedType]);

  const copyResponse = async (item: GenerationItem) => {
    await navigator.clipboard.writeText(item.response);
    setCopiedId(item.id);
    window.setTimeout(() => setCopiedId(""), 2200);
  };

  const deleteGeneration = async (id: string) => {
    if (deletingId) return;

    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/api/history/${id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as HistoryResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not delete generation.");
      }

      setGenerations((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not delete generation."
      );
    } finally {
      setDeletingId("");
    }
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
            <SidebarItem active icon={Clock3} label="History" />
            <SidebarItem icon={Bot} label="Automations" />
            <SidebarItem icon={Settings} label="Settings" href="/dashboard/settings" />
          </nav>

          <div className="mt-auto space-y-4">
            <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#F0F9FF] text-[#0EA5E9]">
                <Clock3 size={22} />
              </div>
              <h3 className="mt-5 text-lg font-black tracking-tight text-[#0F172A]">
                Generation History
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review, copy, and remove saved AI outputs from your workspace.
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
                  Search history...
                </span>
                <span className="ml-auto hidden rounded-lg bg-[#F8FAFC] px-2.5 py-1 text-xs font-semibold text-slate-400 sm:inline">
                  {generations.length}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#E2E8F0] bg-white shadow-sm transition hover:border-[#0EA5E9]">
                  <Bell size={20} className="text-[#0F172A]" />
                  <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#0EA5E9] text-[10px] font-bold text-white">
                    {generations.length > 9 ? "9+" : generations.length}
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
                <selectedFilter.icon size={15} />
                {selectedFilter.label} history
              </div>
            </div>

            <section className="mt-5 overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:rounded-[28px]">
              <div className="grid gap-8 p-5 sm:p-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)] xl:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-sm font-semibold text-[#0369A1]">
                    <Clock3 size={15} />
                    Saved generations
                  </div>
                  <h1 className="mt-6 max-w-3xl text-3xl font-black leading-[1.08] tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
                    Generation History
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                    Browse previous outputs, copy useful responses, and keep
                    your saved workspace tidy.
                  </p>
                </div>

                <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <p className="text-sm font-black text-[#0F172A]">
                    Filter by type
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
                    {filters.map((filter) => (
                      <FilterButton
                        key={filter.value}
                        active={selectedType === filter.value}
                        icon={filter.icon}
                        label={filter.label}
                        onClick={() => {
                          setLoading(true);
                          setError("");
                          setSelectedType(filter.value);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {error ? (
              <div className="mt-6 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            ) : null}

            <section className="mt-6">
              {loading ? (
                <LoadingState />
              ) : generations.length > 0 ? (
                <div className="grid gap-5 lg:grid-cols-2">
                  {generations.map((item) => (
                    <HistoryCard
                      key={item.id}
                      item={item}
                      copied={copiedId === item.id}
                      deleting={deletingId === item.id}
                      onCopy={() => copyResponse(item)}
                      onDelete={() => deleteGeneration(item.id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState selectedType={selectedType} />
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function FilterButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border px-3 text-sm font-bold transition",
        active
          ? "border-[#0EA5E9] bg-[#F0F9FF] text-[#0369A1] shadow-[0_10px_24px_rgba(14,165,233,0.12)]"
          : "border-[#E2E8F0] bg-white text-slate-600 hover:border-[#BAE6FD] hover:bg-white",
      ].join(" ")}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function HistoryCard({
  copied,
  deleting,
  item,
  onCopy,
  onDelete,
}: {
  copied: boolean;
  deleting: boolean;
  item: GenerationItem;
  onCopy: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="min-w-0 rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition hover:border-[#BAE6FD] hover:shadow-[0_24px_70px_rgba(14,165,233,0.10)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-xs font-bold text-[#0369A1]">
            <Clock3 size={14} />
            {typeLabels[item.type]}
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {formatDate(item.createdAt)}
          </p>
        </div>

        <div className="flex flex-col gap-2 min-[360px]:flex-row">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white px-3 text-xs font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0369A1] min-[360px]:w-auto"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[14px] border border-red-200 bg-white px-3 text-xs font-bold text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 min-[360px]:w-auto"
          >
            <Trash2 size={15} />
            {deleting ? "Deleting" : "Delete"}
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            Prompt
          </p>
          <p className="mt-2 line-clamp-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
            {item.prompt}
          </p>
        </div>

        <div className="rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            Response
          </p>
          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#0F172A]">
            {item.response}
          </p>
        </div>
      </div>
    </article>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {[0, 1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
        >
          <div className="h-6 w-28 animate-pulse rounded-full bg-[#BAE6FD]" />
          <div className="mt-6 space-y-3">
            <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-3/5 animate-pulse rounded-full bg-slate-200" />
          </div>
          <div className="mt-6 h-28 animate-pulse rounded-[20px] bg-[#F8FAFC]" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ selectedType }: { selectedType: HistoryFilter }) {
  const label = selectedType === "all" ? "generation" : typeLabels[selectedType];

  return (
    <div className="rounded-[28px] border border-dashed border-[#CBD5E1] bg-white p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#F0F9FF] text-[#0EA5E9]">
        <Clock3 size={26} />
      </div>
      <h2 className="mt-5 text-xl font-black text-[#0F172A]">
        No {label.toLowerCase()} history yet
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
        Successful AI outputs will appear here after you generate them from the
        dashboard tools.
      </p>
    </div>
  );
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

function formatDate(value: string) {
  if (!value) {
    return "Saved recently";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
