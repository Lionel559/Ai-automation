"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import {
  Bot,
  Clock3,
  Crown,
  FileText,
  Grid2X2,
  Headphones,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";

import {
  DashboardUsageSummary,
  useDashboardAuth,
} from "@/components/auth/dashboard-auth";

type DashboardFrameProps = {
  children: ReactNode;
};

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    icon: Grid2X2,
    label: "Dashboard",
  },
  {
    href: "/dashboard/history",
    icon: Clock3,
    label: "History",
  },
  {
    href: "/dashboard/caption",
    icon: Sparkles,
    label: "Captions",
  },
  {
    href: "/dashboard/reply",
    icon: MessageSquare,
    label: "Replies",
  },
  {
    href: "/dashboard/invoice",
    icon: FileText,
    label: "Invoices",
  },
  {
    href: "/dashboard/faq",
    icon: Bot,
    label: "FAQ",
  },
  {
    href: "/dashboard/product-description",
    icon: Package,
    label: "Products",
  },
  {
    href: "/dashboard/settings",
    icon: Settings,
    label: "Settings",
  },
];

export function DashboardFrame({ children }: DashboardFrameProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#0F172A]">
      <div className="flex min-h-screen min-w-0">
        <DashboardSidebar pathname={pathname} />

        <div className="min-w-0 flex-1">
          <MobileTopbar onOpenMenu={() => setMobileMenuOpen(true)} />

          <div className="min-w-0 [&_aside]:hidden [&_main]:min-w-0 [&_section]:min-w-0">
            {children}
          </div>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-[#0F172A]/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex h-full w-[min(88vw,320px)] flex-col bg-white px-4 py-6 shadow-[24px_0_80px_rgba(15,23,42,0.22)]">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/"
                className="flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <AiflowLogo />
              </Link>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mt-8 space-y-2">
              {navItems.map((item) => (
                <DashboardNavItem
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </nav>

            <div className="mt-auto space-y-3">
              <div className="rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-sm font-black text-[#0F172A]">Free Plan</p>
                <div className="mt-4">
                  <DashboardUsageSummary />
                </div>
              </div>

              <DashboardLogoutButton />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DashboardSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden w-[292px] shrink-0 border-r border-[#E2E8F0] bg-white px-5 py-6 shadow-[18px_0_60px_rgba(15,23,42,0.04)] lg:flex lg:flex-col">
      <Link href="/" className="flex items-center gap-3">
        <AiflowLogo />
      </Link>

      <nav className="mt-10 space-y-2">
        {navItems.map((item) => (
          <DashboardNavItem key={item.href} item={item} pathname={pathname} />
        ))}
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

        <DashboardLogoutButton />
      </div>
    </aside>
  );
}

function DashboardLogoutButton() {
  const { loggingOut, logout } = useDashboardAuth();

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loggingOut}
      className="flex w-full min-w-0 items-center gap-4 rounded-[16px] border border-transparent px-4 py-3 text-sm font-bold text-slate-500 transition hover:border-[#FECACA] hover:bg-[#FEF2F2] hover:text-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut size={20} className="shrink-0" />
      <span className="truncate">
        {loggingOut ? "Logging out..." : "Logout"}
      </span>
    </button>
  );
}

function MobileTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6 lg:hidden">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <AiflowLogo compact />
        </Link>
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={onOpenMenu}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF]"
        >
          <Menu size={21} />
        </button>
      </div>
    </header>
  );
}

function DashboardNavItem({
  item,
  onClick,
  pathname,
}: {
  item: NavItem;
  onClick?: () => void;
  pathname: string;
}) {
  const Icon = item.icon;
  const active =
    item.href === "/dashboard"
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={[
        "flex min-w-0 items-center gap-4 rounded-[16px] px-4 py-3 text-sm font-bold transition",
        active
          ? "border border-[#BAE6FD] bg-[#F0F9FF] text-[#0F172A]"
          : "text-slate-500 hover:bg-[#F8FAFC] hover:text-[#0F172A]",
      ].join(" ")}
    >
      <Icon
        size={20}
        className={active ? "shrink-0 text-[#0EA5E9]" : "shrink-0"}
      />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function AiflowLogo({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#0F172A] text-lg font-black text-white shadow-[0_12px_30px_rgba(15,23,42,0.22)]">
        A
      </div>
      <div className="min-w-0">
        <p className="truncate text-xl font-black leading-none tracking-tight text-[#0F172A]">
          AIFLOW
        </p>
        {!compact ? (
          <p className="mt-1 truncate text-xs font-medium text-slate-500">
            AI automation SaaS
          </p>
        ) : null}
      </div>
    </>
  );
}
