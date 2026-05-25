"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";

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
  CreditCard,
  Grid2X2,
  Headphones,
  Image as ImageIcon,
  Save,
  Search,
  Settings,
  Upload,
  UserRound,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";

type CurrencyCode = "USD" | "NGN" | "EUR" | "GBP";
type PaymentMethod = "Cash" | "Bank Transfer" | "Credit Card" | "PayPal" | "Crypto";

type SettingsForm = {
  businessLogo: string;
  businessName: string;
  defaultCurrency: CurrencyCode;
  defaultPaymentMethod: PaymentMethod;
  email: string;
  name: string;
};

type MeResponse = {
  success?: boolean;
  user?: {
    businessLogo?: string;
    businessName?: string;
    defaultCurrency?: CurrencyCode;
    defaultPaymentMethod?: PaymentMethod;
    email?: string;
    name?: string;
  };
};

type SettingsResponse = {
  message?: string;
  settings?: Partial<SettingsForm>;
  success?: boolean;
};

const currencies: Array<{ code: CurrencyCode; label: string }> = [
  {
    code: "NGN",
    label: "Naira (NGN)",
  },
  {
    code: "USD",
    label: "Dollar (USD)",
  },
  {
    code: "EUR",
    label: "Euro (EUR)",
  },
  {
    code: "GBP",
    label: "Pound (GBP)",
  },
];

const paymentMethods: PaymentMethod[] = [
  "Bank Transfer",
  "Cash",
  "Credit Card",
  "PayPal",
  "Crypto",
];

