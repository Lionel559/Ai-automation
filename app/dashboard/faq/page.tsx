"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bot,
  Check,
  Copy,
  MessageCircle,
  RefreshCw,
  Send,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const businessTypes = [
  "Store",
  "Restaurant",
  "Beauty",
  "Real Estate",
  "Service Business",
] as const;

const answerStyles = ["Short", "Friendly", "Professional", "Detailed"] as const;

const exampleQuestions = [
  "Do you deliver?",
  "What is your price?",
  "Are you open today?",
  "Can I pay on delivery?",
] as const;

type BusinessType = (typeof businessTypes)[number];
type AnswerStyle = (typeof answerStyles)[number];
type CopyState = "answer" | "whatsapp" | "";

const styleInstructions: Record<AnswerStyle, string> = {
  Short: "Keep the answer to one or two short sentences.",
  Friendly: "Use a warm, helpful tone that feels natural on WhatsApp.",
  Professional: "Use a polished, clear tone suitable for customer support.",
  Detailed: "Give a fuller answer with helpful details while staying concise.",
};

const responseLength: Record<AnswerStyle, string> = {
  Short: "1-2 sentences",
  Friendly: "2-3 sentences",
  Professional: "2-3 sentences",
  Detailed: "4-6 sentences",
};

export default function FAQPage() {
  const [business, setBusiness] = useState("");
  const [question, setQuestion] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("Store");
  const [answerStyle, setAnswerStyle] =
    useState<AnswerStyle>("Professional");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<CopyState>("");
  const [error, setError] = useState("");

  const canGenerate =
    Boolean(business.trim()) && Boolean(question.trim()) && !loading;

  const previewItems = useMemo(
    () => [
      {
        label: "Business type",
        value: businessType,
      },
      {
        label: "Answer style",
        value: answerStyle,
      },
      {
        label: "Estimated length",
        value: responseLength[answerStyle],
      },
    ],
    [answerStyle, businessType]
  );

  const generateAnswer = async () => {
    if (!canGenerate) return;

    setLoading(true);
    setAnswer("");
    setCopied("");
    setError("");

    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business: buildBusinessContext(business, businessType, answerStyle),
          question: buildQuestionPrompt(question, answerStyle),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.answer) {
        throw new Error(data.message || "Unable to generate FAQ answer.");
      }

      setAnswer(data.answer);
      window.dispatchEvent(new Event("aiflow:generation-saved"));
    } catch (error) {
      console.log(error);
      setError(
        error instanceof Error
          ? error.message
          : "Could not generate an answer right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyAnswer = async (mode: CopyState = "answer") => {
    if (!answer) return;

    await navigator.clipboard.writeText(answer);
    setCopied(mode);
    window.setTimeout(() => setCopied(""), 2200);
  };

  const openWhatsAppReply = async () => {
    if (!answer) return;

    await navigator.clipboard.writeText(answer);
    setCopied("whatsapp");
    window.open(`https://wa.me/?text=${encodeURIComponent(answer)}`, "_blank");
    window.setTimeout(() => setCopied(""), 2200);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 text-[#0F172A] sm:px-6 lg:px-10">
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
            FAQ studio
          </div>
        </div>

        <section className="mt-5 overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_380px] xl:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-sm font-semibold text-[#0369A1]">
                <Bot size={15} />
                AI knowledge assistant
              </div>
              <h1 className="mt-6 max-w-3xl text-3xl font-black leading-[1.08] tracking-tight text-[#0F172A] sm:text-5xl">
                AI FAQ Assistant
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Generate helpful customer answers from your business
                information.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#F0F9FF] text-[#0EA5E9]">
                  <MessageCircle size={23} />
                </div>
                <div>
                  <p className="text-sm font-black text-[#0F172A]">
                    {businessType} support
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {answerStyle} replies selected
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                {previewItems.map((item) => (
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

        <section className="mt-6 grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(420px,1fr)]">
          <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5E9]">
                Business input
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0F172A]">
                Customer Question Details
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add the facts your assistant should use, then choose the tone
                and question type.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <TextareaField
                label="Business information"
                value={business}
                onChange={setBusiness}
                placeholder="Describe your business, products, prices, delivery policy, opening hours..."
                minHeight="min-h-[170px]"
              />

              <TextareaField
                label="Customer question"
                value={question}
                onChange={setQuestion}
                placeholder="Example: Do you deliver to Lagos?"
                minHeight="min-h-[120px]"
              />
            </div>

            <ChipGroup
              label="Business type"
              options={businessTypes}
              value={businessType}
              onChange={setBusinessType}
            />

            <ChipGroup
              label="Answer style"
              options={answerStyles}
              value={answerStyle}
              onChange={setAnswerStyle}
            />

            <div className="mt-7">
              <p className="text-sm font-bold text-[#0F172A]">
                Example questions
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {exampleQuestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuestion(item)}
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
              onClick={generateAnswer}
              disabled={!canGenerate}
              className="mt-7 inline-flex h-[52px] w-full items-center justify-center gap-3 rounded-[18px] bg-[#0EA5E9] px-6 text-sm font-black text-white shadow-[0_18px_36px_rgba(14,165,233,0.25)] transition hover:bg-[#0284C7] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto"
            >
              {loading ? (
                <>
                  <LoadingDot />
                  Generating Answer
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Answer
                </>
              )}
            </button>
          </div>

          <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5E9]">
                  Answer preview
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0F172A]">
                  Generated Answer
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <ActionButton
                  disabled={!answer || loading}
                  icon={copied === "answer" ? Check : Copy}
                  label={copied === "answer" ? "Copied" : "Copy"}
                  onClick={() => copyAnswer("answer")}
                />
                <ActionButton
                  disabled={!canGenerate}
                  icon={RefreshCw}
                  label="Regenerate"
                  onClick={generateAnswer}
                />
              </div>
            </div>

            <div className="mt-6 min-h-[390px] rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-5">
              {loading ? (
                <LoadingPreview />
              ) : answer ? (
                <div className="flex min-h-[340px] flex-col justify-between rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] sm:p-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#F0F9FF] text-[#0EA5E9]">
                        <Bot size={21} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#0F172A]">
                          Customer-ready reply
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {businessType} / {answerStyle}
                        </p>
                      </div>
                    </div>

                    <p className="mt-6 whitespace-pre-wrap text-base leading-8 text-slate-700">
                      {answer}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openWhatsAppReply}
                    className="mt-8 inline-flex h-12 w-full items-center justify-center gap-3 rounded-[16px] border border-[#BAE6FD] bg-[#F0F9FF] px-4 text-sm font-black text-[#0369A1] transition hover:border-[#0EA5E9] hover:bg-white sm:w-fit"
                  >
                    {copied === "whatsapp" ? (
                      <Check size={17} />
                    ) : (
                      <Send size={17} />
                    )}
                    {copied === "whatsapp"
                      ? "Ready for WhatsApp"
                      : "Use as WhatsApp reply"}
                  </button>
                </div>
              ) : (
                <div className="flex min-h-[340px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#CBD5E1] bg-white px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#F0F9FF] text-[#0EA5E9]">
                    <MessageCircle size={26} />
                  </div>
                  <p className="mt-5 text-lg font-black text-[#0F172A]">
                    Your FAQ answer will appear here.
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Add business information and a customer question to create
                    a polished support reply.
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

function TextareaField({
  label,
  minHeight,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  minHeight: string;
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
        className={[
          "mt-3 w-full resize-none rounded-[20px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-4 text-sm font-semibold leading-6 text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-[#BAE6FD]/50",
          minHeight,
        ].join(" ")}
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
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((item) => {
          const active = item === value;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              className={[
                "rounded-full border px-4 py-2 text-sm font-bold transition",
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
      className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white px-3 text-sm font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0369A1] disabled:cursor-not-allowed disabled:opacity-45"
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function LoadingPreview() {
  return (
    <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] sm:p-6">
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
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-100" />
      </div>
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

function buildBusinessContext(
  business: string,
  businessType: BusinessType,
  answerStyle: AnswerStyle
) {
  return [
    `Business type: ${businessType}`,
    `Preferred answer style: ${answerStyle}`,
    `Style instruction: ${styleInstructions[answerStyle]}`,
    "",
    business.trim(),
  ].join("\n");
}

function buildQuestionPrompt(question: string, answerStyle: AnswerStyle) {
  return [
    question.trim(),
    "",
    `Please answer in a ${answerStyle.toLowerCase()} style.`,
    styleInstructions[answerStyle],
  ].join("\n");
}
