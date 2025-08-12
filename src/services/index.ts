// src/services/index.ts
const ROOT = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://current-ant-touching.ngrok-free.app"
).replace(/\/+$/, "");
const BASE_URL = `${ROOT}/api`;

export async function fetchFromBackend<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${path}`;

  try {
    console.log("🌐 Haciendo petición a:", url);
    console.log("📤 Opciones de la petición:", options);

    const headers = new Headers(options.headers || {});

    // 👇 Solo para ngrok: enviar el header que salta el warning HTML
    try {
      const u = new URL(url);
      if (/\bngrok(-free)?\.app$/i.test(u.hostname)) {
        headers.set("ngrok-skip-browser-warning", "true");
      }
    } catch {
      // ignore
    }

    // Content-Type solo si hay body y no es FormData
    if (
      options.body &&
      !(options.body instanceof FormData) &&
      !headers.has("Content-Type")
    ) {
      headers.set("Content-Type", "application/json");
    }
    if (options.body instanceof FormData && headers.has("Content-Type")) {
      headers.delete("Content-Type");
    }

    console.log("📋 Headers finales:", Array.from(headers.entries()));

    const response = await fetch(url, { ...options, headers });
    console.log("📥 Respuesta recibida:", response.status, response.statusText);

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          message: `HTTP ${response.status}: ${response.statusText}`,
        };
      }
      console.error("❌ Error en la respuesta:", errorData);

      if (response.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userIcon");
      }
      throw new Error(
        errorData.message || errorData.error || "Error en la solicitud"
      );
    }

    const ct = response.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const text = await response.text();
      console.error(
        "⚠️ Esperaba JSON pero recibí:",
        ct,
        "→",
        text.slice(0, 300)
      );
      throw new Error(`El backend respondió ${ct}. ¿La URL es correcta?`);
    }

    const result = await response.json();
    console.log("✅ Datos recibidos:", result);
    return result as T;
  } catch (error) {
    console.error("💥 Error al conectar con el backend:", error);
    throw error;
  }
}
