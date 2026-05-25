"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  PackageOpen,
  RefreshCw,
  Send,
  Sparkles,
  Store,
  Tags,
  type LucideIcon,
} from "lucide-react";

const productCategories = [
  "Fashion",
  "Beauty",
  "Food",
  "Tech",
  "Real Estate",
  "Service",
] as const;

const tones = ["Professional", "Friendly", "Luxury", "Sales", "Simple"] as const;

const platforms = ["Instagram", "WhatsApp", "Online Store", "Facebook"] as const;

const exampleProducts = [
  "Luxury perfume",
  "Women's handbag",
  "Skincare cream",
  "Restaurant food package",
] as const;

type ProductCategory = (typeof productCategories)[number];
type Tone = (typeof tones)[number];
type Platform = (typeof platforms)[number];
type CopyState = "all" | "instagram" | string;

const toneInstructions: Record<Tone, string> = {
  Professional: "Use clear, trustworthy ecommerce copy.",
  Friendly: "Use warm, conversational language for everyday customers.",
  Luxury: "Use refined, premium language without sounding exaggerated.",
  Sales: "Make the copy persuasive with a clear buying reason.",
  Simple: "Use plain, direct language that is easy to understand.",
};

const platformInstructions: Record<Platform, string> = {
  Instagram: "Make it caption-ready and visually appealing.",
  WhatsApp: "Make it direct, friendly, and easy to send in chat.",
  "Online Store": "Make it suitable for a product detail page.",
  Facebook: "Make it community-friendly and clear.",
};

