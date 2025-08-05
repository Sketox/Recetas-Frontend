"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Recipe } from "types/recipe";
import RecipeCard from "@/components/recipeCard";
import { fetchFromBackend } from "@/services/index";


export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleViewRecipe = (recipe: Recipe) => {
    localStorage.setItem("selectedRecipe", JSON.stringify(recipe));
    router.push("/recipe_detail");
  };

  // ✅ Detectar categoría desde la URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  // ✅ Fetch de recetas
  
  useEffect(() => {
      const fetchRecipes = async () => {
        try {
          const data = await fetchFromBackend<Recipe[]>("/recipes", {
            method: "GET",
            cache: "no-store",
          });

          console.log("📦 Todas las recetas:", data);
          setRecipes(data);
          setFilteredRecipes(data);
        } catch (error) {
          console.error("Error fetching recipes:", error);
        }
      };

      fetchRecipes();
    }, []);



  // ✅ Lógica de filtrado
  useEffect(() => {
    let filtered = recipes;

    if (searchTerm) {
      filtered = filtered.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "Filtrar por categoría") {
      filtered = filtered.filter(
        (recipe) =>
          recipe.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedDifficulty && selectedDifficulty !== "Filtrar por dificultad") {
      filtered = filtered.filter(
        (recipe) =>
          recipe.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase()
      );
    }

    setFilteredRecipes(filtered);
  }, [searchTerm, selectedCategory, selectedDifficulty, recipes]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Todas las Recetas</h1>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar recetas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4"
        >
          <option>Filtrar por categoría</option>
          <option value="Desayuno">Desayuno</option>
          <option value="Almuerzo">Almuerzo</option>
          <option value="Cena">Cena</option>
          <option value="Postre">Postre</option>
          <option value="Snack">Snack</option>
        </select>
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4"
        >
          <option>Filtrar por dificultad</option>
          <option value="Fácil">Fácil</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Difícil">Difícil</option>
        </select>
      </div>

      <p className="text-gray-600 mb-4">
        Mostrando {filteredRecipes.length} de {recipes.length} recetas
      </p>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              title={recipe.title}
              description={recipe.description}
              imageUrl={recipe.imageUrl}
              time={(recipe.prepTime || 0) + (recipe.cookTime || 0)}
              difficulty={recipe.difficulty}
              rating={recipe.rating}
              onViewRecipe={() => handleViewRecipe(recipe)}
            />
          ))
        ) : (
          <p>No hay recetas disponibles</p>
        )}
      </div>
    </main>
  );
}
