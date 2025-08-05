import { fetchFromBackend } from "../services/index";

export async function fetchRecipesFromAI(message) {
  try {
    const data = await fetchFromBackend("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
    return data.recipes;
  } catch (error) {
    console.error("Error fetching AI recipes:", error);
    return [];
  }
}

// Obtener todas las recetas
export const getRecipes = async () => {
  try {
    const data = await fetchFromBackend("/recipes", {
      method: "GET",
    });
    return data;
  } catch (error) {
    console.error("Error en getRecipes:", error);
    return [];
  }
};


// Crear una receta nueva
export async function createRecipe(recipe) {
  try {
    const token = localStorage.getItem("token");
    const data = await fetchFromBackend("/recipes", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(recipe),
    });
    return data;
  } catch (error) {
    console.error("Error al crear la receta:", error);
    throw error;
  }
}
