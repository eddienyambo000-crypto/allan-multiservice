"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0, background: "#fff", color: "#0B1B2B" }}>
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: 420 }}>
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Something went wrong</h1>
          <p style={{ color: "#6B8299", marginTop: "0.75rem" }}>Please reload the page. Your data is safe.</p>
          <button onClick={reset} style={{ marginTop: "1.25rem", padding: "0.7rem 1.5rem", borderRadius: 999, border: "none", background: "#0C8CE0", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
