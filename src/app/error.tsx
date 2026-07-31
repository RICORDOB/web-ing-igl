"use client";

import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [details, setDetails] = useState("");

  useEffect(() => {
    let text = `Message: ${error.message}\n\nStack:\n${error.stack || ""}`;
    try {
      const root = document.getElementById("__next") || document.body;
      text += `\n\nHTML:\n${root.innerHTML.slice(0, 2000)}`;
    } catch {}
    setDetails(text);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-8">
      <div className="max-w-2xl w-full space-y-4">
        <div className="text-6xl text-center">😕</div>
        <h1 className="text-2xl font-bold text-purple-900 text-center">Algo salió mal</h1>
        <p className="text-gray-600 text-sm text-center">
          Ocurrió un error inesperado. Intenta recargar la página.
        </p>
        <pre className="bg-red-50 border border-red-200 rounded-xl p-4 text-left text-xs text-red-700 overflow-auto max-h-96 whitespace-pre-wrap break-all">
          {details || error.message}
        </pre>
        <div className="text-center">
          <button
            onClick={reset}
            className="rounded-xl bg-purple-800 px-6 py-3 text-white font-semibold hover:bg-purple-700 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    </div>
  );
}
