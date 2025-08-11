export async function fetchRecipesFromAI(message) {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  return data.recipes;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Obtener todas las recetas
export const getRecipes = async () => {
  try {
    const token = localStorage.getItem("authToken"); // donde guardaste el token
    const response = await fetch("/api/recipes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener recetas");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getRecipes:", error);
    return [];
  }
};

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