export default function ProductDescriptionPage() {
  const [product, setProduct] = useState("");
  const [features, setFeatures] = useState("");
  const [audience, setAudience] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Fashion");
  const [tone, setTone] = useState<Tone>("Professional");
  const [platform, setPlatform] = useState<Platform>("Online Store");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<CopyState>("");
  const [error, setError] = useState("");

  const canGenerate =
    Boolean(product.trim()) &&
    Boolean(features.trim()) &&
    Boolean(audience.trim()) &&
    !loading;

  const descriptionCards = useMemo(
    () => splitDescriptions(description),
    [description]
  );

  const summaryItems = useMemo(
    () => [
      {
        label: "Category",
        value: category,
      },
      {
        label: "Tone",
        value: tone,
      },
      {
        label: "Platform",
        value: platform,
      },
    ],
    [category, platform, tone]
  );

  const generateDescription = async () => {
    if (!canGenerate) return;

    setLoading(true);
    setDescription("");
    setCopied("");
    setError("");

    try {
      const res = await fetch("/api/product-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: buildProductPrompt(product, category, tone, platform),
          features: buildFeaturePrompt(features, seoKeywords),
          audience: buildAudiencePrompt(audience, tone, platform),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.description) {
        throw new Error(
          data.message || "Unable to generate product descriptions."
        );
      }

      setDescription(data.description);
      window.dispatchEvent(new Event("aiflow:generation-saved"));
    } catch (error) {
      console.log(error);
      setError(
        error instanceof Error
          ? error.message
          : "Could not generate product descriptions right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (text: string, id: CopyState) => {
    if (!text) return;

    await navigator.clipboard.writeText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(""), 2200);
  };

  const useForInstagram = async () => {
    if (!description) return;

    await navigator.clipboard.writeText(description);
    setCopied("instagram");
    window.open("https://www.instagram.com/", "_blank");
    window.setTimeout(() => setCopied(""), 2200);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC] px-4 py-6 text-[#0F172A] sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#0EA5E9]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-sm font-semibold text-[#0369A1]">
            <Sparkles size={15} />
            Product studio
          </div>
        </div>

        <section className="mt-5 overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:rounded-[28px]">
          <div className="grid gap-8 p-5 sm:p-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)] xl:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-sm font-semibold text-[#0369A1]">
                <Store size={15} />
                Ecommerce copywriting
              </div>
              <h1 className="mt-6 max-w-3xl text-3xl font-black leading-[1.08] tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
                AI Product Description Generator
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Create high-converting product descriptions for online stores,
                WhatsApp, and Instagram.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#F0F9FF] text-[#0EA5E9]">
                  <Tags size={23} />
                </div>
                <div>
                  <p className="text-sm font-black text-[#0F172A]">
                    {category} product copy
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {tone} tone for {platform}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                {summaryItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[16px] border border-[#E2E8F0] bg-white p-3"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 truncate text-sm font-black text-[#0F172A]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)]">
          <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5E9]">
                Product input
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0F172A]">
                Description Details
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add the product basics, choose a sales angle, and generate copy
                for your selling channel.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <InputField
                label="Product name"
                value={product}
                onChange={setProduct}
                placeholder="Example: Luxury perfume"
              />

              <TextareaField
                label="Product features"
                value={features}
                onChange={setFeatures}
                placeholder="Product features e.g soft fabric, long lasting, affordable..."
              />

              <InputField
                label="Target audience"
                value={audience}
                onChange={setAudience}
                placeholder="Target audience e.g women, students, business owners"
              />
            </div>

            <ChipGroup
              label="Product category"
              options={productCategories}
              value={category}
              onChange={setCategory}
            />

            <ChipGroup label="Tone" options={tones} value={tone} onChange={setTone} />

            <ChipGroup
              label="Platform"
              options={platforms}
              value={platform}
              onChange={setPlatform}
            />

            <div className="mt-7">
              <InputField
                label="SEO keywords"
                optional
                value={seoKeywords}
                onChange={setSeoKeywords}
                placeholder="Example: long-lasting perfume, affordable handbag"
              />
            </div>

            <div className="mt-7">
              <p className="text-sm font-bold text-[#0F172A]">
                Example products
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {exampleProducts.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setProduct(item)}
                    className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0369A1]"
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
              onClick={generateDescription}
              disabled={!canGenerate}
              className="mt-7 inline-flex h-[52px] w-full items-center justify-center gap-3 rounded-[18px] bg-[#0EA5E9] px-6 text-sm font-black text-white shadow-[0_18px_36px_rgba(14,165,233,0.25)] transition hover:bg-[#0284C7] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto"
            >
              {loading ? (
                <>
                  <LoadingDot />
                  Generating Description
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Description
                </>
              )}
            </button>
          </div>

          <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5E9]">
                  Description preview
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0F172A]">
                  Generated Descriptions
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <ActionButton
                  disabled={!description || loading}
                  icon={copied === "all" ? Check : Copy}
                  label={copied === "all" ? "Copied" : "Copy"}
                  onClick={() => copyText(description, "all")}
                />
                <ActionButton
                  disabled={!canGenerate}
                  icon={RefreshCw}
                  label="Regenerate"
                  onClick={generateDescription}
                />
                <ActionButton
                  disabled={!description || loading}
                  icon={copied === "instagram" ? Check : Send}
                  label={
                    copied === "instagram" ? "Ready" : "Use for Instagram"
                  }
                  onClick={useForInstagram}
                />
              </div>
            </div>

            <div className="mt-6 min-h-[430px] rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-5">
              {loading ? (
                <LoadingPreview />
              ) : descriptionCards.length > 0 ? (
                <div className="space-y-4">
                  {descriptionCards.map((item, index) => (
                    <DescriptionCard
                      key={`${item.slice(0, 18)}-${index}`}
                      copied={copied === `card-${index}`}
                      description={item}
                      index={index}
                      platform={platform}
                      onCopy={() => copyText(item, `card-${index}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[380px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#CBD5E1] bg-white px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#F0F9FF] text-[#0EA5E9]">
                    <PackageOpen size={26} />
                  </div>
                  <p className="mt-5 text-lg font-black text-[#0F172A]">
                    Your product descriptions will appear here.
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Add product details to create polished descriptions for
                    your chosen platform.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InputField({
  label,
  onChange,
  optional = false,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  optional?: boolean;
  placeholder: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-bold text-[#0F172A]">{label}</label>
        {optional ? (
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            Optional
          </span>
        ) : null}
      </div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-3 h-12 w-full rounded-[18px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-[#BAE6FD]/50"
      />
    </div>
  );
}

function TextareaField({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-[#0F172A]">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-3 min-h-[140px] w-full resize-none rounded-[20px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-4 text-sm font-semibold leading-6 text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-[#BAE6FD]/50"
      />
    </div>
  );
}

function ChipGroup<T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: T) => void;
  options: readonly T[];
  value: T;
}) {
  return (
    <div className="mt-7">
      <p className="text-sm font-bold text-[#0F172A]">{label}</p>
      <div className="mt-3 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:flex sm:flex-wrap">
        {options.map((item) => {
          const active = item === value;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              className={[
                "rounded-full border px-4 py-2 text-sm font-bold transition sm:w-auto",
                active
                  ? "border-[#0EA5E9] bg-[#F0F9FF] text-[#0369A1] shadow-[0_10px_24px_rgba(14,165,233,0.12)]"
                  : "border-[#E2E8F0] bg-white text-slate-600 hover:border-[#BAE6FD] hover:bg-[#F8FAFC]",
              ].join(" ")}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ActionButton({
  disabled,
  icon: Icon,
  label,
  onClick,
}: {
  disabled: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white px-3 text-sm font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0369A1] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function DescriptionCard({
  copied,
  description,
  index,
  onCopy,
  platform,
}: {
  copied: boolean;
  description: string;
  index: number;
  onCopy: () => void;
  platform: Platform;
}) {
  return (
    <article className="rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#F0F9FF] text-[#0EA5E9]">
            <Sparkles size={21} />
          </div>
          <div>
            <p className="text-sm font-black text-[#0F172A]">
              Description {index + 1}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {platform} ready
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCopy}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white px-3 text-sm font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0369A1]"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-slate-700">
        {description}
      </p>
    </article>
  );
}

function LoadingPreview() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] sm:p-6"
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 animate-pulse rounded-[16px] bg-[#F0F9FF]" />
            <div className="space-y-2">
              <div className="h-3 w-36 animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-24 animate-pulse rounded-full bg-slate-100" />
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-11/12 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-3/5 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingDot() {
  return (
    <span className="relative flex h-4 w-4">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#BAE6FD] opacity-75" />
      <span className="relative inline-flex h-4 w-4 rounded-full bg-white" />
    </span>
  );
}

function splitDescriptions(description: string) {
  return description
    .split(/\n{2,}|\n(?=\d+[.)]\s)|\n(?=-\s)/)
    .map((item) => item.replace(/^\s*(?:\d+[.)]|[-*])\s*/, "").trim())
    .filter(Boolean);
}

function buildProductPrompt(
  product: string,
  category: ProductCategory,
  tone: Tone,
  platform: Platform
) {
  return [
    product.trim(),
    `Category: ${category}`,
    `Tone: ${tone}`,
    `Platform: ${platform}`,
    toneInstructions[tone],
    platformInstructions[platform],
  ].join("\n");
}

function buildFeaturePrompt(features: string, seoKeywords: string) {
  return [
    features.trim(),
    seoKeywords.trim() ? `SEO keywords to include naturally: ${seoKeywords.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildAudiencePrompt(audience: string, tone: Tone, platform: Platform) {
  return [
    audience.trim(),
    `Write for this audience using a ${tone.toLowerCase()} tone.`,
    platformInstructions[platform],
  ].join("\n");
}
