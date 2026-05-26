import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Product Description Generator",
  description:
    "Write persuasive AI product descriptions for online stores, catalogs, Instagram, and WhatsApp inside AIFLOW.",
};

export default function ProductDescriptionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
