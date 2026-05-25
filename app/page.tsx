import Link from "next/link";

import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Package,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";

const features = [
  {
    title: "Create faster",
    description:
      "Generate business-ready captions, replies, invoices, FAQs, and product copy in seconds.",
    icon: Zap,
  },
  {
    title: "Stay organized",
    description:
      "Keep every automation in one clean workspace built for daily small business work.",
    icon: LayoutDashboard,
  },
  {
    title: "Work confidently",
    description:
      "Use focused AI tools designed for clear output, practical workflows, and reliable results.",
    icon: ShieldCheck,
  },
];

const tools = [
  {
    title: "AI Caption Generator",
    description: "Write social captions for Instagram, WhatsApp, and more.",
    href: "/dashboard/caption",
    icon: Sparkles,
  },
  {
    title: "Customer Reply Assistant",
    description: "Create helpful customer responses without starting from scratch.",
    href: "/dashboard/reply",
    icon: MessageSquare,
  },
  {
    title: "Invoice Generator",
    description: "Prepare clean invoices quickly for customers and clients.",
    href: "/dashboard/invoice",
    icon: FileText,
  },
  {
    title: "FAQ Assistant",
    description: "Turn common customer questions into polished answers.",
    href: "/dashboard/faq",
    icon: Bot,
  },
  {
    title: "Product Description Generator",
    description: "Write clear product copy for stores and online catalogs.",
    href: "/dashboard/product-description",
    icon: Package,
  },
];

