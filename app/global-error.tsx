"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "4rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ marginTop: "0.5rem", color: "#6b6b6b" }}>
          Please refresh the page. If the problem continues, contact us on WhatsApp.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            padding: "0.6rem 1.5rem",
            borderRadius: "999px",
            background: "#2a2420",
            color: "#faf6f0",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
