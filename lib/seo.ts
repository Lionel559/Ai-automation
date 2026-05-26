export const siteUrl = getSiteUrl();

export const siteTitle =
  "AIFLOW — AI Automation Platform for Small Businesses";

export const siteDescription =
  "AIFLOW helps small businesses automate captions, customer replies, invoices, FAQs, and product descriptions using AI.";

export const siteKeywords = [
  "AI automation",
  "small business tools",
  "AI SaaS",
  "invoice generator",
  "AI caption generator",
  "customer reply assistant",
  "AI FAQ tool",
  "product description generator",
];

export const ogImagePath = "/opengraph-image";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

function getSiteUrl() {
  const configuredUrl = process.env.NEXTAUTH_URL?.trim();

  if (configuredUrl) {
    return new URL(configuredUrl);
  }

  return new URL("http://localhost:3000");
}
