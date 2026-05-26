import { ImageResponse } from "next/og";

export const alt = "AIFLOW AI automation platform for small businesses";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#F8FAFC",
          color: "#0F172A",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "36px",
            boxShadow: "0 28px 90px rgba(15, 23, 42, 0.14)",
            display: "flex",
            flexDirection: "column",
            gap: "34px",
            height: "100%",
            justifyContent: "center",
            padding: "56px",
            width: "100%",
          }}
        >
          <div style={{ alignItems: "center", display: "flex", gap: "22px" }}>
            <div
              style={{
                alignItems: "center",
                background: "#0F172A",
                borderRadius: "24px",
                color: "#FFFFFF",
                display: "flex",
                fontSize: "42px",
                fontWeight: 900,
                height: "78px",
                justifyContent: "center",
                width: "78px",
              }}
            >
              A
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "42px", fontWeight: 900 }}>AIFLOW</div>
              <div style={{ color: "#64748B", fontSize: "24px" }}>
                AI automation SaaS for small businesses
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: "70px",
              fontWeight: 900,
              letterSpacing: "0",
              lineHeight: 1.02,
              maxWidth: "900px",
            }}
          >
            Automate captions, replies, invoices, FAQs, and product copy.
          </div>

          <div
            style={{
              alignItems: "center",
              color: "#0369A1",
              display: "flex",
              fontSize: "28px",
              fontWeight: 800,
              gap: "14px",
            }}
          >
            <span>AI Caption Generator</span>
            <span style={{ color: "#94A3B8" }}>•</span>
            <span>Invoice Generator</span>
            <span style={{ color: "#94A3B8" }}>•</span>
            <span>Customer Reply Assistant</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
