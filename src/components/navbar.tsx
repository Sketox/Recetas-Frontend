"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getIconComponent } from "@/utils/IconSelector";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { fetchFromBackend } from "@/services";

interface SearchSuggestion {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  matchedIngredients: string[];
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, userIcon } = useAuth();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const IconComponent = getIconComponent(userIcon || "user-circle");

  // Buscar sugerencias cuando cambia el query
  useEffect(() => {
    const searchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      console.log("🔍 Buscando sugerencias para:", searchQuery);
      setShowSuggestions(true); // Mostrar dropdown incluso si no hay sugerencias

      try {
        const data = await fetchFromBackend(`/recipes/search-suggestions?q=${encodeURIComponent(searchQuery)}`) as SearchSuggestion[];
        console.log("🔍 Sugerencias recibidas:", data);
        setSuggestions(data || []);
      } catch (error) {
        console.error("Error al buscar sugerencias:", error);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(searchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = async (suggestion: SearchSuggestion) => {
    console.log("🔗 Navegando a receta:", suggestion);
    try {
      // Obtener la receta completa del backend
      const fullRecipe = await fetchFromBackend(`/recipes/${suggestion.id}`);
      localStorage.setItem("selectedRecipe", JSON.stringify(fullRecipe));
      router.push("/recipe_detail");
    } catch (error) {
      console.error("Error al obtener receta completa:", error);
      // Fallback: usar los datos limitados de la sugerencia
      localStorage.setItem("selectedRecipe", JSON.stringify(suggestion));
      router.push("/recipe_detail");
    }
    setSearchQuery("");
    setShowSuggestions(false);
    setSearchExpanded(false);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      console.log("🔍 Búsqueda con Enter:", searchQuery);
      // Redirigir a la página de recetas con el término de búsqueda
      router.push(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
      setSearchExpanded(false);
    }
  };

  return (
    <nav className="flex justify-between items-center shadow-md border-b border-gray-100 p-4 sticky top-0 z-50 bg-white">
      {/* Logo y navegación izquierda */}
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image
            src="/Cooksy1.svg"
            alt="Cooksy Logo"
            width={100}
            height={100}
            className="h-10 w-auto"
          />
        </Link>
        <Link
          href="/recipes"
          className="ml-6 text-gray-700 hover:text-orange-500 transition-transform duration-300 hover:scale-110"
        >
          Ver Recetas
        </Link>
        <Link
          href="/diet"
          className="ml-4 text-gray-700 hover:text-orange-500 transition-transform duration-300 hover:scale-110"
        >
          Mostrar Dieta
        </Link>
        <Link
          href="/ChatBot"
          className="ml-4 text-gray-700 hover:text-orange-500 transition-transform duration-300 hover:scale-110"
        >
          ChatBot
        </Link>
      </div>

      {/* Contenedor derecho */}
      <div className="flex items-center gap-4">
        {/* Barra de búsqueda responsive con sugerencias */}
        <div className="relative" ref={searchRef}>
          <div
            className={`flex items-center border border-gray-300 rounded-full bg-white transition-all duration-300 overflow-hidden ${
              searchExpanded ? "w-48 sm:w-64 md:w-80" : "w-10"
            }`}
          >
            <button
              onClick={() => setSearchExpanded(!searchExpanded)}
              className="flex items-center justify-center w-10 h-10"
            >
              <FaSearch className="text-gray-500" />
            </button>
            {searchExpanded && (
              <input
                type="text"
                placeholder="Buscar recetas..."
                className="bg-transparent outline-none px-3 py-2 text-gray-700 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                autoFocus
              />
            )}
          </div>

          {/* Dropdown de sugerencias */}
          {showSuggestions && searchExpanded && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {suggestions.length > 0 ? (
                <>
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    >
                      {suggestion.imageUrl && (
                        <img 
                          src={suggestion.imageUrl} 
                          alt={suggestion.title}
                          className="w-12 h-12 object-cover rounded-lg mr-3"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{suggestion.title}</h4>
                        <p className="text-xs text-gray-500">{suggestion.category}</p>
                        {suggestion.matchedIngredients.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {suggestion.matchedIngredients.slice(0, 3).map((ingredient, index) => (
                              <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                                {ingredient}
                              </span>
                            ))}
                            {suggestion.matchedIngredients.length > 3 && (
                              <span className="text-xs text-gray-500">+{suggestion.matchedIngredients.length - 3} más</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {searchQuery.trim().length >= 2 && (
                    <div
                      onClick={() => {
                        router.push(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
                        setSearchQuery("");
                        setShowSuggestions(false);
                        setSearchExpanded(false);
                      }}
                      className="flex items-center p-3 hover:bg-blue-50 cursor-pointer border-t border-gray-200 text-blue-600"
                    >
                      <FaSearch className="mr-3" />
                      <span className="text-sm font-medium">Ver todos los resultados para "{searchQuery}"</span>
                    </div>
                  )}
                </>
              ) : searchQuery.trim().length >= 2 ? (
                <div
                  onClick={() => {
                    router.push(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchQuery("");
                    setShowSuggestions(false);
                    setSearchExpanded(false);
                  }}
                  className="flex items-center p-3 hover:bg-blue-50 cursor-pointer text-blue-600"
                >
                  <FaSearch className="mr-3" />
                  <span className="text-sm">Buscar "{searchQuery}" en todas las recetas</span>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Botones de sesión o ícono de perfil */}
        {!isAuthenticated && pathname !== "/register" && (
          <Link href="/register">
            <button className="px-5 py-2 bg-orange-400 text-white rounded hover:bg-orange-600 transition-transform hover:scale-110">
              Regístrate
            </button>
          </Link>
        )}

        {!isAuthenticated && pathname !== "/login" && (
          <Link href="/login">
            <button className="border px-4 py-2 rounded bg-white hover:bg-gray-100 font-bold transition-transform hover:scale-110">
              Iniciar Sesión
            </button>
          </Link>
        )}

        {isAuthenticated && (
          <button onClick={() => router.push("/user")}>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:scale-110 transition-transform">
              <IconComponent className="w-6 h-6 text-orange-500" />
            </div>
          </button>
        )}
      </div>
    </nav>
  );
}
