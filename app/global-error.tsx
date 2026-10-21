"use client";

import React from "react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#2b0d16", color: "#fbf3e4", fontFamily: "sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center" }}>
          <div style={{ maxWidth: "420px", background: "#5a1731", border: "2px solid #c9a24b", borderRadius: "24px", padding: "32px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            <span style={{ fontSize: "40px", display: "block", marginBottom: "12px" }}>🪔</span>
            <h1 style={{ fontSize: "22px", color: "#f3e2a9", margin: "0 0 10px" }}>An unexpected error occurred</h1>
            <p style={{ fontSize: "13px", opacity: 0.8, lineHeight: 1.5, margin: "0 0 20px" }}>
              Please click the button below to recover and reload the page.
            </p>
            <button
              onClick={() => reset()}
              style={{ padding: "10px 20px", background: "#c9a24b", color: "#2b0d16", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}
            >
              Reload Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
