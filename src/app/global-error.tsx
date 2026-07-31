"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            background: "white",
            padding: 24,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ maxWidth: 700, textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#4a148c", margin: "0 0 8px" }}>
              Error crítico
            </h1>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 16 }}>
              Ocurrió un error inesperado en la aplicación.
            </p>
            <pre
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 12,
                padding: 16,
                textAlign: "left",
                fontSize: 12,
                color: "#dc2626",
                overflow: "auto",
                maxHeight: 400,
                marginBottom: 16,
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
              }}
            >
              Message: {error.message}
              Name: {error.name}
              {error.digest && <>
                {"\n\nDigest: "}{error.digest}
              </>}
              {error.stack && <>
                {"\n\n--- Stack ---\n"}{error.stack}
              </>}
            </pre>
            <button
              onClick={reset}
              style={{
                background: "#4a148c",
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "12px 24px",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
