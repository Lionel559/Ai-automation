"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { toPng } from "html-to-image";

import { DashboardUserMenu } from "@/components/auth/dashboard-auth";

import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  CloudUpload,
  Copy,
  Download,
  FileText,
  Plus,
  ReceiptText,
  Search,
  Sparkles,
  Trash2,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";

type InvoiceStatus = "Paid" | "Pending" | "Draft";
type PaymentMethod = "Cash" | "Bank Transfer" | "Credit Card" | "PayPal" | "Crypto";
type CurrencyCode = "USD" | "NGN" | "EUR" | "GBP";

type CurrencyOption = {
  code: CurrencyCode;
  label: string;
  symbol: string;
};

type LineItem = {
  id: string;
  name: string;
  quantity: string;
  price: string;
};

type GeneratedInvoice = {
  invoiceNumber: string;
  date: string;
  business: string;
  customer: string;
  item: string;
  amount: string;
  message: string;
};

const statuses = [
  {
    value: "Draft",
    description: "Still preparing",
  },
  {
    value: "Pending",
    description: "Awaiting payment",
  },
  {
    value: "Paid",
    description: "Payment received",
  },
] as const;

const paymentMethods: PaymentMethod[] = [
  "Cash",
  "Bank Transfer",
  "Credit Card",
  "PayPal",
  "Crypto",
];

const currencies: CurrencyOption[] = [
  {
    code: "USD",
    label: "Dollar ($)",
    symbol: "$",
  },
  {
    code: "NGN",
    label: "Naira (₦)",
    symbol: "₦",
  },
  {
    code: "EUR",
    label: "Euro (€)",
    symbol: "€",
  },
  {
    code: "GBP",
    label: "Pound (£)",
    symbol: "£",
  },
];

const defaultItems: LineItem[] = [
  {
    id: "item-1",
    name: "",
    quantity: "1",
    price: "",
  },
];

const taxRate = 0.075;

function createInvoiceNumber(date = new Date()) {
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `INV-${year}${month}${day}-${hours}${minutes}`;
}

