// src/lib/api.js
import { fetchFromBackend } from "@/services";

/** Pedir 3 recetas a la IA */
export async function fetchRecipesFromAI(message) {
  const data = await fetchFromBackend("/ai/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  return Array.isArray(data?.recipes) ? data.recipes : [];
}

/** Obtener todas las recetas */
export async function getRecipes() {
  try {
    const data = await fetchFromBackend("/recipes", { method: "GET" });
    // El backend puede devolver [] o { recipes: [...] }
    return Array.isArray(data) ? data : data?.recipes ?? [];
  } catch (err) {
    console.error("getRecipes error:", err);
    return [];
  }
}

/** Obtener categorías con conteo calculado desde las recetas */
export async function getCategories() {
  const BASE = [
    { icon: "🥐", name: "Desayuno" },
    { icon: "🍴", name: "Almuerzo" },
    { icon: "🍝", name: "Cena" },
    { icon: "🍰", name: "Postre" },
    { icon: "🍪", name: "Snack" },
  ];

  try {
    const recipes = await getRecipes();
    const counts = new Map();
    for (const r of recipes) {
      const k = r?.category;
      if (!k) continue;
      counts.set(k, (counts.get(k) || 0) + 1);
    }
    return BASE.map((b) => ({ ...b, count: counts.get(b.name) || 0 }));
  } catch (e) {
    console.error("getCategories error:", e);
    return BASE.map((b) => ({ ...b, count: 0 }));
  }
}

/** Crear receta */
export async function createRecipe(recipe) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return fetchFromBackend("/recipes", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: JSON.stringify(recipe),
  });
}
