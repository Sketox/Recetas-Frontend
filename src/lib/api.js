// src/lib/api.js
import { BASE_URL } from "@/services";

const API_BASE = BASE_URL.replace(/\/$/, ""); // ya incluye /api

async function jsonFetch(path, opts = {}) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE}${p}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      ...(opts.headers || {}),
    },
    cache: "no-store",
    ...opts,
  });

  const ct = res.headers.get("content-type") || "";

  if (!ct.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Expected JSON from ${url} pero llegó ${ct || "desconocido"} (status ${
        res.status
      }). ` + `Primeros bytes: ${text.slice(0, 120)}`
    );
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error || err?.message || `HTTP ${res.status} en ${url}`
    );
  }

  return res.json();
}

export async function fetchRecipesFromAI(message) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 90_000);
  try {
    const json = await jsonFetch("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
      signal: controller.signal,
    });
    return Array.isArray(json?.recipes) ? json.recipes : [];
  } finally {
    clearTimeout(t);
  }
}

export async function getRecipes() {
  return jsonFetch("/recipes");
}

export async function getCategories() {
  // 1) endpoint dedicado si existe
  try {
    return await jsonFetch("/recipes/categories");
  } catch (_) {}
  // 2) fallback desde recetas
  const list = await getRecipes();
  const map = new Map();
  const icon = (name = "") => {
    const n = name.toLowerCase();
    if (n === "desayuno") return "🍳";
    if (n === "almuerzo") return "🍽️";
    if (n === "cena") return "🌙";
    if (n === "postre") return "🍰";
    if (n === "snack") return "🥨";
    return "🍲";
  };
  (list || []).forEach((r) => {
    const name = r?.category || "Otros";
    const curr = map.get(name) || { name, icon: icon(name), count: 0 };
    curr.count += 1;
    map.set(name, curr);
  });
  return Array.from(map.values());
}