export default function InvoicePage() {
  const [business, setBusiness] = useState("");
  const [customer, setCustomer] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceTime, setInvoiceTime] = useState("");
  const [status, setStatus] = useState<InvoiceStatus>("Draft");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Bank Transfer");
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>("NGN");
  const [items, setItems] = useState<LineItem[]>(defaultItems);
  const [invoice, setInvoice] = useState<GeneratedInvoice | null>(null);
  const [receiptGenerated, setReceiptGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [logoName, setLogoName] = useState("");
  const [logoError, setLogoError] = useState("");
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);

  const invoiceRef = useRef<HTMLDivElement>(null);

  const currency =
    currencies.find((item) => item.code === currencyCode) ?? currencies[1];

  const normalizedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        quantityValue: parsePositiveNumber(item.quantity),
        priceValue: parsePositiveNumber(item.price),
        lineTotal:
          parsePositiveNumber(item.quantity) * parsePositiveNumber(item.price),
      })),
    [items]
  );

  const totals = useMemo(() => {
    const subtotal = normalizedItems.reduce(
      (sum, item) => sum + item.lineTotal,
      0
    );
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      subtotal,
      tax,
      total,
    };
  }, [normalizedItems]);

  const describedItems = normalizedItems.filter((item) => item.name.trim());

  const validItems = describedItems.filter(
    (item) => item.quantityValue > 0 && item.priceValue > 0
  );

  const canGenerate =
    Boolean(business.trim()) &&
    Boolean(customer.trim()) &&
    describedItems.length > 0 &&
    describedItems.every(
      (item) => item.quantityValue > 0 && item.priceValue > 0
    );

  const itemSummary = validItems
    .map(
      (item) =>
        `${item.name.trim()} x ${item.quantityValue} (${formatMoney(
          item.priceValue,
          currency
        )} each)`
    )
    .join(", ");

  const markReceiptAsNotGenerated = () => {
    setReceiptGenerated(false);
    setDownloaded(false);
  };

  const updateBusiness = (value: string) => {
    const nextValue = sanitizeNameInput(value);
    if (nextValue !== business) {
      markReceiptAsNotGenerated();
    }
    setBusiness(nextValue);
  };

  const updateCustomer = (value: string) => {
    const nextValue = sanitizeNameInput(value);
    if (nextValue !== customer) {
      markReceiptAsNotGenerated();
    }
    setCustomer(nextValue);
  };

  const updateInvoiceDate = (value: string) => {
    if (value !== invoiceDate) {
      markReceiptAsNotGenerated();
    }
    setInvoiceDate(value);
  };

  const updateInvoiceTime = (value: string) => {
    if (value !== invoiceTime) {
      markReceiptAsNotGenerated();
    }
    setInvoiceTime(value);
  };

  const updatePaymentMethod = (value: PaymentMethod) => {
    if (value !== paymentMethod) {
      markReceiptAsNotGenerated();
    }
    setPaymentMethod(value);
  };

  const updateCurrencyCode = (value: CurrencyCode) => {
    if (value !== currencyCode) {
      markReceiptAsNotGenerated();
    }
    setCurrencyCode(value);
  };

  const updateStatus = (value: InvoiceStatus) => {
    if (value !== status) {
      markReceiptAsNotGenerated();
    }
    setStatus(value);
  };

  const previewInvoice = {
    invoiceNumber:
      receiptGenerated && invoice ? invoice.invoiceNumber : "INV-0001",
    date: invoiceDate || invoice?.date || "Select date",
    time: invoiceTime || "Select time",
    business: business || invoice?.business || "Business Name",
    customer: customer || invoice?.customer || "Customer Name",
    message: getReceiptNote(status),
  };

  const validateReceiptFields = () => {
    if (!business.trim()) {
      return "Enter a business name before generating the receipt.";
    }

    if (!customer.trim()) {
      return "Enter a customer name before generating the receipt.";
    }

    if (describedItems.length === 0) {
      return "Add at least one item description before generating the receipt.";
    }

    if (describedItems.some((item) => item.quantityValue <= 0)) {
      return "Quantity must be greater than 0 for every described item.";
    }

    if (describedItems.some((item) => item.priceValue <= 0)) {
      return "Price must be greater than 0 for every described item.";
    }

    return "";
  };

  const handleGenerateReceipt = () => {
    console.log("Generating receipt");

    if (loading) return;

    const validationError = validateReceiptFields();

    if (validationError) {
      setError(validationError);
      setReceiptGenerated(false);
      setDownloaded(false);
      return;
    }

    const invoiceNumber = createInvoiceNumber();

    setLoading(true);
    setError("");
    setDownloaded(false);
    setCopied(false);
    setInvoice({
      invoiceNumber,
      business,
      customer,
      item: itemSummary,
      amount: formatMoney(totals.total, currency),
      date: invoiceDate,
      message: getReceiptNote(status),
    });
    setReceiptGenerated(true);
    setLoading(false);
  };

  const handleLogoFile = (file?: File) => {
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setLogoError("Please upload a PNG or JPG logo.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      setLogoDataUrl(reader.result);
      setLogoName(file.name);
      setLogoError("");
      markReceiptAsNotGenerated();
    };

    reader.onerror = () => {
      setLogoError("Could not read this logo. Please try another file.");
    };

    reader.readAsDataURL(file);
  };

  const handleLogoInput = (event: ChangeEvent<HTMLInputElement>) => {
    handleLogoFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleLogoDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDraggingLogo(false);
    handleLogoFile(event.dataTransfer.files?.[0]);
  };

  const removeLogo = () => {
    setLogoDataUrl("");
    setLogoName("");
    setLogoError("");
    markReceiptAsNotGenerated();
  };

  const updateItem = (
    id: string,
    field: "name" | "quantity" | "price",
    value: string
  ) => {
    markReceiptAsNotGenerated();
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const addItem = () => {
    markReceiptAsNotGenerated();
    setItems((currentItems) => [
      ...currentItems,
      {
        id: `item-${currentItems.length + 1}-${Date.now()}`,
        name: "",
        quantity: "1",
        price: "",
      },
    ]);
  };

  const removeItem = (id: string) => {
    markReceiptAsNotGenerated();
    setItems((currentItems) =>
      currentItems.length === 1
        ? defaultItems
        : currentItems.filter((item) => item.id !== id)
    );
  };

  const downloadInvoice = async () => {
    if (!receiptGenerated || !invoiceRef.current) return;

    try {
      const dataUrl = await toPng(invoiceRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `${previewInvoice.invoiceNumber}.png`;
      link.href = dataUrl;
      link.click();

      setDownloaded(true);
      window.setTimeout(() => setDownloaded(false), 2600);
    } catch (error) {
      console.log(error);
      setError("Could not download the invoice PNG. Please try again.");
    }
  };

  const copyInvoice = async () => {
    await navigator.clipboard.writeText(
      JSON.stringify(
        {
          ...previewInvoice,
          status,
          paymentMethod,
          currency: currency.code,
          items: normalizedItems.map((item) => ({
            name: item.name,
            quantity: item.quantityValue,
            price: formatMoney(item.priceValue, currency),
            total: formatMoney(item.lineTotal, currency),
          })),
          subtotal: formatMoney(totals.subtotal, currency),
          tax: formatMoney(totals.tax, currency),
          total: formatMoney(totals.total, currency),
          logo: logoName || null,
        },
        null,
        2
      )
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] px-3 py-4 text-[#0F172A] sm:px-5 sm:py-6 lg:px-8 2xl:px-10">
      {downloaded ? (
        <div className="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-[18px] border border-[#BAE6FD] bg-white px-4 py-3 text-sm font-bold text-[#0F172A] shadow-[0_18px_42px_rgba(15,23,42,0.14)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-[#F0F9FF] text-[#0EA5E9]">
            <Check size={18} />
          </div>
          Invoice PNG downloaded
        </div>
      ) : null}

      <div className="w-full">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="hidden">
                <Link href="/" className="flex items-center gap-3">
                  <AiflowLogo compact />
                </Link>
              </div>

              <div className="flex h-12 w-full items-center gap-3 rounded-[16px] border border-[#E2E8F0] bg-white px-4 shadow-sm sm:max-w-xl xl:max-w-2xl">
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
                <ReceiptText size={15} />
                Professional invoice builder
              </div>
            </div>

            <section className="mt-5 overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:rounded-[28px]">
              <div className="grid gap-8 p-5 sm:p-8 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] xl:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-1 text-sm font-semibold text-[#0369A1]">
                    <Sparkles size={15} />
                    Invoice studio
                  </div>
                  <h1 className="mt-6 max-w-3xl text-3xl font-black leading-[1.08] tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
                    AI Invoice Generator
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                    Build a clean invoice with time, payment method, multiple
                    services, tax, currency, logo branding, and PNG export.
                  </p>
                </div>

                <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#F0F9FF] text-[#0EA5E9]">
                      <WalletCards size={23} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#0F172A]">
                        {status} invoice
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {getCurrencyLabel(currency)} / {paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-3 min-[360px]:grid-cols-3">
                    <MiniMetric icon={FileText} value="PNG" label="Export" />
                    <MiniMetric
                      icon={Clock3}
                      value={invoiceTime || "--:--"}
                      label="Time"
                    />
                    <MiniMetric
                      icon={CheckCircle2}
                      value={status}
                      label="Status"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(380px,500px)_minmax(0,1fr)] xl:gap-6 2xl:grid-cols-[minmax(420px,540px)_minmax(0,1fr)]">
              <div className="h-fit min-w-0 rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5E9]">
                    Builder
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0F172A]">
                    Invoice Details
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Add customer details, currency, payment method, and line
                    items. Subtotal, tax, and total update automatically.
                  </p>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <Field
                    label="Business Name"
                    placeholder="Your business name"
                    value={business}
                    helperText="Letters only"
                    onChange={updateBusiness}
                  />
                  <Field
                    label="Customer Name"
                    placeholder="Customer or client name"
                    value={customer}
                    helperText="Letters only"
                    onChange={updateCustomer}
                  />
                  <DateTimeField
                    date={invoiceDate}
                    onDateChange={updateInvoiceDate}
                    onTimeChange={updateInvoiceTime}
                    time={invoiceTime}
                  />
                  <SelectField
                    label="Payment Method"
                    value={paymentMethod}
                    onChange={(value) => updatePaymentMethod(value as PaymentMethod)}
                    options={paymentMethods.map((method) => ({
                      label: method,
                      value: method,
                    }))}
                  />
                  <SelectField
                    label="Currency"
                    value={currencyCode}
                    onChange={(value) => updateCurrencyCode(value as CurrencyCode)}
                    options={currencies.map((item) => ({
                      label: getCurrencyLabel(item),
                      value: item.code,
                    }))}
                  />
                </div>

                <LogoUpload
                  error={logoError}
                  isDragging={isDraggingLogo}
                  logoDataUrl={logoDataUrl}
                  logoName={logoName}
                  onChange={handleLogoInput}
                  onDragEnter={() => setIsDraggingLogo(true)}
                  onDragLeave={() => setIsDraggingLogo(false)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleLogoDrop}
                  onRemove={removeLogo}
                />

                <LineItemsEditor
                  currency={currency}
                  items={normalizedItems}
                  onAddItem={addItem}
                  onRemoveItem={removeItem}
                  onUpdateItem={updateItem}
                />

                <div className="mt-7">
                  <p className="text-sm font-bold text-[#0F172A]">
                    Invoice Status
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {statuses.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => updateStatus(item.value)}
                        className={[
                          "min-h-[76px] rounded-[16px] border px-4 py-3 text-left transition",
                          status === item.value
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

                <SummarySection
                  currency={currency}
                  customer={previewInvoice.customer}
                  date={previewInvoice.date}
                  paymentMethod={paymentMethod}
                  status={status}
                  time={previewInvoice.time}
                  totals={totals}
                />

                {error ? (
                  <div className="mt-5 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                ) : null}

                <div className="mt-7">
                  {!receiptGenerated ? (
                    <>
                      <button
                        type="button"
                        onClick={handleGenerateReceipt}
                        disabled={loading}
                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#0F172A] px-5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {loading ? (
                          <>
                            <LoadingDot />
                            Generating receipt
                          </>
                        ) : (
                          <>
                            <Sparkles size={17} />
                            Generate Receipt
                          </>
                        )}
                      </button>
                      <p className="mt-2 text-xs font-semibold text-slate-500">
                        Generate the receipt before downloading.
                      </p>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={downloadInvoice}
                      disabled={!canGenerate}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white px-5 text-sm font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0369A1] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      <Download size={17} className="text-[#0EA5E9]" />
                      Download Receipt
                    </button>
                  )}
                </div>
              </div>

              <div className="w-full min-w-0 space-y-5 xl:sticky xl:top-6">
                <div className="w-full min-w-0 rounded-[28px] border border-[#E2E8F0] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-5 2xl:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5E9]">
                        Preview
                      </p>
                      <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0F172A]">
                        Live Invoice Preview
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        This is the exact card exported by the PNG download,
                        including the watermark logo.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={copyInvoice}
                      disabled={!canGenerate}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white px-4 text-sm font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0369A1] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {copied ? (
                        <Check size={16} className="text-[#0EA5E9]" />
                      ) : (
                        <Copy size={16} className="text-[#0EA5E9]" />
                      )}
                      {copied ? "Copied" : "Copy JSON"}
                    </button>
                  </div>

                  {loading ? <LoadingState /> : null}

                  <div className="min-w-0">
                    <PremiumInvoicePreview
                      currency={currency}
                      invoice={previewInvoice}
                      invoiceRef={invoiceRef}
                      items={normalizedItems}
                      logoDataUrl={logoDataUrl}
                      paymentMethod={paymentMethod}
                      status={status}
                      totals={totals}
                    />
                  </div>
                </div>
              </div>
            </section>
      </div>
    </main>
  );
}

