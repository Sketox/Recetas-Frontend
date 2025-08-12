// src/services/index.ts
const isBrowser = typeof window !== "undefined";

// Detecta si estás en local
const isLocalHost = () => {
  if (!isBrowser) return false;
  const h = window.location.hostname;
  return h === "localhost" || h.startsWith("192.168.") || h.endsWith(".local");
};

const DEFAULT_REMOTE = "https://current-ant-touching.ngrok-free.app";
const ROOT = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (isLocalHost() ? "http://localhost:5000" : DEFAULT_REMOTE)
).replace(/\/+$/, "");

export const BASE_URL = `${ROOT}/api`;

export async function fetchFromBackend<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${path}`;

  const headers = new Headers(options.headers || {});

  // Token (si no lo enviaste ya)
  if (isBrowser && !headers.has("Authorization")) {
    const token = localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  // Header para ngrok
  try {
    const u = new URL(url);
    if (/\bngrok(-free)?\.app$/i.test(u.hostname)) {
      headers.set("ngrok-skip-browser-warning", "true");
    }
  } catch {}

  // Content-Type solo si hay body y NO es FormData
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

  // Timeout (60s)
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60_000);

  const res = await fetch(url, {
    ...options,
    headers,
    mode: "cors",
    cache: "no-store",
    signal: controller.signal,
  }).catch((e) => {
    clearTimeout(timer);
    throw e;
  });

  clearTimeout(timer);

  const ct = res.headers.get("content-type") || "";
  const body = ct.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    if (res.status === 401 && isBrowser) {
      localStorage.removeItem("token");
      localStorage.removeItem("userIcon");
    }
    const msg =
      typeof body === "string"
        ? `HTTP ${res.status} ${res.statusText}`
        : body?.message || body?.error || "Error en la solicitud";
    console.error("❌ Backend error:", res.status, body);
    throw new Error(msg);
  }

  if (typeof body === "string") {
    console.error("⚠️ Esperaba JSON pero recibí:", ct, "→", body.slice(0, 200));
    throw new Error(`El backend respondió ${ct}. ¿La URL es correcta?`);
  }

  return body as T;
}
