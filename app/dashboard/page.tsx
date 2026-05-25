import Link from "next/link";

import {
  ArrowRight,
  Bell,
  Bot,
  Crown,
  FileText,
  Grid2X2,
  Headphones,
  MessageSquare,
  Package,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";

const automations = [
  {
    title: "AI Caption Generator",
    icon: Sparkles,
    description: "Create engaging captions for Instagram, WhatsApp and more.",
    href: "/dashboard/caption",
  },
  {
    title: "Customer Reply Assistant",
    icon: MessageSquare,
    description: "Generate professional replies for customers in seconds.",
    href: "/dashboard/reply",
  },
  {
    title: "Invoice Generator",
    icon: FileText,
    description: "Create and download professional invoices instantly.",
    href: "/dashboard/invoice",
  },
  {
    title: "FAQ Assistant",
    icon: Bot,
    description: "Answer customer questions automatically using AI.",
    href: "/dashboard/faq",
  },
  {
    title: "Product Description Generator",
    icon: Package,
    description: "Write high-converting product descriptions for stores.",
    href: "/dashboard/product-description",
  },
];

const stats = [
  {
    label: "Active Tools",
    value: "5",
    helper: "Ready to use",
    icon: Package,
  },
  {
    label: "Daily Generations",
    value: "10 / 10",
    helper: "Resets daily",
    icon: Sparkles,
  },
  {
    label: "Current Plan",
    value: "Free",
    helper: "Upgrade for more",
    icon: Crown,
  },
];

const highlights = [
  {
    title: "Save time",
    body: "Automate repetitive tasks",
    icon: Zap,
  },
  {
    title: "Increase productivity",
    body: "Focus on what matters",
    icon: Target,
  },
  {
    title: "Secure and private",
    body: "Your data stays protected",
    icon: ShieldCheck,
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[292px] shrink-0 border-r border-[#E2E8F0] bg-white px-5 py-6 shadow-[18px_0_60px_rgba(15,23,42,0.04)] lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-3">
            <AiflowLogo />
          </Link>

          <nav className="mt-10 space-y-2">
            <SidebarItem active icon={Grid2X2} label="Dashboard" />
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
                You are using the Free Plan.
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

              <button className="mt-6 w-full rounded-[14px] bg-[#0F172A] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition hover:bg-[#1E293B]">
                Upgrade Plan
              </button>
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

            <section className="mt-6 overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_360px] xl:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-sm font-semibold text-[#0369A1]">
                    <Sparkles size={15} />
                    AIFLOW workspace
                  </div>
                  <h1 className="mt-6 max-w-3xl text-3xl font-black leading-[1.08] tracking-tight text-[#0F172A] sm:text-5xl">
                    Welcome back, Amao.
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                    Create, automate, and grow your business from one calm AI
                    workspace built for small business owners.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <button className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#0F172A] px-5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition hover:bg-[#1E293B]">
                      Upgrade Plan
                      <ArrowRight size={17} />
                    </button>
                    <Link
                      href="/dashboard/caption"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white px-5 text-sm font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF]"
                    >
                      Start creating
                      <Sparkles size={17} className="text-[#0EA5E9]" />
                    </Link>
                  </div>
                </div>

                <div className="grid gap-3">
                  {highlights.map((item) => (
                    <HighlightCard key={item.title} {...item} />
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-3">
              {stats.map((item) => (
                <StatCard key={item.label} {...item} />
              ))}
            </section>

            <section className="mt-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5E9]">
                    Tools
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0F172A]">
                    Automation Tools
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Choose a workflow and start creating in seconds.
                  </p>
                </div>

                <button className="hidden h-11 items-center justify-center rounded-[14px] border border-[#E2E8F0] bg-white px-5 text-sm font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] sm:inline-flex">
                  View all tools
                </button>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {automations.map((item) => (
                  <ToolCard key={item.title} {...item} />
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
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
  icon: Icon,
  label,
}: {
  active?: boolean;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div
      className={[
        "flex items-center gap-4 rounded-[16px] px-4 py-3 text-sm font-bold transition",
        active
          ? "border border-[#BAE6FD] bg-[#F0F9FF] text-[#0F172A]"
          : "text-slate-500 hover:bg-[#F8FAFC] hover:text-[#0F172A]",
      ].join(" ")}
    >
      <Icon size={20} className={active ? "text-[#0EA5E9]" : ""} />
      {label}
    </div>
  );
}

function HighlightCard({
  title,
  body,
  icon: Icon,
}: {
  title: string;
  body: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#F0F9FF] text-[#0EA5E9]">
        <Icon size={21} />
      </div>
      <div>
        <h3 className="text-sm font-black text-[#0F172A]">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{body}</p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#F0F9FF] text-[#0EA5E9]">
          <Icon size={23} />
        </div>
        <div>
          <p className="text-2xl font-black leading-none text-[#0F172A]">
            {value}
          </p>
          <p className="mt-2 text-sm font-bold text-[#0F172A]">{label}</p>
          <p className="mt-1 text-sm text-slate-500">{helper}</p>
        </div>
      </div>
    </div>
  );
}

function ToolCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}) {
  return (
    <div className="group rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#BAE6FD] hover:shadow-[0_24px_70px_rgba(14,165,233,0.12)]">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[#F0F9FF] text-[#0EA5E9] transition group-hover:bg-[#0EA5E9] group-hover:text-white">
          <Icon size={25} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-black leading-6 text-[#0F172A]">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <Link
        href={href}
        className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white text-sm font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0369A1]"
      >
        Open Tool
        <ArrowRight size={17} className="text-[#0EA5E9]" />
      </Link>
    </div>
  );
}
