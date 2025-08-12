"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Recipe } from "@/types/recipe";
import RecipeCard from "@/components/recipeCard";
import { getRecipes } from "@/lib/api";

export default function RecipesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filtered, setFiltered] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  // Lee categoría desde la URL (e.g. /recipes?category=Postre)
  useEffect(() => {
    const cat = searchParams.get("category") || "";
    setSelectedCategory(cat);
  }, [searchParams]);

  // Carga recetas desde el backend
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setRecipes([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Opciones dinámicas de categorías (derivadas de las recetas)
  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach((r) => r.category && set.add(r.category));
    return Array.from(set);
  }, [recipes]);

  // Aplica filtros
  useEffect(() => {
    let list = recipes;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((r) => r.title?.toLowerCase().includes(q));
    }

    if (selectedCategory) {
      const cat = selectedCategory.toLowerCase();
      list = list.filter((r) => r.category?.toLowerCase() === cat);
    }

    if (selectedDifficulty) {
      const dif = selectedDifficulty.toLowerCase();
      list = list.filter((r) => r.difficulty?.toLowerCase() === dif);
    }

    setFiltered(list);
  }, [recipes, searchTerm, selectedCategory, selectedDifficulty]);

  const handleViewRecipe = (recipe: Recipe) => {
    localStorage.setItem("selectedRecipe", JSON.stringify(recipe));
    router.push("/recipe_detail");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Todas las recetas
          </h1>
          <p className="text-gray-600">
            Filtra por nombre, categoría o dificultad
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título…"
              className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Todas las categorías</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Todas las dificultades</option>
              <option value="Fácil">Fácil</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>
        </div>

        {/* Grid de recetas */}
        {loading ? (
          // Skeleton mientras carga
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((r, i) => (
              <div
                key={r._id || r.id || i}
                className="transform hover:scale-[1.01] transition"
              >
                <RecipeCard
                  recipeId={r._id || r.id}
                  title={r.title}
                  description={r.description}
                  imageUrl={r.imageUrl}
                  time={(r.prepTime || 0) + (r.cookTime || 0)}
                  difficulty={r.difficulty}
                  rating={r.rating}
                  author={r.author}
                  onViewRecipe={() => handleViewRecipe(r)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No encontramos resultados
            </h3>
            <p className="text-gray-500">
              Prueba con otro término o cambia los filtros.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
