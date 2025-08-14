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
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 8;

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
    // Reset a la primera página cuando cambian los filtros
    setCurrentPage(1);
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
            <div className="relative flex-1">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título…"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

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

            {(searchTerm || selectedCategory || selectedDifficulty) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSelectedDifficulty("");
                }}
                className="md:ml-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm font-medium flex items-center justify-center"
              >
                Limpiar filtros
              </button>
            )}
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
          <>
            {/* Información de resultados */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">
                Mostrando {Math.min(((currentPage - 1) * recipesPerPage) + 1, filtered.length)} - {Math.min(currentPage * recipesPerPage, filtered.length)} de {filtered.length} recetas
                {(searchTerm || selectedCategory || selectedDifficulty) && (
                  <span className="ml-1">
                    ({filtered.length === recipes.length ? 'sin filtros' : 'filtradas'})
                  </span>
                )}
              </p>
            </div>
            
            {/* Grid de recetas */}
            <div className={`grid gap-8 ${
              filtered.length <= 2 ? 'sm:grid-cols-1 md:grid-cols-2' : 
              filtered.length <= 3 ? 'sm:grid-cols-2 md:grid-cols-3' :
              'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {filtered
                .slice((currentPage - 1) * recipesPerPage, currentPage * recipesPerPage)
                .map((r, i) => (
                <div
                  key={r._id || r.id || i}
                  className="transform hover:scale-[1.01] transition mx-auto w-full max-w-sm"
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
            
            {/* Paginación */}
            {filtered.length > recipesPerPage && (
              <div className="mt-12 flex flex-col items-center">
                <p className="text-sm text-gray-600 mb-4">
                  Página {currentPage} de {Math.ceil(filtered.length / recipesPerPage)}
                </p>
                <div className="inline-flex rounded-md shadow-sm overflow-x-auto max-w-full pb-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-sm font-medium rounded-l-lg border border-gray-200 
                    ${currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Anterior
                  </button>
                  
                  {/* Números de página - optimizado para mostrar solo algunas páginas */}
                  {(() => {
                    const totalPages = Math.ceil(filtered.length / recipesPerPage);
                    // Si hay menos de 8 páginas, mostrar todas
                    if (totalPages <= 7) {
                      return Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-4 py-2 text-sm font-medium border border-gray-200
                          ${currentPage === i + 1
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                          {i + 1}
                        </button>
                      ));
                    } else {
                      // Mostrar primera, última y algunas páginas alrededor de la actual
                      const pages = [];
                      // Primera página
                      pages.push(
                        <button
                          key={1}
                          onClick={() => setCurrentPage(1)}
                          className={`px-4 py-2 text-sm font-medium border border-gray-200
                          ${currentPage === 1
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                          1
                        </button>
                      );
                      
                      // Páginas intermedias
                      let startPage = Math.max(2, currentPage - 1);
                      let endPage = Math.min(totalPages - 1, currentPage + 1);
                      
                      if (currentPage > 3) {
                        pages.push(
                          <span key="start-ellipsis" className="px-3 py-2 border border-gray-200">...</span>
                        );
                      }
                      
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`px-4 py-2 text-sm font-medium border border-gray-200
                            ${currentPage === i
                              ? 'bg-blue-500 text-white' 
                              : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                          >
                            {i}
                          </button>
                        );
                      }
                      
                      if (currentPage < totalPages - 2) {
                        pages.push(
                          <span key="end-ellipsis" className="px-3 py-2 border border-gray-200">...</span>
                        );
                      }
                      
                      // Última página
                      pages.push(
                        <button
                          key={totalPages}
                          onClick={() => setCurrentPage(totalPages)}
                          className={`px-4 py-2 text-sm font-medium border border-gray-200
                          ${currentPage === totalPages
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                          {totalPages}
                        </button>
                      );
                      
                      return pages;
                    }
                  })()}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filtered.length / recipesPerPage), prev + 1))}
                    disabled={currentPage >= Math.ceil(filtered.length / recipesPerPage)}
                    className={`px-4 py-2 text-sm font-medium rounded-r-lg border border-gray-200
                    ${currentPage >= Math.ceil(filtered.length / recipesPerPage)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
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