const steps = [
  {
    title: "Choose a workflow",
    description: "Pick the task you want to complete from your AIFLOW dashboard.",
  },
  {
    title: "Add your details",
    description: "Enter the product, customer message, invoice details, or FAQ topic.",
  },
  {
    title: "Generate and use",
    description: "Review the AI output, copy it, and keep your business moving.",
  },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    description: "For trying AIFLOW with core automation tools.",
    features: ["5 AI tools", "10 daily generations", "Dashboard access"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    description: "For owners who rely on AI every week.",
    features: ["Unlimited generations", "Priority tools", "Export-ready outputs"],
    highlighted: true,
  },
  {
    name: "Business",
    price: "$49",
    description: "For growing teams with more customer work.",
    features: ["Team workspace", "Advanced automations", "Priority support"],
    highlighted: false,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />

      <section className="px-4 py-6 sm:px-6 lg:px-10 lg:pb-20 lg:pt-16">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-10">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-sm font-semibold text-[#0369A1]">
              <Sparkles size={15} />
              AI automation SaaS for small business
            </div>

            <h1 className="mt-6 max-w-4xl text-3xl font-black leading-[1.08] text-[#0F172A] sm:text-5xl lg:text-6xl">
              AI automation for small business
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              AIFLOW gives business owners one clean workspace for captions,
              customer replies, invoices, FAQs, product descriptions, and daily
              content work.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#0F172A] px-6 text-sm font-bold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition hover:bg-[#1E293B] sm:w-auto"
              >
                Start free
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/register"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white px-6 text-sm font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] sm:w-auto"
              >
                Get Started Free
                <LayoutDashboard size={17} className="text-[#0EA5E9]" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <MiniStat value="5" label="AI tools" />
              <MiniStat value="10" label="free daily runs" />
              <MiniStat value="1" label="calm workspace" />
            </div>
          </div>

          <DashboardPreview />
        </div>
      </section>

      <section id="features" className="px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Features"
            title="Built for practical business work"
            description="AIFLOW keeps the interface simple, the outputs useful, and the workflow fast enough for busy operators."
          />

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section id="tools" className="px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeader
                eyebrow="Automation tools"
                title="Start with the tasks you already do"
                description="Choose a focused tool, add a few details, and generate polished business content."
              />
              <Link
                href="/register"
                className="inline-flex h-11 w-full items-center justify-center rounded-[14px] border border-[#CBD5E1] bg-white px-5 text-sm font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] sm:w-auto"
              >
                Get Started Free
              </Link>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.title} {...tool} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="How it works"
            title="From idea to finished output in minutes"
            description="AIFLOW removes the blank page and gives each business task a clear path."
          />

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <StepCard key={step.title} index={index + 1} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Pricing"
            title="Simple plans for growing businesses"
            description="Start free, then upgrade when AIFLOW becomes part of your daily workflow."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {pricing.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-sm font-semibold text-[#0369A1]">
                <Target size={15} />
                Ready when you are
              </div>
              <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight text-[#0F172A] sm:text-4xl">
                Give your business a faster way to create, reply, and organize.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Launch your AIFLOW workspace and start turning routine tasks
                into repeatable AI-powered workflows.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/register"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#0F172A] px-6 text-sm font-bold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition hover:bg-[#1E293B] sm:w-auto lg:w-full"
              >
                Create account
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 w-full items-center justify-center rounded-[14px] border border-[#CBD5E1] bg-white px-6 text-sm font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] sm:w-auto lg:w-full"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <AiflowLogo />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-[#0EA5E9]">
            Features
          </a>
          <a href="#tools" className="transition hover:text-[#0EA5E9]">
            Tools
          </a>
          <a href="#how-it-works" className="transition hover:text-[#0EA5E9]">
            How it works
          </a>
          <a href="#pricing" className="transition hover:text-[#0EA5E9]">
            Pricing
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden h-10 items-center justify-center rounded-[14px] px-4 text-sm font-bold text-[#0F172A] transition hover:bg-[#F0F9FF] sm:inline-flex"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="inline-flex h-10 items-center justify-center rounded-[14px] bg-[#0F172A] px-4 text-sm font-bold text-white shadow-[0_10px_20px_rgba(15,23,42,0.16)] transition hover:bg-[#1E293B]"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}

function AiflowLogo() {
  return (
    <>
      <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#0F172A] text-lg font-black text-white shadow-[0_12px_30px_rgba(15,23,42,0.22)]">
        A
      </div>
      <div>
        <p className="text-xl font-black leading-none text-[#0F172A]">
          AIFLOW
        </p>
        <p className="mt-1 hidden text-xs font-medium text-slate-500 sm:block">
          AI automation SaaS
        </p>
      </div>
    </>
  );
}

function DashboardPreview() {
  return (
    <div className="min-w-0 rounded-[24px] border border-[#E2E8F0] bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:rounded-[28px] sm:p-4">
      <div className="rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#0F172A] text-sm font-black text-white">
              A
            </div>
            <div>
              <p className="text-sm font-black text-[#0F172A]">
                AIFLOW Dashboard
              </p>
              <p className="text-xs font-medium text-slate-500">
                Today&apos;s workspace
              </p>
            </div>
          </div>
          <div className="rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-xs font-bold text-[#0369A1]">
            Live
          </div>
        </div>

        <div className="mt-5 rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-xs font-bold text-[#0369A1]">
            <Sparkles size={14} />
            AIFLOW workspace
          </div>
          <h3 className="mt-4 text-xl font-black leading-tight text-[#0F172A] sm:text-2xl">
            Create your next business asset
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Captions, replies, invoices, FAQs, and product descriptions are
            ready from one clean dashboard.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <PreviewMetric icon={Package} value="5" label="Tools" />
            <PreviewMetric icon={Clock3} value="10" label="Runs left" />
            <PreviewMetric icon={CheckCircle2} value="Free" label="Plan" />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {tools.slice(0, 4).map((tool) => {
            const Icon = tool.icon;

            return (
              <div
                key={tool.title}
                className="rounded-[18px] border border-[#E2E8F0] bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#F0F9FF] text-[#0EA5E9]">
                    <Icon size={19} />
                  </div>
                  <p className="text-sm font-black leading-5 text-[#0F172A]">
                    {tool.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PreviewMetric({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
      <Icon size={18} className="text-[#0EA5E9]" />
      <p className="mt-3 text-lg font-black leading-none text-[#0F172A]">
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[18px] border border-[#E2E8F0] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <p className="text-2xl font-black leading-none text-[#0F172A]">
        {value}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase text-[#0EA5E9]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black leading-tight text-[#0F172A] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#F0F9FF] text-[#0EA5E9]">
        <Icon size={23} />
      </div>
      <h3 className="mt-5 text-lg font-black text-[#0F172A]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
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
    <Link
      href={href}
      className="group rounded-[22px] border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-[#BAE6FD] hover:shadow-[0_24px_70px_rgba(14,165,233,0.12)]"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#F0F9FF] text-[#0EA5E9] transition group-hover:bg-[#0EA5E9] group-hover:text-white">
          <Icon size={22} />
        </div>
        <div>
          <h3 className="text-base font-black leading-6 text-[#0F172A]">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

function StepCard({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#0F172A] text-sm font-black text-white">
        {index}
      </div>
      <h3 className="mt-5 text-lg font-black text-[#0F172A]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  description,
  features,
  highlighted,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted: boolean;
}) {
  return (
    <div
      className={[
        "rounded-[24px] border bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]",
        highlighted ? "border-[#0EA5E9]" : "border-[#E2E8F0]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-black text-[#0F172A]">{name}</h3>
        {highlighted ? (
          <span className="rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-xs font-bold text-[#0369A1]">
            Popular
          </span>
        ) : null}
      </div>
      <p className="mt-5 text-4xl font-black text-[#0F172A]">
        {price}
        <span className="text-base font-bold text-slate-500"> / month</span>
      </p>
      <p className="mt-4 text-sm leading-6 text-slate-500">{description}</p>

      <div className="mt-6 space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-[#0EA5E9]" />
            <span className="text-sm font-semibold text-slate-600">
              {feature}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/register"
        className={[
          "mt-7 inline-flex h-11 w-full items-center justify-center rounded-[14px] text-sm font-bold transition",
          highlighted
            ? "bg-[#0F172A] text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] hover:bg-[#1E293B]"
            : "border border-[#CBD5E1] bg-white text-[#0F172A] shadow-sm hover:border-[#0EA5E9] hover:bg-[#F0F9FF]",
        ].join(" ")}
      >
        Get started
      </Link>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <AiflowLogo />
        </Link>
        <p className="text-sm font-medium text-slate-500">
          Built for small business owners who want calmer AI workflows.
        </p>
      </div>
    </footer>
  );
}
