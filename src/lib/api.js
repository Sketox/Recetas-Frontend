export async function fetchRecipesFromAI(message) {
  const res = await fetch("http://localhost:5000/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  return data.recipes;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Obtener todas las recetas
export async function getRecipes() {
  const res = await fetch(`${API_URL}/recipes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener recetas");
  }

  return res.json();
}

// Crear una receta nueva
export async function createRecipe(recipe) {
  const res = await fetch(`${API_URL}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  });

  if (!res.ok) {
    throw new Error("Error al crear la receta");
  }

  return res.json();
}