function parsePositiveNumber(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function sanitizeNameInput(value: string) {
  return value.replace(/[^\p{L} .'-]/gu, "");
}

function getCurrencySymbol(currency: CurrencyOption) {
  if (currency.code === "NGN") return "\u20A6";
  if (currency.code === "EUR") return "\u20AC";
  if (currency.code === "GBP") return "\u00A3";
  return "$";
}

function getCurrencyLabel(currency: CurrencyOption) {
  if (currency.code === "NGN") return "Naira (\u20A6)";
  if (currency.code === "EUR") return "Euro (\u20AC)";
  if (currency.code === "GBP") return "Pound (\u00A3)";
  return "Dollar ($)";
}

function normalizeDisplayText(value: string) {
  return value
    .replace(/\u00C2\u00B7/g, "at")
    .replace(/\u00E2\u201A\u00A6/g, "\u20A6")
    .replace(/\u00E2\u201A\u00AC/g, "\u20AC")
    .replace(/\u00C2\u00A3/g, "\u00A3");
}

function formatMoney(value: number, currency: CurrencyOption) {
  return `${getCurrencySymbol(currency)}${value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
}

function formatReceiptDate(value: string) {
  if (!value || value === "Select date") return "Select date";

  const [year, month, day] = value.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthIndex = Number(month) - 1;

  if (year && day && monthNames[monthIndex]) {
    return `${Number(day)} ${monthNames[monthIndex]} ${year}`;
  }

  return normalizeDisplayText(value);
}

function formatReceiptTime(value: string) {
  if (!value || value === "Select time") return "Select time";

  const [hourValue, minuteValue = "00"] = value.split(":");
  const hour = Number(hourValue);

  if (!Number.isFinite(hour)) return normalizeDisplayText(value);

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minuteValue.padStart(2, "0")} ${period}`;
}

function getPaymentReferencePrefix(method: PaymentMethod) {
  if (method === "Cash") return "CSH";
  if (method === "Credit Card") return "CRD";
  if (method === "PayPal") return "PPL";
  if (method === "Crypto") return "CRP";
  return "TRF";
}

function buildPaymentReference(date: string, time: string, method: PaymentMethod) {
  const datePart = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? date.replace(/-/g, "")
    : date.replace(/\D/g, "").slice(0, 8) || "DATE";
  const timePart = time.replace(/\D/g, "").slice(0, 4) || "TIME";

  return `${getPaymentReferencePrefix(method)}-${datePart}-${timePart}`;
}

function getPaymentNote(method: PaymentMethod, status: InvoiceStatus) {
  if (status === "Pending") return "Awaiting payment confirmation";
  if (status === "Draft") return "Payment note pending";

  if (method === "Cash") return "Cash payment received";
  if (method === "Credit Card") return "Card payment confirmed";
  if (method === "PayPal") return "PayPal payment confirmed";
  if (method === "Crypto") return "Crypto payment confirmed";

  return "Transfer confirmed";
}

function getReceiptNote(status: string) {
  if (status === "Paid") {
    return "Your payment has been successfully received. Thank you for your business!";
  }

  if (status === "Pending") {
    return "Thank you for your business. Please complete payment using the selected payment method.";
  }

  if (status === "Draft") {
    return "This receipt is currently a draft. Payment details will be confirmed once finalized.";
  }

  return "Thank you for your business.";
}

function getBusinessInitial(value: string) {
  const normalized = normalizeDisplayText(value).trim();
  return (normalized.charAt(0) || "B").toUpperCase();
}

function getItemDescription(value: string, index: number) {
  if (!value.trim()) return "Item description needed";
  return `Product / service line ${index + 1}`;
}

function formatInvoiceNumber(value: string) {
  const normalized = normalizeDisplayText(value).trim() || "INV-0001";
  return normalized.replace(/^#\s*/, "");
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

function Field({
  helperText,
  label,
  onChange,
  placeholder,
  value,
}: {
  helperText?: string;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  const lettersOnly = helperText === "Letters only";
  const nameCharacterPattern = /[\p{L} .'-]/u;
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!lettersOnly || event.key.length !== 1) return;
    if (!nameCharacterPattern.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-[#0F172A]">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="mt-3 h-12 w-full rounded-[16px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-[#BAE6FD]/50"
      />
      {helperText ? (
        <p className="mt-2 text-xs font-semibold text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

function DateTimeField({
  date,
  onDateChange,
  onTimeChange,
  time,
}: {
  date: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  time: string;
}) {
  return (
    <div className="md:col-span-2">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="invoice-date"
            className="block text-sm font-bold text-[#0F172A]"
          >
            Invoice Date
          </label>
          <div className="mt-3 flex h-12 items-center gap-3 rounded-[16px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 transition focus-within:border-[#0EA5E9] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#BAE6FD]/50">
            <CalendarDays size={18} className="text-[#0EA5E9]" />
            <input
              id="invoice-date"
              type="date"
              value={date}
              onChange={(event) => onDateChange(event.target.value)}
              className="h-full w-full bg-transparent text-sm font-semibold text-[#0F172A] outline-none"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="invoice-time"
            className="block text-sm font-bold text-[#0F172A]"
          >
            Invoice Time
          </label>
          <div className="mt-3 flex h-12 items-center gap-3 rounded-[16px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 transition focus-within:border-[#0EA5E9] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#BAE6FD]/50">
            <Clock3 size={18} className="text-[#0EA5E9]" />
            <input
              id="invoice-time"
              type="time"
              value={time}
              onChange={(event) => onTimeChange(event.target.value)}
              className="h-full w-full bg-transparent text-sm font-semibold text-[#0F172A] outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-[#0F172A]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-12 w-full rounded-[16px] border border-[#CBD5E1] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0F172A] outline-none transition focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-[#BAE6FD]/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function LogoUpload({
  error,
  isDragging,
  logoDataUrl,
  logoName,
  onChange,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onRemove,
}: {
  error: string;
  isDragging: boolean;
  logoDataUrl: string;
  logoName: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDragOver: (event: DragEvent<HTMLLabelElement>) => void;
  onDrop: (event: DragEvent<HTMLLabelElement>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="mt-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#0F172A]">Business Logo</p>
          <p className="mt-1 text-sm text-slate-500">
            Upload a PNG or JPG logo for the header and watermark.
          </p>
        </div>
        {logoDataUrl ? (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white px-3 text-xs font-bold text-[#0F172A] shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <X size={15} />
            Remove
          </button>
        ) : null}
      </div>

      <label
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={[
          "mt-3 flex cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed bg-[#F8FAFC] p-6 text-center transition",
          isDragging
            ? "border-[#0EA5E9] bg-[#F0F9FF]"
            : "border-[#CBD5E1] hover:border-[#0EA5E9] hover:bg-[#F0F9FF]",
        ].join(" ")}
      >
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={onChange}
          className="sr-only"
        />

        {logoDataUrl ? (
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:text-left">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[#E2E8F0] bg-white p-2 shadow-sm">
              <img
                src={logoDataUrl}
                alt="Uploaded business logo preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-[#0F172A]">
                {logoName}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Logo ready. Drop a new file here or click to replace it.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-white text-[#0EA5E9] shadow-sm">
              <CloudUpload size={26} />
            </div>
            <p className="mt-4 text-sm font-black text-[#0F172A]">
              Drop your logo here or click to upload
            </p>
            <p className="mt-2 text-sm text-slate-500">PNG or JPG only</p>
          </>
        )}
      </label>

      {error ? (
        <div className="mt-3 rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}

function LineItemsEditor({
  currency,
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: {
  currency: CurrencyOption;
  items: Array<LineItem & { lineTotal: number }>;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (
    id: string,
    field: "name" | "quantity" | "price",
    value: string
  ) => void;
}) {
  return (
    <div className="mt-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#0F172A]">
            Products / Services
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Add multiple services, quantities, and prices.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[14px] border border-[#CBD5E1] bg-white px-4 text-sm font-bold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0369A1] sm:w-auto"
        >
          <Plus size={16} className="text-[#0EA5E9]" />
          Add item
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0F172A]">
                  Item {index + 1}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {item.name || "Product or service line"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[13px] border border-[#CBD5E1] bg-white px-3 text-sm font-bold text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 sm:w-auto"
                aria-label={`Remove item ${index + 1}`}
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>

            <div className="mt-4">
              <div>
                <label
                  htmlFor={`${item.id}-name`}
                  className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400"
                >
                  Description
                </label>
                <input
                  id={`${item.id}-name`}
                  value={item.name}
                  onChange={(event) =>
                    onUpdateItem(item.id, "name", event.target.value)
                  }
                  placeholder="Product or service"
                  className="mt-2 h-11 w-full rounded-[14px] border border-[#CBD5E1] bg-white px-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#BAE6FD]/50"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[120px_1fr_1fr] md:items-end">
              <div>
                <label
                  htmlFor={`${item.id}-quantity`}
                  className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400"
                >
                  Qty
                </label>
                <input
                  id={`${item.id}-quantity`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) =>
                    onUpdateItem(item.id, "quantity", event.target.value)
                  }
                  className="mt-2 h-11 w-full rounded-[14px] border border-[#CBD5E1] bg-white px-3 text-sm font-semibold text-[#0F172A] outline-none transition focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#BAE6FD]/50"
                />
              </div>

              <div>
                <label
                  htmlFor={`${item.id}-price`}
                  className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400"
                >
                  Price
                </label>
                <input
                  id={`${item.id}-price`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(event) =>
                    onUpdateItem(item.id, "price", event.target.value)
                  }
                  placeholder="0.00"
                  className="mt-2 h-11 w-full rounded-[14px] border border-[#CBD5E1] bg-white px-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#BAE6FD]/50"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  Line Total
                </p>
                <div className="mt-2 flex h-11 min-w-0 items-center rounded-[14px] border border-[#E2E8F0] bg-white px-3">
                  <p className="min-w-0 truncate text-sm font-black text-[#0F172A]">
                    {formatMoney(item.lineTotal, currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummarySection({
  currency,
  customer,
  date,
  paymentMethod,
  status,
  time,
  totals,
}: {
  currency: CurrencyOption;
  customer: string;
  date: string;
  paymentMethod: PaymentMethod;
  status: InvoiceStatus;
  time: string;
  totals: {
    subtotal: number;
    tax: number;
    total: number;
  };
}) {
  return (
    <div className="mt-7 rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5E9]">
            Summary
          </p>
          <h3 className="mt-2 text-lg font-black text-[#0F172A]">
            Invoice Snapshot
          </h3>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <SummaryItem label="Customer" value={customer} />
        <SummaryItem label="Issued" value={`${date} · ${time}`} />
        <SummaryItem label="Payment" value={paymentMethod} />
        <SummaryItem label="Total" value={formatMoney(totals.total, currency)} strong />
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  strong = false,
  value,
}: {
  label: string;
  strong?: boolean;
  value: string;
}) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p
        className={[
          "mt-2 truncate text-sm text-[#0F172A]",
          strong ? "font-black" : "font-bold",
        ].join(" ")}
      >
        {normalizeDisplayText(value)}
      </p>
    </div>
  );
}

function PremiumInvoicePreview({
  currency,
  invoice,
  invoiceRef,
  items,
  logoDataUrl,
  paymentMethod,
  status,
  totals,
}: {
  currency: CurrencyOption;
  invoice: {
    business: string;
    customer: string;
    date: string;
    invoiceNumber: string;
    message: string;
    time: string;
  };
  invoiceRef: React.RefObject<HTMLDivElement | null>;
  items: Array<
    LineItem & {
      lineTotal: number;
      priceValue: number;
      quantityValue: number;
    }
  >;
  logoDataUrl: string;
  paymentMethod: PaymentMethod;
  status: InvoiceStatus;
  totals: {
    subtotal: number;
    tax: number;
    total: number;
  };
}) {
  const businessName = normalizeDisplayText(invoice.business);
  const customerName = normalizeDisplayText(invoice.customer);
  const receiptDate = formatReceiptDate(invoice.date);
  const receiptTime = formatReceiptTime(invoice.time);
  const paymentNote = getPaymentNote(paymentMethod, status);
  const paymentReference = buildPaymentReference(
    invoice.date,
    invoice.time,
    paymentMethod
  );
  const receiptNote = getReceiptNote(status);

  return (
    <div
      ref={invoiceRef}
      className="relative mx-auto mt-5 w-full max-w-[1100px] rounded-[24px] bg-[#E8EEF6] p-2 text-[#0F172A] sm:rounded-[30px] sm:p-4 lg:p-5"
    >
      <article className="relative overflow-hidden rounded-[22px] bg-white px-4 pb-9 pt-6 shadow-[0_28px_90px_rgba(15,23,42,0.16)] sm:rounded-[28px] sm:px-7 sm:pb-10 sm:pt-8 xl:px-10 xl:pb-12 xl:pt-10 2xl:px-12 2xl:pb-14 2xl:pt-12">
        {!logoDataUrl ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center px-6"
          >
            <p className="max-w-full -rotate-12 break-words text-center text-3xl font-black uppercase leading-none text-[#0F172A] opacity-[0.035] sm:text-5xl lg:text-6xl xl:text-7xl">
              {businessName}
            </p>
          </div>
        ) : null}

        <div className="relative z-10">
          <header className="grid min-w-0 grid-cols-1 gap-6 border-b border-[#D7E0EA] pb-8 lg:grid-cols-[96px_minmax(0,1fr)_minmax(180px,240px)] lg:items-start lg:gap-7 xl:grid-cols-[96px_minmax(0,1fr)_minmax(190px,260px)]">
            <div
              className={[
                "flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[10px]",
                logoDataUrl
                  ? "border border-[#E2E8F0] bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                  : "bg-[#0F172A] p-3 text-3xl font-black text-[#C9A227] shadow-[0_14px_30px_rgba(15,23,42,0.12)]",
              ].join(" ")}
            >
              {logoDataUrl ? (
                <img
                  src={logoDataUrl}
                  alt="Business logo"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span>{getBusinessInitial(businessName)}</span>
              )}
            </div>

            <div className="min-w-0 max-w-full pt-1 lg:max-w-[34rem] xl:max-w-[40rem]">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#475569]">
                FROM
              </p>
              <h2 className="mt-5 max-w-full whitespace-normal break-words text-2xl font-black leading-tight text-[#0F172A] [overflow-wrap:anywhere] sm:text-3xl lg:text-4xl">
                {businessName}
              </h2>
              <p className="mt-3 max-w-sm text-base leading-7 text-[#475569]">
                Business receipt
                <br />
                Receipt issued in Lagos, Nigeria
              </p>
            </div>

            <div className="min-w-0 max-w-full lg:justify-self-end lg:text-right">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#475569]">
                RECEIPT
              </p>
              <p className="mt-5 max-w-full whitespace-normal break-words text-xl font-black leading-tight text-[#0F172A] [overflow-wrap:anywhere] sm:text-2xl lg:text-3xl">
                {formatInvoiceNumber(invoice.invoiceNumber)}
              </p>
              <div className="mt-5 flex min-w-0 lg:justify-end">
                <ReceiptStatusBadge status={status} />
              </div>
            </div>
          </header>

          <div className="relative">
            {logoDataUrl ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
              >
                <img
                  src={logoDataUrl}
                  alt=""
                  className="h-32 w-32 -rotate-6 object-contain opacity-[0.04] sm:h-44 sm:w-44 lg:h-52 lg:w-52 2xl:h-60 2xl:w-60"
                />
              </div>
            ) : null}

            <div className="relative z-10 grid gap-5 py-8 md:grid-cols-3">
              <PremiumReceiptInfoCard
                label="BILL TO"
                primary={customerName}
                secondary="Customer"
              />
              <PremiumReceiptInfoCard
                accent="navy"
                label="DATE / TIME"
                primary={receiptDate}
                secondary={receiptTime}
              />
              <PremiumReceiptInfoCard
                label="PAYMENT"
                primary={paymentMethod}
                primarySize="compact"
                secondary={paymentNote}
              />
            </div>

            <section className="relative z-10 overflow-hidden rounded-[8px] border border-[#D7E0EA]">
              <div className="hidden bg-[#F8FAFC] px-5 py-3.5 text-xs font-black uppercase tracking-[0.12em] text-[#334155] sm:grid sm:grid-cols-[minmax(0,1fr)_64px_112px_122px] sm:gap-4 md:grid-cols-[minmax(0,1fr)_76px_132px_146px]">
                <p className="min-w-0">DESCRIPTION</p>
                <p className="min-w-0 text-right">QTY</p>
                <p className="min-w-0 text-right">PRICE</p>
                <p className="min-w-0 text-right">TOTAL</p>
              </div>

              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={[
                    "grid grid-cols-2 gap-x-5 gap-y-3 px-5 py-4 text-sm sm:grid-cols-[minmax(0,1fr)_64px_112px_122px] sm:items-center sm:gap-4 md:grid-cols-[minmax(0,1fr)_76px_132px_146px]",
                    index > 0
                      ? "border-t border-[#D7E0EA]"
                      : "border-t border-[#D7E0EA] sm:border-t-0",
                  ].join(" ")}
                >
                  <div className="col-span-2 min-w-0 sm:col-span-1">
                    <p className="break-words text-lg font-black leading-tight text-[#0F172A] sm:text-base">
                      {normalizeDisplayText(item.name || `Item ${index + 1}`)}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-[#475569]">
                      {getItemDescription(item.name, index)}
                    </p>
                  </div>
                  <PremiumReceiptTableValue
                    label="QTY"
                    value={`${item.quantityValue || 0}`}
                  />
                  <PremiumReceiptTableValue
                    label="PRICE"
                    value={formatMoney(item.priceValue, currency)}
                  />
                  <PremiumReceiptTableValue
                    label="TOTAL"
                    strong
                    value={formatMoney(item.lineTotal, currency)}
                  />
                </div>
              ))}
            </section>

            <div className="relative z-10 mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)]">
              <section className="min-w-0 rounded-[8px] border border-[#D7E0EA] border-l-4 border-l-[#0F172A] bg-[#F8FAFC] px-5 py-6 sm:px-6">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#334155]">
                  NOTES
                </p>
                <p className="mt-5 max-w-xl text-base leading-7 text-[#334155]">
                  {receiptNote}
                </p>
              </section>

              <section className="min-w-0 overflow-hidden rounded-[8px] border border-[#D7E0EA] border-t-4 border-t-[#C9A227] bg-white px-5 py-6 sm:px-6">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#334155]">
                  AMOUNT SUMMARY
                </p>
                <div className="mt-5 space-y-3">
                  <PremiumTotalRow
                    label="Subtotal"
                    value={formatMoney(totals.subtotal, currency)}
                  />
                  <PremiumTotalRow
                    label="Tax (7.5%)"
                    value={formatMoney(totals.tax, currency)}
                  />
                </div>
                <div className="my-5 border-t border-[#D7E0EA]" />
                <div className="flex min-w-0 items-center justify-between gap-4 overflow-hidden">
                  <p className="shrink-0 text-xl font-black text-[#0F172A]">
                    Total
                  </p>
                  <p className="min-w-0 flex-1 break-words text-right text-2xl font-black leading-tight text-[#0F172A] sm:text-3xl">
                    {formatMoney(totals.total, currency)}
                  </p>
                </div>
              </section>
            </div>
          </div>

          <footer className="mt-10 flex flex-col gap-7 border-t border-[#D7E0EA] pb-1 pt-8 sm:mt-12 sm:flex-row sm:items-start sm:justify-between sm:gap-8 sm:pb-2">
            <p className="max-w-2xl text-sm leading-7 text-[#475569] sm:pr-8">
              Payment Ref: {paymentReference}. Thank you for your business.
            </p>
            <div className="min-w-0 sm:shrink-0 sm:text-right">
              <p className="break-words text-lg font-black text-[#0F172A]">
                {businessName}
              </p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#475569]">
                SELLER
              </p>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}

function PremiumReceiptInfoCard({
  accent = "gold",
  label,
  primary,
  primarySize = "default",
  secondary,
}: {
  accent?: "gold" | "navy";
  label: string;
  primary: string;
  primarySize?: "default" | "compact";
  secondary: string;
}) {
  return (
    <div
      className={[
        "min-w-0 border-l-4 py-1 pl-5",
        accent === "navy" ? "border-[#0F172A]" : "border-[#C9A227]",
      ].join(" ")}
    >
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#475569]">
        {label}
      </p>
      <p
        className={[
          "break-words font-black text-[#0F172A]",
          primarySize === "compact"
            ? "mt-6 text-lg leading-snug sm:text-xl"
            : "mt-7 text-xl leading-tight sm:text-2xl",
        ].join(" ")}
      >
        {normalizeDisplayText(primary)}
      </p>
      <p className="mt-2 break-words text-sm leading-6 text-[#475569]">
        {normalizeDisplayText(secondary)}
      </p>
    </div>
  );
}

function PremiumReceiptTableValue({
  label,
  strong = false,
  value,
}: {
  label: string;
  strong?: boolean;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#64748B] sm:hidden">
        {label}
      </p>
      <p
        className={[
          "mt-1 break-words text-sm leading-5 text-[#334155] sm:mt-0 sm:text-right",
          strong ? "font-black text-[#0F172A]" : "font-bold",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function PremiumTotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="shrink-0 text-base font-black text-[#334155]">{label}</p>
      <p className="min-w-0 flex-1 break-words text-right text-base font-black text-[#0F172A]">
        {value}
      </p>
    </div>
  );
}

function ReceiptStatusBadge({ status }: { status: InvoiceStatus }) {
  const badgeClassName =
    status === "Paid"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Pending"
        ? "bg-[#F0F9FF] text-[#0369A1]"
        : "bg-slate-100 text-slate-600";
  const dotClassName =
    status === "Paid"
      ? "bg-emerald-600"
      : status === "Pending"
        ? "bg-[#0EA5E9]"
        : "bg-slate-500";

  return (
    <span
      className={[
        "inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-black",
        badgeClassName,
      ].join(" ")}
    >
      <span className={["h-2.5 w-2.5 rounded-full", dotClassName].join(" ")} />
      {status}
    </span>
  );
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const className =
    status === "Paid"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "Pending"
        ? "border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1]"
        : "border-slate-200 bg-slate-100 text-slate-600";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-black",
        className,
      ].join(" ")}
    >
      {status}
    </span>
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
      <p className="mt-3 truncate text-lg font-black leading-none text-[#0F172A]">
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
          <Sparkles size={22} className="animate-pulse" />
        </div>
        <div>
          <p className="text-sm font-black text-[#0F172A]">
            Generating invoice
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Preparing your invoice details and customer note.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-3 w-full animate-pulse rounded-full bg-white" />
        <div className="h-3 w-5/6 animate-pulse rounded-full bg-white" />
        <div className="h-3 w-3/5 animate-pulse rounded-full bg-white" />
      </div>
    </div>
  );
}
