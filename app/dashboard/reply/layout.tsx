import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Customer Reply Assistant",
  description:
    "Generate professional AI customer replies for WhatsApp, Instagram DMs, and small business sales conversations inside AIFLOW.",
};

export default function ReplyLayout({ children }: { children: ReactNode }) {
  return children;
}