const defaultForm: SettingsForm = {
  businessLogo: "",
  businessName: "",
  defaultCurrency: "NGN",
  defaultPaymentMethod: "Bank Transfer",
  email: "",
  name: "",
};

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [logoError, setLogoError] = useState("");

  const profileInitial = useMemo(
    () => (form.name || form.email || "A").trim().slice(0, 1).toUpperCase(),
    [form.email, form.name]
  );

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const [meResponse, settingsResponse] = await Promise.all([
          fetch("/api/auth/me", { cache: "no-store" }),
          fetch("/api/settings", { cache: "no-store" }),
        ]);

        if (!meResponse.ok) {
          throw new Error("Could not load current user.");
        }

        const meData = (await meResponse.json()) as MeResponse;
        const settingsData = settingsResponse.ok
          ? ((await settingsResponse.json()) as SettingsResponse)
          : null;

        const userSettings = {
          ...meData.user,
          ...settingsData?.settings,
        };

        if (active) {
          setForm({
            businessLogo: userSettings.businessLogo ?? "",
            businessName: userSettings.businessName ?? "",
            defaultCurrency: userSettings.defaultCurrency ?? "NGN",
            defaultPaymentMethod:
              userSettings.defaultPaymentMethod ?? "Bank Transfer",
            email: userSettings.email ?? "",
            name: userSettings.name ?? "",
          });
          setError("");
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Could not load settings."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const updateField = <Field extends keyof SettingsForm>(
    field: Field,
    value: SettingsForm[Field]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleLogoInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setLogoError("Upload a PNG, JPG, or WEBP logo.");
      return;
    }

    if (file.size > 700_000) {
      setLogoError("Logo must be under 700KB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      updateField("businessLogo", reader.result);
      setLogoError("");
    };

    reader.onerror = () => {
      setLogoError("Could not read this logo. Try another file.");
    };

    reader.readAsDataURL(file);
  };

  const saveSettings = async () => {
    if (saving) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessLogo: form.businessLogo,
          businessName: form.businessName,
          defaultCurrency: form.defaultCurrency,
          defaultPaymentMethod: form.defaultPaymentMethod,
          name: form.name,
        }),
      });
      const data = (await response.json()) as SettingsResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not save settings.");
      }

      setForm((current) => ({
        ...current,
        ...data.settings,
      }));
      setSuccess("Settings saved successfully.");
      window.dispatchEvent(new Event("aiflow:user-updated"));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not save settings."
      );
    } finally {
      setSaving(false);
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
            <SidebarItem icon={Clock3} label="History" href="/dashboard/history" />
            <SidebarItem icon={Bot} label="Automations" />
            <SidebarItem active icon={Settings} label="Settings" />
          </nav>

          <div className="mt-auto space-y-4">
            <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#F0F9FF] text-[#0EA5E9]">
                <Settings size={22} />
              </div>
              <h3 className="mt-5 text-lg font-black tracking-tight text-[#0F172A]">
                Workspace Settings
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Keep profile, business, and invoice defaults ready for daily
                work.
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
                  Search settings...
                </span>
                <span className="ml-auto hidden rounded-lg bg-[#F8FAFC] px-2.5 py-1 text-xs font-semibold text-slate-400 sm:inline">
                  PROFILE
                </span>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#E2E8F0] bg-white shadow-sm transition hover:border-[#0EA5E9]">
                  <Bell size={20} className="text-[#0F172A]" />
                  <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#0EA5E9] text-[10px] font-bold text-white">
                    1
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
                <Settings size={15} />
                Account preferences
              </div>
            </div>

            <section className="mt-5 overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:rounded-[28px]">
              <div className="grid gap-8 p-5 sm:p-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)] xl:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-sm font-semibold text-[#0369A1]">
                    <UserRound size={15} />
                    Profile and business setup
                  </div>
                  <h1 className="mt-6 max-w-3xl text-3xl font-black leading-[1.08] tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
                    Settings
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                    Update your AIFLOW profile and defaults used across invoice
                    and business workflows.
                  </p>
                </div>

                <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-[#0F172A] text-xl font-black text-white">
                      {form.businessLogo ? (
                        <span
                          aria-label="Business logo preview"
                          className="h-full w-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${form.businessLogo})` }}
                        />
                      ) : (
                        profileInitial
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[#0F172A]">
                        {form.businessName || form.name || "AIFLOW workspace"}
                      </p>
                      <p className="mt-1 truncate text-sm text-slate-500">
                        {form.email || "Account email"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
                    <MiniMetric icon={WalletCards} value={form.defaultCurrency} label="Currency" />
                    <MiniMetric icon={CreditCard} value={form.defaultPaymentMethod} label="Payment" />
                  </div>
                </div>
              </div>
            </section>

            {error ? (
              <div className="mt-6 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="mt-6 rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {success}
              </div>
            ) : null}

            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,0.62fr)]">
              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
                {loading ? (
                  <LoadingState />
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5E9]">
                        Account
                      </p>
                      <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0F172A]">
                        Profile Details
                      </h2>
                    </div>

                    <TextField
                      icon={UserRound}
                      label="Name"
                      onChange={(value) => updateField("name", value)}
                      placeholder="Your name"
                      value={form.name}
                    />

                    <TextField
                      icon={Settings}
                      label="Business name"
                      onChange={(value) => updateField("businessName", value)}
                      placeholder="Your business name"
                      value={form.businessName}
                    />

                    <div className="grid gap-5 md:grid-cols-2">
                      <SelectField
                        icon={WalletCards}
                        label="Default currency"
                        onChange={(value) =>
                          updateField("defaultCurrency", value as CurrencyCode)
                        }
                        options={currencies.map((currency) => ({
                          label: currency.label,
                          value: currency.code,
                        }))}
                        value={form.defaultCurrency}
                      />

                      <SelectField
                        icon={CreditCard}
                        label="Default payment method"
                        onChange={(value) =>
                          updateField(
                            "defaultPaymentMethod",
                            value as PaymentMethod
                          )
                        }
                        options={paymentMethods.map((method) => ({
                          label: method,
                          value: method,
                        }))}
                        value={form.defaultPaymentMethod}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5E9]">
                    Branding
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0F172A]">
                    Business Logo
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Save a small logo for your workspace and invoice defaults.
                  </p>
                </div>

                <div className="mt-6 rounded-[24px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-[24px] bg-white text-[#0EA5E9] shadow-sm">
                    {form.businessLogo ? (
                      <span
                        aria-label="Uploaded logo preview"
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${form.businessLogo})` }}
                      />
                    ) : (
                      <ImageIcon size={32} />
                    )}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <label className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#0F172A] px-4 text-sm font-bold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition hover:bg-[#1E293B]">
                      <Upload size={16} />
                      Upload logo
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={handleLogoInput}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        updateField("businessLogo", "");
                        setLogoError("");
                      }}
                      className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white px-4 text-sm font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF]"
                    >
                      <X size={16} />
                      Remove
                    </button>
                  </div>

                  {logoError ? (
                    <p className="mt-4 text-sm font-semibold text-red-600">
                      {logoError}
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={saveSettings}
                  disabled={loading || saving}
                  className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#0F172A] px-5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Save size={17} />
                      Saving settings
                    </>
                  ) : (
                    <>
                      <Check size={17} />
                      Save settings
                    </>
                  )}
                </button>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function TextField({
  icon: Icon,
  label,
  onChange,
  placeholder,
  value,
}: {
  icon: LucideIcon;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-[#0F172A]">{label}</span>
      <span className="mt-3 flex h-12 items-center gap-3 rounded-[16px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 transition focus-within:border-[#0EA5E9] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#BAE6FD]/50">
        <Icon size={18} className="text-slate-400" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#0F172A] outline-none placeholder:text-slate-400"
        />
      </span>
    </label>
  );
}

function SelectField({
  icon: Icon,
  label,
  onChange,
  options,
  value,
}: {
  icon: LucideIcon;
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-[#0F172A]">{label}</span>
      <span className="mt-3 flex h-12 items-center gap-3 rounded-[16px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 transition focus-within:border-[#0EA5E9] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#BAE6FD]/50">
        <Icon size={18} className="text-slate-400" />
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#0F172A] outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

function LoadingState() {
  return (
    <div className="space-y-5">
      {[0, 1, 2, 3].map((item) => (
        <div key={item}>
          <div className="h-4 w-32 animate-pulse rounded-full bg-[#BAE6FD]" />
          <div className="mt-3 h-12 animate-pulse rounded-[16px] bg-[#F8FAFC]" />
        </div>
      ))}
    </div>
  );
}

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-3">
      <Icon size={16} className="text-[#0EA5E9]" />
      <p className="mt-3 truncate text-sm font-black leading-none text-[#0F172A]">
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
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
